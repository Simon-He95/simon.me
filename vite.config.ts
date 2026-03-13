import type { Plugin, UserConfig } from 'vite'
import { resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import { compileScript, parse as parseSfc } from '@vue/compiler-sfc'
import fs from 'fs-extra'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import LinkAttributes from 'markdown-it-link-attributes'
import Prism from 'markdown-it-prism'
// @ts-expect-error missing types
import TOC from 'markdown-it-table-of-contents'
import { presetAttributify, presetIcons, presetUno } from 'unocss'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { createLogger } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Pages from 'vite-plugin-pages'
import SVG from 'vite-svg-loader'
import { slugify } from './scripts/slugify'

import 'prismjs/components/prism-regex'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-xml-doc'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javadoclike'
import 'prismjs/components/prism-javadoc'
import 'prismjs/components/prism-jsdoc'

const externalLinkRegex = /^https?:\/\//
const markdownFileRegex = /\.md$/
const codeTagRegex = /<code(.*?)>/g
const fenceStartRegex = /^(```+|~~~+)/
const lineBreakRegex = /\r?\n/
const scriptTagStartRegex = /^<script\b([^>]*)>$/
const scriptTagEndRegex = /^<\/script>$/
const styleTagStartRegex = /^<style\b([^>]*)>$/
const styleTagEndRegex = /^<\/style>$/
const scriptLangRegex = /\blang=["']([^"']+)["']/
const scriptSetupAttrRegex = /\bsetup\b/

function serializeForSfc(value: unknown) {
  return JSON.stringify(value).replaceAll('</script', '<\\/script')
}

function createHeadMeta(frontmatter: Record<string, any>) {
  const title = frontmatter.title ?? frontmatter.display
  const description = frontmatter.description
  const meta = Array.isArray(frontmatter.meta) ? [...frontmatter.meta] : []

  if (title) {
    meta.unshift(
      { property: 'og:title', content: title },
      { name: 'twitter:title', content: title },
    )
  }

  if (description) {
    meta.push(
      { name: 'description', content: description },
      { property: 'og:description', content: description },
      { name: 'twitter:description', content: description },
    )
  }

  if (!title && meta.length === 0)
    return null

  return {
    ...(title ? { title } : {}),
    meta,
  }
}

function extractEmbeddedBlocks(markdown: string) {
  const output: string[] = []
  const setupScripts: { content: string, lang: string | null }[] = []
  const normalScripts: { content: string, lang: string | null }[] = []
  const styleBlocks: { attrs: string, content: string }[] = []
  const lines = markdown.split(lineBreakRegex)

  let inFence = false
  let currentBlock: {
    attrs: string
    lang: string | null
    type: 'script' | 'style'
    isSetup: boolean
    lines: string[]
  } | null = null

  for (const line of lines) {
    const trimmed = line.trim()

    if (!currentBlock) {
      if (fenceStartRegex.test(trimmed))
        inFence = !inFence

      if (!inFence) {
        const scriptStart = trimmed.match(scriptTagStartRegex)
        if (scriptStart) {
          const attrs = scriptStart[1] || ''
          currentBlock = {
            attrs,
            isSetup: scriptSetupAttrRegex.test(attrs),
            lang: attrs.match(scriptLangRegex)?.[1] ?? null,
            type: 'script',
            lines: [],
          }
          continue
        }

        const styleStart = trimmed.match(styleTagStartRegex)
        if (styleStart) {
          currentBlock = {
            attrs: styleStart[1] || '',
            isSetup: false,
            lang: null,
            type: 'style',
            lines: [],
          }
          continue
        }
      }

      output.push(line)
      continue
    }

    const isScriptEnd = currentBlock.type === 'script' && scriptTagEndRegex.test(trimmed)
    const isStyleEnd = currentBlock.type === 'style' && styleTagEndRegex.test(trimmed)

    if (isScriptEnd || isStyleEnd) {
      if (currentBlock.type === 'style') {
        styleBlocks.push({
          attrs: currentBlock.attrs,
          content: currentBlock.lines.join('\n').trim(),
        })
      }
      else {
        const target = currentBlock.isSetup ? setupScripts : normalScripts
        target.push({
          content: currentBlock.lines.join('\n').trim(),
          lang: currentBlock.lang,
        })
      }
      currentBlock = null
      continue
    }

    currentBlock.lines.push(line)
  }

  return {
    content: output.join('\n').trim(),
    normalScripts,
    setupScripts,
    styleBlocks,
  }
}

function markdownToVuePlugin(): Plugin {
  const md = new MarkdownIt({
    html: true,
    quotes: '""\'\'',
  })
  const sfcCache = new Map<string, string>()

  md.use(Prism)
  md.use(anchor, {
    slugify,
    permalink: anchor.permalink.linkInsideHeader({
      symbol: '#',
      renderAttrs: () => ({ 'aria-hidden': 'true' }),
    }),
  })
  md.use(LinkAttributes, {
    matcher: (link: string) => externalLinkRegex.test(link),
    attrs: {
      target: '_blank',
      rel: 'noopener',
    },
  })
  md.use(TOC, {
    includeLevel: [1, 2, 3],
    slugify,
  })

  function renderMarkdownSfc(code: string, cleanId: string) {
    const { content, data } = matter(code)
    const { content: markdownContent, normalScripts, setupScripts, styleBlocks } = extractEmbeddedBlocks(content)
    const html = md.render(markdownContent).replace(codeTagRegex, '<code$1 v-pre>')
    const frontmatter = data as Record<string, any>
    const head = createHeadMeta(frontmatter)
    const scriptLang = setupScripts.some(i => i.lang === 'ts') ? ' lang="ts"' : ''

    const setupLines = [
      head ? 'import { useHead } from \'@unhead/vue\'' : '',
      `const frontmatter = ${serializeForSfc(frontmatter)}`,
      'defineExpose({ frontmatter })',
      head ? `const head = ${serializeForSfc(head)}` : '',
      head ? 'useHead(head)' : '',
      ...setupScripts.map(i => i.content).filter(Boolean),
    ].filter(Boolean)

    const normalScriptBlocks = normalScripts
      .filter(i => i.content)
      .map((i) => {
        const lang = i.lang ? ` lang="${i.lang}"` : ''
        return `<script${lang}>\n${i.content}\n</script>`
      })
      .join('\n')

    const styleSfcBlocks = styleBlocks
      .filter(i => i.content)
      .map(i => `<style${i.attrs}>\n${i.content}\n</style>`)
      .join('\n')

    const sfc = [
      `<template><Post :frontmatter="frontmatter"><div class="prose m-auto">${html}</div></Post></template>`,
      `<script setup${scriptLang}>\n${setupLines.join('\n\n')}\n</script>`,
      normalScriptBlocks,
      styleSfcBlocks,
    ].filter(Boolean).join('\n')

    sfcCache.set(cleanId, sfc)
    return sfc
  }

  return {
    name: 'project-markdown-to-vue',
    enforce: 'pre',
    load(id) {
      const [cleanId, rawQuery] = id.split('?', 2)
      if (!markdownFileRegex.test(cleanId) || !rawQuery?.includes('vue&type='))
        return null

      const sfc = sfcCache.get(cleanId) ?? renderMarkdownSfc(fs.readFileSync(cleanId, 'utf-8'), cleanId)
      const { descriptor } = parseSfc(sfc, { filename: cleanId })
      const query = new URLSearchParams(rawQuery)
      const type = query.get('type')

      if (type === 'template')
        return descriptor.template?.content ?? ''

      if (type === 'script') {
        return compileScript(descriptor, {
          id: cleanId,
        }).content
      }

      if (type === 'style') {
        const index = Number(query.get('index') || 0)
        return descriptor.styles[index]?.content ?? ''
      }

      return null
    },
    transform(code, id) {
      if (id.includes('?'))
        return null

      const cleanId = id.split('?', 1)[0]
      if (!markdownFileRegex.test(cleanId))
        return null
      return renderMarkdownSfc(code, cleanId)
    },
  }
}

const viteLogger = createLogger()
const baseWarn = viteLogger.warn
const baseWarnOnce = viteLogger.warnOnce
const suppressedWarningFragments = [
  `doesn't exist at build time, it will remain unchanged to be resolved at runtime`,
  'has been externalized for browser compatibility',
]

function shouldSuppressWarning(msg: string) {
  return suppressedWarningFragments.some(fragment => msg.includes(fragment))
}

viteLogger.warn = (msg, options) => {
  if (shouldSuppressWarning(msg))
    return

  baseWarn(msg, options)
}

viteLogger.warnOnce = (msg, options) => {
  if (shouldSuppressWarning(msg))
    return

  baseWarnOnce(msg, options)
}

const config: UserConfig = {
  customLogger: viteLogger,
  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  resolve: {
    alias: [
      { find: '~/', replacement: `${resolve(__dirname, 'src')}/` },
    ],
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'dayjs',
      'dayjs/plugin/localizedFormat',
      // 添加常用的依赖项，避免运行时重新打包
      'markdown-it',
      'markdown-it-anchor',
    ],
    exclude: [
      'text-expansion-animation',
    ],
  },
  plugins: [
    UnoCSS({
      theme: {
        fontFamily: {
          sans: '"Inter", Inter var,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
        },
      },
      presets: [
        presetIcons({
          extraProperties: {
            'display': 'inline-block',
            'height': '1.2em',
            'width': '1.2em',
            'vertical-align': 'text-bottom',
          },
        }),
        presetAttributify(),
        presetUno(),
      ],
      shortcuts: {
        moveY: ['translate-y-[-500px]'],
      },
    }),

    markdownToVuePlugin(),

    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Pages({
      extensions: ['vue', 'md'],
      dirs: 'pages',
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1))

        if (!path.includes('projects.md')) {
          const md = fs.readFileSync(path, 'utf-8')
          const { data } = matter(md)
          route.meta = Object.assign(route.meta || {}, { frontmatter: data })
        }

        return route
      },
    }),

    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        {
          '@unhead/vue': [
            'useHead',
          ],
        },
      ],
    }),

    Components({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),

    Inspect(),

    Icons({
      defaultClass: 'inline',
      defaultStyle: 'vertical-align: sub;',
    }),

    SVG({
      svgo: false,
    }),
  ],

  build: {
    chunkSizeWarningLimit: 1200,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      onwarn(warning, next) {
        if (
          warning.code === 'PLUGIN_WARNING'
          && warning.message.includes('fileSpliceWorker.js')
        ) {
          return
        }

        if (warning.code !== 'UNUSED_EXTERNAL_IMPORT')
          next(warning)
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  ssgOptions: {
    formatting: 'minify',
  },
}

export default config
