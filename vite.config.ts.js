// vite.config.ts
import { resolve } from "path";
import fs from "fs-extra";
import Pages from "vite-plugin-pages";
import Inspect from "vite-plugin-inspect";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import Markdown from "vite-plugin-md";
import Vue from "@vitejs/plugin-vue";
import Prism from "markdown-it-prism";
import matter from "gray-matter";
import AutoImport from "unplugin-auto-import/vite";
import anchor from "markdown-it-anchor";
import LinkAttributes from "markdown-it-link-attributes";
import UnoCSS from "unocss/vite";
import SVG from "vite-svg-loader";
import { presetAttributify, presetIcons, presetUno } from "unocss";
import TOC from "markdown-it-table-of-contents";

// scripts/slugify.ts
import { remove } from "diacritics";
var rControl = /[\u0000-\u001F]/g;
var rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g;
var slugify = (str) => {
  return remove(str).replace(rControl, "").replace(rSpecial, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "").replace(/^(\d)/, "_$1").toLowerCase();
};

// vite.config.ts
import "prismjs/components/prism-regex";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-xml-doc";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javadoclike";
import "prismjs/components/prism-javadoc";
import "prismjs/components/prism-jsdoc";
var config = {
  resolve: {
    alias: [
      { find: "~/", replacement: `${resolve("/Users/hejian/Documents/Github/simon.me", "src")}/` }
    ]
  },
  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "@vueuse/core",
      "dayjs",
      "dayjs/plugin/localizedFormat"
    ]
  },
  plugins: [
    UnoCSS({
      theme: {
        fontFamily: {
          sans: '"Inter", Inter var,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji'
        }
      },
      presets: [
        presetIcons({
          extraProperties: {
            "display": "inline-block",
            "height": "1.2em",
            "width": "1.2em",
            "vertical-align": "text-bottom"
          }
        }),
        presetAttributify(),
        presetUno()
      ]
    }),
    Vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Pages({
      extensions: ["vue", "md"],
      pagesDir: "pages",
      extendRoute(route) {
        const path = resolve("/Users/hejian/Documents/Github/simon.me", route.component.slice(1));
        if (!path.includes("projects.md")) {
          const md = fs.readFileSync(path, "utf-8");
          const { data } = matter(md);
          route.meta = Object.assign(route.meta || {}, { frontmatter: data });
        }
        return route;
      }
    }),
    Markdown({
      wrapperComponent: "post",
      wrapperClasses: "prose m-auto",
      headEnabled: true,
      markdownItOptions: {
        quotes: `""''`
      },
      markdownItSetup(md) {
        md.use(Prism);
        md.use(anchor, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: "#",
            renderAttrs: () => ({ "aria-hidden": "true" })
          })
        });
        md.use(LinkAttributes, {
          matcher: (link) => /^https?:\/\//.test(link),
          attrs: {
            target: "_blank",
            rel: "noopener"
          }
        });
        md.use(TOC, {
          includeLevel: [1, 2, 3],
          slugify
        });
      }
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "@vueuse/core",
        "@vueuse/head"
      ]
    }),
    Components({
      extensions: ["vue", "md"],
      dts: true,
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: ""
        })
      ]
    }),
    Inspect(),
    Icons({
      defaultClass: "inline",
      defaultStyle: "vertical-align: sub;"
    }),
    SVG({
      svgo: false
    })
  ],
  build: {
    rollupOptions: {
      onwarn(warning, next) {
        if (warning.code !== "UNUSED_EXTERNAL_IMPORT")
          next(warning);
      }
    }
  },
  ssgOptions: {
    formatting: "minify",
    format: "cjs"
  }
};
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic2NyaXB0cy9zbHVnaWZ5LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcclxuaW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJ1xyXG5pbXBvcnQgUGFnZXMgZnJvbSAndml0ZS1wbHVnaW4tcGFnZXMnXHJcbmltcG9ydCBJbnNwZWN0IGZyb20gJ3ZpdGUtcGx1Z2luLWluc3BlY3QnXHJcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJ1xyXG5pbXBvcnQgSWNvbnNSZXNvbHZlciBmcm9tICd1bnBsdWdpbi1pY29ucy9yZXNvbHZlcidcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IE1hcmtkb3duIGZyb20gJ3ZpdGUtcGx1Z2luLW1kJ1xyXG5pbXBvcnQgVnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IFByaXNtIGZyb20gJ21hcmtkb3duLWl0LXByaXNtJ1xyXG5pbXBvcnQgbWF0dGVyIGZyb20gJ2dyYXktbWF0dGVyJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgYW5jaG9yIGZyb20gJ21hcmtkb3duLWl0LWFuY2hvcidcclxuaW1wb3J0IExpbmtBdHRyaWJ1dGVzIGZyb20gJ21hcmtkb3duLWl0LWxpbmstYXR0cmlidXRlcydcclxuaW1wb3J0IFVub0NTUyBmcm9tICd1bm9jc3Mvdml0ZSdcclxuaW1wb3J0IFNWRyBmcm9tICd2aXRlLXN2Zy1sb2FkZXInXHJcbmltcG9ydCB7IHByZXNldEF0dHJpYnV0aWZ5LCBwcmVzZXRJY29ucywgcHJlc2V0VW5vIH0gZnJvbSAndW5vY3NzJ1xyXG4vLyBAdHMtZXhwZWN0LWVycm9yIG1pc3NpbmcgdHlwZXNcclxuaW1wb3J0IFRPQyBmcm9tICdtYXJrZG93bi1pdC10YWJsZS1vZi1jb250ZW50cydcclxuaW1wb3J0IHsgc2x1Z2lmeSB9IGZyb20gJy4vc2NyaXB0cy9zbHVnaWZ5J1xyXG5cclxuaW1wb3J0ICdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tcmVnZXgnXHJcbmltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWphdmFzY3JpcHQnXHJcbmltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXR5cGVzY3JpcHQnXHJcbmltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXhtbC1kb2MnXHJcbmltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLXlhbWwnXHJcbmltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLWpzb24nXHJcbmltcG9ydCAncHJpc21qcy9jb21wb25lbnRzL3ByaXNtLW1hcmtkb3duJ1xyXG5pbXBvcnQgJ3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1qYXZhJ1xyXG5pbXBvcnQgJ3ByaXNtanMvY29tcG9uZW50cy9wcmlzbS1qYXZhZG9jbGlrZSdcclxuaW1wb3J0ICdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tamF2YWRvYydcclxuaW1wb3J0ICdwcmlzbWpzL2NvbXBvbmVudHMvcHJpc20tanNkb2MnXHJcblxyXG5jb25zdCBjb25maWc6IFVzZXJDb25maWcgPSB7XHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IFtcclxuICAgICAgeyBmaW5kOiAnfi8nLCByZXBsYWNlbWVudDogYCR7cmVzb2x2ZShcIi9Vc2Vycy9oZWppYW4vRG9jdW1lbnRzL0dpdGh1Yi9zaW1vbi5tZVwiLCAnc3JjJyl9L2AgfSxcclxuICAgIF0sXHJcbiAgfSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFtcclxuICAgICAgJ3Z1ZScsXHJcbiAgICAgICd2dWUtcm91dGVyJyxcclxuICAgICAgJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgICdkYXlqcycsXHJcbiAgICAgICdkYXlqcy9wbHVnaW4vbG9jYWxpemVkRm9ybWF0JyxcclxuICAgIF0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICBVbm9DU1Moe1xyXG4gICAgICB0aGVtZToge1xyXG4gICAgICAgIGZvbnRGYW1pbHk6IHtcclxuICAgICAgICAgIHNhbnM6ICdcIkludGVyXCIsIEludGVyIHZhcixzeXN0ZW0tdWksLWFwcGxlLXN5c3RlbSxCbGlua01hY1N5c3RlbUZvbnQsU2Vnb2UgVUksUm9ib3RvLEhlbHZldGljYSBOZXVlLEFyaWFsLE5vdG8gU2FucyxzYW5zLXNlcmlmLEFwcGxlIENvbG9yIEVtb2ppLFNlZ29lIFVJIEVtb2ppLFNlZ29lIFVJIFN5bWJvbCxOb3RvIENvbG9yIEVtb2ppJyxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBwcmVzZXRzOiBbXHJcbiAgICAgICAgcHJlc2V0SWNvbnMoe1xyXG4gICAgICAgICAgZXh0cmFQcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgICAgICdkaXNwbGF5JzogJ2lubGluZS1ibG9jaycsXHJcbiAgICAgICAgICAgICdoZWlnaHQnOiAnMS4yZW0nLFxyXG4gICAgICAgICAgICAnd2lkdGgnOiAnMS4yZW0nLFxyXG4gICAgICAgICAgICAndmVydGljYWwtYWxpZ24nOiAndGV4dC1ib3R0b20nLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9KSxcclxuICAgICAgICBwcmVzZXRBdHRyaWJ1dGlmeSgpLFxyXG4gICAgICAgIHByZXNldFVubygpLFxyXG4gICAgICBdLFxyXG4gICAgfSksXHJcblxyXG4gICAgVnVlKHtcclxuICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLm1kJC9dLFxyXG4gICAgfSksXHJcblxyXG4gICAgUGFnZXMoe1xyXG4gICAgICBleHRlbnNpb25zOiBbJ3Z1ZScsICdtZCddLFxyXG4gICAgICBwYWdlc0RpcjogJ3BhZ2VzJyxcclxuICAgICAgZXh0ZW5kUm91dGUocm91dGUpIHtcclxuICAgICAgICBjb25zdCBwYXRoID0gcmVzb2x2ZShcIi9Vc2Vycy9oZWppYW4vRG9jdW1lbnRzL0dpdGh1Yi9zaW1vbi5tZVwiLCByb3V0ZS5jb21wb25lbnQuc2xpY2UoMSkpXHJcblxyXG4gICAgICAgIGlmICghcGF0aC5pbmNsdWRlcygncHJvamVjdHMubWQnKSkge1xyXG4gICAgICAgICAgY29uc3QgbWQgPSBmcy5yZWFkRmlsZVN5bmMocGF0aCwgJ3V0Zi04JylcclxuICAgICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gbWF0dGVyKG1kKVxyXG4gICAgICAgICAgcm91dGUubWV0YSA9IE9iamVjdC5hc3NpZ24ocm91dGUubWV0YSB8fCB7fSwgeyBmcm9udG1hdHRlcjogZGF0YSB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJvdXRlXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuXHJcbiAgICBNYXJrZG93bih7XHJcbiAgICAgIHdyYXBwZXJDb21wb25lbnQ6ICdwb3N0JyxcclxuICAgICAgd3JhcHBlckNsYXNzZXM6ICdwcm9zZSBtLWF1dG8nLFxyXG4gICAgICBoZWFkRW5hYmxlZDogdHJ1ZSxcclxuICAgICAgbWFya2Rvd25JdE9wdGlvbnM6IHtcclxuICAgICAgICBxdW90ZXM6ICdcIlwiXFwnXFwnJyxcclxuICAgICAgfSxcclxuICAgICAgbWFya2Rvd25JdFNldHVwKG1kKSB7XHJcbiAgICAgICAgbWQudXNlKFByaXNtKVxyXG4gICAgICAgIG1kLnVzZShhbmNob3IsIHtcclxuICAgICAgICAgIHNsdWdpZnksXHJcbiAgICAgICAgICBwZXJtYWxpbms6IGFuY2hvci5wZXJtYWxpbmsubGlua0luc2lkZUhlYWRlcih7XHJcbiAgICAgICAgICAgIHN5bWJvbDogJyMnLFxyXG4gICAgICAgICAgICByZW5kZXJBdHRyczogKCkgPT4gKHsgJ2FyaWEtaGlkZGVuJzogJ3RydWUnIH0pLFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbWQudXNlKExpbmtBdHRyaWJ1dGVzLCB7XHJcbiAgICAgICAgICBtYXRjaGVyOiAobGluazogc3RyaW5nKSA9PiAvXmh0dHBzPzpcXC9cXC8vLnRlc3QobGluayksXHJcbiAgICAgICAgICBhdHRyczoge1xyXG4gICAgICAgICAgICB0YXJnZXQ6ICdfYmxhbmsnLFxyXG4gICAgICAgICAgICByZWw6ICdub29wZW5lcicsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIG1kLnVzZShUT0MsIHtcclxuICAgICAgICAgIGluY2x1ZGVMZXZlbDogWzEsIDIsIDNdLFxyXG4gICAgICAgICAgc2x1Z2lmeSxcclxuICAgICAgICB9KVxyXG4gICAgICB9LFxyXG4gICAgfSksXHJcblxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIGltcG9ydHM6IFtcclxuICAgICAgICAndnVlJyxcclxuICAgICAgICAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgJ0B2dWV1c2UvY29yZScsXHJcbiAgICAgICAgJ0B2dWV1c2UvaGVhZCcsXHJcbiAgICAgIF0sXHJcbiAgICB9KSxcclxuXHJcbiAgICBDb21wb25lbnRzKHtcclxuICAgICAgZXh0ZW5zaW9uczogWyd2dWUnLCAnbWQnXSxcclxuICAgICAgZHRzOiB0cnVlLFxyXG4gICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kJC9dLFxyXG4gICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICBJY29uc1Jlc29sdmVyKHtcclxuICAgICAgICAgIGNvbXBvbmVudFByZWZpeDogJycsXHJcbiAgICAgICAgfSksXHJcbiAgICAgIF0sXHJcbiAgICB9KSxcclxuXHJcbiAgICBJbnNwZWN0KCksXHJcblxyXG4gICAgSWNvbnMoe1xyXG4gICAgICBkZWZhdWx0Q2xhc3M6ICdpbmxpbmUnLFxyXG4gICAgICBkZWZhdWx0U3R5bGU6ICd2ZXJ0aWNhbC1hbGlnbjogc3ViOycsXHJcbiAgICB9KSxcclxuXHJcbiAgICBTVkcoe1xyXG4gICAgICBzdmdvOiBmYWxzZSxcclxuICAgIH0pLFxyXG4gIF0sXHJcblxyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG9ud2Fybih3YXJuaW5nLCBuZXh0KSB7XHJcbiAgICAgICAgaWYgKHdhcm5pbmcuY29kZSAhPT0gJ1VOVVNFRF9FWFRFUk5BTF9JTVBPUlQnKVxyXG4gICAgICAgICAgbmV4dCh3YXJuaW5nKVxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBzc2dPcHRpb25zOiB7XHJcbiAgICBmb3JtYXR0aW5nOiAnbWluaWZ5JyxcclxuICAgIGZvcm1hdDogJ2NqcycsXHJcbiAgfSxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY29uZmlnXHJcbiIsICIvLyBzdHJpbmcuanMgc2x1Z2lmeSBkcm9wcyBub24gYXNjaWkgY2hhcnMgc28gd2UgaGF2ZSB0b1xuLy8gdXNlIGEgY3VzdG9tIGltcGxlbWVudGF0aW9uIGhlcmVcbmltcG9ydCB7IHJlbW92ZSB9IGZyb20gJ2RpYWNyaXRpY3MnXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29udHJvbC1yZWdleFxuY29uc3QgckNvbnRyb2wgPSAvW1xcdTAwMDAtXFx1MDAxRl0vZ1xuY29uc3QgclNwZWNpYWwgPSAvW1xcc35gIUAjJCVeJiooKVxcLV8rPVtcXF17fXxcXFxcOzpcIic8PiwuPy9dKy9nXG5cbmV4cG9ydCBjb25zdCBzbHVnaWZ5ID0gKHN0cjogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIChcbiAgICByZW1vdmUoc3RyKVxuICAgICAgLy8gUmVtb3ZlIGNvbnRyb2wgY2hhcmFjdGVyc1xuICAgICAgLnJlcGxhY2UockNvbnRyb2wsICcnKVxuICAgICAgLy8gUmVwbGFjZSBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgICAgIC5yZXBsYWNlKHJTcGVjaWFsLCAnLScpXG4gICAgICAvLyBSZW1vdmUgY29udGludW9zIHNlcGFyYXRvcnNcbiAgICAgIC5yZXBsYWNlKC8tezIsfS9nLCAnLScpXG4gICAgICAvLyBSZW1vdmUgcHJlZml4aW5nIGFuZCB0cmFpbGluZyBzZXBhcnRvcnNcbiAgICAgIC5yZXBsYWNlKC9eLSt8LSskL2csICcnKVxuICAgICAgLy8gZW5zdXJlIGl0IGRvZXNuJ3Qgc3RhcnQgd2l0aCBhIG51bWJlciAoIzEyMSlcbiAgICAgIC5yZXBsYWNlKC9eKFxcZCkvLCAnXyQxJylcbiAgICAgIC8vIGxvd2VyY2FzZVxuICAgICAgLnRvTG93ZXJDYXNlKClcbiAgKVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFBLFNBQVMsZUFBZTtBQUV4QixPQUFPLFFBQVE7QUFDZixPQUFPLFdBQVc7QUFDbEIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGNBQWM7QUFDckIsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sb0JBQW9CO0FBQzNCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFNBQVM7QUFDaEIsU0FBUyxtQkFBbUIsYUFBYSxpQkFBaUI7QUFFMUQsT0FBTyxTQUFTOzs7QUNqQmhCLFNBQVMsY0FBYztBQUV2QixJQUFNLFdBQVc7QUFDakIsSUFBTSxXQUFXO0FBRVYsSUFBTSxVQUFVLENBQUMsUUFBd0I7QUFDOUMsU0FDRSxPQUFPLEdBQUcsRUFFUCxRQUFRLFVBQVUsRUFBRSxFQUVwQixRQUFRLFVBQVUsR0FBRyxFQUVyQixRQUFRLFVBQVUsR0FBRyxFQUVyQixRQUFRLFlBQVksRUFBRSxFQUV0QixRQUFRLFNBQVMsS0FBSyxFQUV0QixZQUFZO0FBRW5COzs7QUREQSxPQUFPO0FBQ1AsT0FBTztBQUNQLE9BQU87QUFDUCxPQUFPO0FBQ1AsT0FBTztBQUNQLE9BQU87QUFD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
