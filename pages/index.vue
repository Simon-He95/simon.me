<script setup lang="ts">
import { useHead } from '@unhead/vue'
import MarkdownRender from 'markstream-vue'
import { computed, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, watch } from 'vue'
import { lan } from '../lang'
import { featuredRepos, simonProfile } from '../src/data/profile'
import 'markstream-vue/index.css'

const COPY = {
  en: {
    eyebrow: 'LOCAL PROFILE RUN',
    you: 'You',
    prompt: 'Who is Simon He? Check his GitHub, the work he cares about, and how he got here.',
    assistant: 'simon-agent',
    ready: 'local simulation',
    thinking: 'Thinking',
    thinkingRunning: 'building context',
    thinkingDone: 'context ready',
    thinkingText: 'I’ll read the prepared GitHub snapshot, identify the work that best reflects Simon, then connect it to the path that brought him here.',
    skills: 'Skills',
    skillsReady: '4 loaded',
    skillItems: ['profile synthesis', 'GitHub snapshot', 'project curation', 'career timeline'],
    fetch: 'Fetch',
    fetchRunning: 'reading local data',
    fetchDone: 'snapshot loaded',
    fetchHint: 'Prepared GitHub profile',
    localOnly: 'local fixture · no request sent',
    repos: 'public repos',
    followers: 'followers',
    answer: 'Answer',
    renderedBy: 'rendered by markstream-vue',
    streaming: 'streaming',
    replay: 'Replay output',
    openGithub: 'Open GitHub',
    explore: 'Explore projects',
  },
  zh: {
    eyebrow: '本地人物档案',
    you: 'You',
    prompt: 'Who is Simon He? Check his GitHub, the work he cares about, and how he got here.',
    assistant: 'simon-agent',
    ready: '本地模拟',
    thinking: 'Thinking',
    thinkingRunning: '正在整理上下文',
    thinkingDone: '上下文已就绪',
    thinkingText: '读取预先准备好的 GitHub 快照，找出最能代表 Simon 的作品，再把这些作品与他一路走来的经历连起来。',
    skills: 'Skills',
    skillsReady: '已加载 4 项',
    skillItems: ['人物信息整理', 'GitHub 本地快照', '项目筛选', '经历时间线'],
    fetch: 'Fetch',
    fetchRunning: '读取本地数据',
    fetchDone: '快照已载入',
    fetchHint: '预先准备的 GitHub 档案',
    localOnly: '本地数据 · 未发送网络请求',
    repos: '公开仓库',
    followers: '关注者',
    answer: 'Answer',
    renderedBy: '由 markstream-vue 渲染',
    streaming: '流式输出中',
    replay: '重新播放',
    openGithub: '打开 GitHub',
    explore: '查看项目',
  },
} as const

const copy = computed(() => COPY[lan.value])
const stage = ref(0)
const snapshotReady = ref(false)
const streamedContent = ref('')
const responseFinal = ref(false)
const reduceMotion = ref(false)
const mounted = ref(false)
const scheduled = new Set<number>()
let streamTimer: number | undefined
let scrollTimer: number | undefined
let runToken = 0
let autoFollow = true
let lastScrollY = 0
let isActive = true

const smoothStreamingOptions = {
  minCharsPerSecond: 55,
  maxCharsPerSecond: 150,
  targetLatencyMs: 650,
  catchUpLatencyMs: 260,
  catchUpThreshold: 260,
  maxCommitFps: 30,
  startDelayMs: 40,
  maxCharsPerCommit: 4,
  flushOnFinish: false,
}

useHead(computed(() => ({
  title: lan.value === 'zh'
    ? 'Simon He — 前端工程师与开源创作者'
    : 'Simon He — Frontend engineer & open-source creator',
  meta: [{
    name: 'description',
    content: lan.value === 'zh'
      ? '以本地 AI 输出呈现 Simon He 的开源项目、GitHub 档案与个人经历。'
      : 'A locally simulated AI profile of Simon He: open-source work, GitHub snapshot, and career story.',
  }],
  link: [{ rel: 'canonical', href: 'https://www.simonhe.me/' }],
})))

function compactNumber(value: number) {
  return new Intl.NumberFormat(lan.value === 'zh' ? 'zh-CN' : 'en', {
    maximumFractionDigits: 1,
    notation: 'compact',
  }).format(value)
}

function repoStars(name: string) {
  const repo = featuredRepos.find(item => item.name === name)
  return repo ? ` · ${compactNumber(repo.stars)} ★` : ''
}

const answerContent = computed(() => lan.value === 'zh'
  ? `# Simon He

前端工程师，常驻上海，长期在做一件事：**让开发体验更快、更顺手。**

> Create for laziness, peace & love ❤️

Simon 专注于 DX、前端工具链、开源与自动化。最近的重心，是为 AI 产品构建稳定的流式内容基础设施——你正在读的这段内容，正由他自己的 \`markstream-vue\` 渲染。

在这份 **${simonProfile.snapshotDate}** 的本地 GitHub 快照中，他有 **${simonProfile.followers.toLocaleString()} 位关注者**和 **${simonProfile.publicRepos.toLocaleString()} 个公开仓库**。

## 他正在构建什么

- **[markstream-vue](https://github.com/Simon-He95/markstream-vue)**${repoStars('markstream-vue')} — 面向 AI 应用的多框架流式 Markdown 渲染器。
- **[vue-tui](https://github.com/Simon-He95/vue-tui)**${repoStars('vue-tui')} — 用 Vue 构建 terminal UI、agent console 与日志界面。
- **[markdown-it-ts](https://github.com/Simon-He95/markdown-it-ts)**${repoStars('markdown-it-ts')} — 类型安全、支持增量更新的 Markdown parser。

这些项目背后的共同点不是“再做一个库”，而是把重复、笨重的工作变得更轻。Simon 真正关心的是：**工具能不能让人更专注地创造。**

## 他是怎样走到这里的

- **2018 · 起点** — 计算机专业毕业后进入日企，从客户沟通、Word、Excel 宏和 PPT 开始职业生涯。
- **24 岁 · 转行** — 一份 Vue.js 教程让他看到另一种可能。他辞去稳定工作，集中学习三个月，得到第一份前端工作。
- **2022 · 开源** — Anthony Fu 的分享让他开始认真参与开源。写工具不再只为解决自己的问题，也开始帮助更多开发者。
- **现在 · AI × DX** — 参与 UnoCSS、Vue Vine 等社区，把注意力放在流式 Markdown、编辑器体验和 AI 界面基础设施上。
- **2026 · 分享** — 在 Vue & ViteConf CN 分享《你的 Markdown 渲染器，扛得住 AI 输出吗？》。

## 代码之外

他也喜欢动漫、篮球、推理剧和狼人杀。技术是他表达好奇心的一种方式，但不是全部。

[查看项目](/projects) · [读他的文章](/posts) · [GitHub](https://github.com/Simon-He95) · [Talks](/talks)`
  : `# Simon He

Frontend engineer based in Shanghai, focused on one persistent idea: **make software development faster and more pleasant.**

> Create for laziness, peace & love ❤️

Simon works across developer experience, frontend tooling, open source, and automation. Lately, he has been building reliable streaming-content infrastructure for AI products — including \`markstream-vue\`, which is rendering this answer now.

In this local GitHub snapshot from **${simonProfile.snapshotDate}**, he has **${simonProfile.followers.toLocaleString()} followers** and **${simonProfile.publicRepos.toLocaleString()} public repositories**.

## What he is building

- **[markstream-vue](https://github.com/Simon-He95/markstream-vue)**${repoStars('markstream-vue')} — multi-framework streaming Markdown renderers for AI applications.
- **[vue-tui](https://github.com/Simon-He95/vue-tui)**${repoStars('vue-tui')} — terminal UI, agent console, and log surfaces built with Vue.
- **[markdown-it-ts](https://github.com/Simon-He95/markdown-it-ts)**${repoStars('markdown-it-ts')} — a type-safe Markdown parser designed for incremental updates.

The shared idea is not simply “build another library.” It is to remove repetitive, heavy work so people can stay focused on making things. Simon cares about whether a tool helps someone **create with less friction**.

## How he got here

- **2018 · The starting point** — after a computer science degree, he joined a Japanese company and worked across client communication, Word documents, Excel macros, and presentations.
- **Age 24 · The switch** — a Vue.js tutorial showed him another path. He left a stable job, studied intensely for three months, and landed his first frontend role.
- **2022 · Open source** — inspired by Anthony Fu’s work and talks, he started building in public. Tools became a way to help developers beyond his own team.
- **Now · AI × DX** — he contributes around communities including UnoCSS and Vue Vine, focusing on streaming Markdown, editor experience, and AI interface infrastructure.
- **2026 · On stage** — at Vue & ViteConf CN, he shared “Can Your Markdown Renderer Handle AI Output?”

## Beyond code

He is also into animation, basketball, mystery dramas, and Werewolf. Technology is one way he expresses curiosity, not the whole story.

[Explore projects](/projects) · [Read his notes](/posts) · [GitHub](https://github.com/Simon-He95) · [Talks](/talks)`)

function clearScheduled() {
  scheduled.forEach(id => window.clearTimeout(id))
  scheduled.clear()
  if (streamTimer !== undefined)
    window.clearInterval(streamTimer)
  streamTimer = undefined
  if (scrollTimer !== undefined)
    window.clearInterval(scrollTimer)
  scrollTimer = undefined
}

function schedule(callback: () => void, delay: number) {
  const id = window.setTimeout(() => {
    scheduled.delete(id)
    callback()
  }, delay)
  scheduled.add(id)
}

function startStreaming(token: number) {
  if (token !== runToken)
    return

  stage.value = 4
  streamedContent.value = ''
  responseFinal.value = false
  const source = answerContent.value
  let cursor = 0

  void nextTick(() => {
    if (!isActive)
      return

    document.querySelector('.response-step')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  })

  scrollTimer = window.setInterval(() => {
    if (token !== runToken || responseFinal.value) {
      if (scrollTimer !== undefined)
        window.clearInterval(scrollTimer)
      scrollTimer = undefined
      return
    }

    if (!isActive || !autoFollow)
      return

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'auto',
    })
  }, 120)

  streamTimer = window.setInterval(() => {
    if (token !== runToken || cursor >= source.length) {
      if (streamTimer !== undefined)
        window.clearInterval(streamTimer)
      streamTimer = undefined
      if (token === runToken) {
        schedule(() => {
          if (token === runToken) {
            responseFinal.value = true
            void nextTick(() => {
              if (!isActive)
                return

              window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth',
              })
            })
          }
        }, 900)
      }
      return
    }

    const chunkSize = cursor < 220 ? 6 : 12
    streamedContent.value += source.slice(cursor, cursor + chunkSize)
    cursor += chunkSize
  }, 96)
}

function runSequence() {
  clearScheduled()
  const token = ++runToken
  autoFollow = true
  lastScrollY = window.scrollY
  stage.value = 0
  snapshotReady.value = false
  streamedContent.value = ''
  responseFinal.value = false

  if (reduceMotion.value) {
    stage.value = 4
    snapshotReady.value = true
    streamedContent.value = answerContent.value
    responseFinal.value = true
    return
  }

  schedule(() => stage.value = 1, 260)
  schedule(() => stage.value = 2, 820)
  schedule(() => stage.value = 3, 1320)
  schedule(() => snapshotReady.value = true, 1880)
  schedule(() => startStreaming(token), 2180)
}

function handleScroll() {
  const currentScrollY = window.scrollY

  if (isActive && stage.value === 4 && !responseFinal.value) {
    const distanceFromBottom = document.documentElement.scrollHeight - window.innerHeight - currentScrollY

    if (currentScrollY < lastScrollY - 2)
      autoFollow = false
    else if (distanceFromBottom <= 24)
      autoFollow = true
  }

  lastScrollY = currentScrollY
}

watch(lan, () => {
  if (!mounted.value)
    return

  if (!isActive || responseFinal.value) {
    clearScheduled()
    runToken += 1
    stage.value = 4
    snapshotReady.value = true
    streamedContent.value = answerContent.value
    responseFinal.value = true
    return
  }

  runSequence()
})

onMounted(() => {
  mounted.value = true
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  lastScrollY = window.scrollY
  window.addEventListener('scroll', handleScroll, { passive: true })
  runSequence()
})

onActivated(() => {
  isActive = true
  lastScrollY = window.scrollY
})

onDeactivated(() => {
  isActive = false
})

onBeforeUnmount(() => {
  mounted.value = false
  runToken += 1
  window.removeEventListener('scroll', handleScroll)
  clearScheduled()
})
</script>

<template>
  <div class="ai-home">
    <a class="skip-link" href="#profile-run">Skip to profile</a>

    <main id="profile-run" class="profile-run">
      <p class="run-label">
        <span />{{ copy.eyebrow }}
      </p>

      <section class="transcript" aria-label="Simulated AI profile">
        <article class="user-turn">
          <div class="turn-label">
            {{ copy.you }}
          </div>
          <p>{{ copy.prompt }}</p>
        </article>

        <article class="assistant-turn">
          <header class="assistant-header">
            <span class="assistant-mark" aria-hidden="true">S</span>
            <span>{{ copy.assistant }}</span>
            <span class="assistant-state"><i />{{ copy.ready }}</span>
          </header>

          <div class="process-list" aria-live="polite">
            <section v-if="stage >= 1" class="process-step step-enter">
              <div class="step-rail" aria-hidden="true">
                <span class="step-node" :class="{ complete: stage > 1 }">
                  <svg v-if="stage > 1" viewBox="0 0 16 16"><path d="m3.5 8.2 2.7 2.7 6.3-6.3" /></svg>
                  <span v-else class="thinking-pulse" />
                </span>
                <span class="rail-line" />
              </div>
              <div class="step-content thinking-content">
                <header>
                  <span>{{ copy.thinking }}</span>
                  <span>{{ stage > 1 ? copy.thinkingDone : copy.thinkingRunning }}</span>
                </header>
                <p>{{ copy.thinkingText }}</p>
              </div>
            </section>

            <section v-if="stage >= 2" class="process-step step-enter">
              <div class="step-rail" aria-hidden="true">
                <span class="step-node" :class="{ complete: stage > 2 }">
                  <svg v-if="stage > 2" viewBox="0 0 16 16"><path d="m3.5 8.2 2.7 2.7 6.3-6.3" /></svg>
                  <span v-else class="skill-glyph">+</span>
                </span>
                <span class="rail-line" />
              </div>
              <div class="step-content">
                <header>
                  <span>{{ copy.skills }}</span>
                  <span>{{ copy.skillsReady }}</span>
                </header>
                <div class="skill-list">
                  <span v-for="skill in copy.skillItems" :key="skill">{{ skill }}</span>
                </div>
              </div>
            </section>

            <section v-if="stage >= 3" class="process-step step-enter">
              <div class="step-rail" aria-hidden="true">
                <span class="step-node" :class="{ complete: snapshotReady }">
                  <svg v-if="snapshotReady" viewBox="0 0 16 16"><path d="m3.5 8.2 2.7 2.7 6.3-6.3" /></svg>
                  <span v-else class="fetch-glyph">↗</span>
                </span>
                <span class="rail-line" />
              </div>
              <div class="step-content">
                <header>
                  <span>{{ copy.fetch }}</span>
                  <span :class="{ success: snapshotReady }">{{ snapshotReady ? copy.fetchDone : copy.fetchRunning }}</span>
                </header>

                <div class="tool-card" :aria-busy="!snapshotReady">
                  <div class="tool-request">
                    <span>READ</span>
                    <code>src/data/profile.ts</code>
                    <span>{{ simonProfile.snapshotDate }}</span>
                  </div>

                  <div v-if="!snapshotReady" class="profile-skeleton" aria-label="Reading local profile">
                    <span class="skeleton-avatar" />
                    <span class="skeleton-lines"><i /><i /></span>
                    <span class="skeleton-stat" />
                  </div>

                  <div v-else class="github-result">
                    <img :src="simonProfile.avatar" width="56" height="56" alt="Simon He">
                    <div class="github-identity">
                      <strong>{{ simonProfile.name }}</strong>
                      <span>@{{ simonProfile.login }} · {{ simonProfile.location }}</span>
                      <p>{{ simonProfile.bio }}</p>
                    </div>
                    <dl>
                      <div><dt>{{ copy.followers }}</dt><dd>{{ compactNumber(simonProfile.followers) }}</dd></div>
                      <div><dt>{{ copy.repos }}</dt><dd>{{ compactNumber(simonProfile.publicRepos) }}</dd></div>
                    </dl>
                  </div>

                  <div class="tool-foot">
                    <span>{{ copy.fetchHint }}</span>
                    <span>{{ copy.localOnly }}</span>
                  </div>
                </div>
              </div>
            </section>

            <section v-if="stage >= 4" class="process-step response-step step-enter">
              <div class="step-rail" aria-hidden="true">
                <span class="step-node response-node">S</span>
              </div>
              <div class="step-content response-content">
                <header class="response-header">
                  <span>{{ copy.answer }}</span>
                  <span class="response-status">
                    <i v-if="!responseFinal" aria-hidden="true" />
                    {{ responseFinal ? copy.renderedBy : copy.streaming }}
                  </span>
                </header>

                <MarkdownRender
                  custom-id="simon-profile"
                  mode="chat"
                  class="profile-render"
                  :content="streamedContent"
                  :final="responseFinal"
                  :smooth-streaming="true"
                  :smooth-streaming-options="smoothStreamingOptions"
                  :fade="false"
                  :typewriter="true"
                  :max-live-nodes="0"
                  :batch-rendering="true"
                  :render-batch-size="16"
                  :render-batch-delay="8"
                  :render-batch-budget-ms="4"
                />

                <div v-if="responseFinal" class="response-actions">
                  <a href="https://github.com/Simon-He95" target="_blank" rel="noopener">{{ copy.openGithub }} ↗</a>
                  <router-link to="/projects">
                    {{ copy.explore }}
                  </router-link>
                  <button type="button" @click="runSequence">
                    <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M16 6V2m0 0h-4m4 0-3.1 3.1A6 6 0 1 0 16 10" /></svg>
                    {{ copy.replay }}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<style>
.ai-home {
  min-height: 100dvh;
  color: var(--c-text);
  font-family: var(--font-sans);
}

.ai-home *,
.ai-home *::before,
.ai-home *::after {
  box-sizing: border-box;
}

.ai-home a {
  color: inherit;
}

.skip-link {
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 50;
  padding: 0.65rem 0.9rem;
  border-radius: 0.5rem;
  background: var(--c-text);
  color: var(--c-bg) !important;
  font-size: 0.8rem;
  font-weight: 600;
  transform: translateY(-160%);
}

.skip-link:focus {
  transform: translateY(0);
}

.profile-run {
  width: min(100% - 2.5rem, 60rem);
  margin: 0 auto;
  padding: clamp(3rem, 7vw, 5.5rem) 0 7rem;
}

.run-label {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin: 0 0 2rem;
  color: var(--c-muted);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 650;
  letter-spacing: 0.11em;
}

.run-label span {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: var(--c-accent);
  box-shadow: 0 0 0 0.24rem var(--c-accent-soft);
}

.user-turn {
  width: min(100%, 42rem);
  margin-left: auto;
}

.turn-label {
  margin: 0 0 0.65rem;
  color: var(--c-quiet);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-align: right;
  text-transform: uppercase;
}

.user-turn p {
  margin: 0;
  padding: 1.15rem 1.35rem;
  border-radius: 1.2rem 1.2rem 0.35rem 1.2rem;
  background: var(--c-text);
  color: var(--c-bg);
  font-size: clamp(1rem, 1.8vw, 1.1rem);
  line-height: 1.65;
  box-shadow: 0 18px 48px var(--c-shadow);
}

.dark .user-turn p {
  border: 1px solid var(--c-line-strong);
  background: color-mix(in srgb, var(--c-raised) 82%, var(--c-accent-soft));
  color: var(--c-text);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.2);
}

.assistant-turn {
  margin-top: 3.5rem;
}

.assistant-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding-bottom: 1.15rem;
  border-bottom: 1px solid var(--c-line);
  color: var(--c-text);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  font-weight: 650;
}

.assistant-mark {
  display: grid;
  width: 1.9rem;
  height: 1.9rem;
  place-items: center;
  border: 1px solid var(--c-line-strong);
  border-radius: 0.55rem;
  background: var(--c-raised);
  color: var(--c-accent);
  font-size: 0.72rem;
  box-shadow: 0 5px 18px var(--c-shadow);
}

.assistant-state {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
  color: var(--c-muted);
  font-size: 0.66rem;
  font-weight: 500;
}

.assistant-state i {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: var(--c-accent);
}

.process-list {
  padding-top: 1.4rem;
}

.process-step {
  display: grid;
  grid-template-columns: 2.35rem minmax(0, 1fr);
  column-gap: 1rem;
}

.step-enter {
  animation: step-enter 420ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
}

.step-rail {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
}

.step-node {
  position: relative;
  z-index: 1;
  display: grid;
  width: 1.7rem;
  height: 1.7rem;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--c-line-strong);
  border-radius: 0.5rem;
  background: var(--c-surface);
  color: var(--c-muted);
  font-family: var(--font-mono);
  font-size: 0.66rem;
}

.step-node.complete {
  border-color: color-mix(in srgb, var(--c-accent) 52%, var(--c-line));
  background: var(--c-accent-soft);
  color: var(--c-accent);
}

.step-node svg {
  width: 0.95rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.thinking-pulse {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 50%;
  background: var(--c-accent);
  animation: thinking-pulse 1.2s ease-in-out infinite;
}

.skill-glyph,
.fetch-glyph {
  color: var(--c-accent);
  font-size: 0.85rem;
}

.rail-line {
  width: 1px;
  min-height: 2.3rem;
  flex: 1;
  background: var(--c-line);
}

.step-content {
  min-width: 0;
  padding: 0.22rem 0 2.2rem;
}

.step-content > header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.7rem;
  font-family: var(--font-mono);
}

.step-content > header > span:first-child {
  color: var(--c-text);
  font-size: 0.76rem;
  font-weight: 650;
}

.step-content > header > span:last-child {
  color: var(--c-quiet);
  font-size: 0.66rem;
}

.step-content > header .success {
  color: var(--c-accent);
}

.thinking-content p {
  max-width: 65ch;
  margin: 0;
  color: var(--c-muted);
  font-size: 0.91rem;
  line-height: 1.65;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-list span {
  padding: 0.44rem 0.65rem;
  border: 1px solid var(--c-line);
  border-radius: 0.5rem;
  background: var(--c-surface);
  color: var(--c-muted);
  font-family: var(--font-mono);
  font-size: 0.66rem;
}

.tool-card {
  overflow: hidden;
  border: 1px solid var(--c-line);
  border-radius: 0.8rem;
  background: var(--c-raised);
  box-shadow: 0 14px 38px var(--c-shadow);
}

.tool-request,
.tool-foot {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.72rem 0.9rem;
  background: var(--c-surface);
  color: var(--c-quiet);
  font-family: var(--font-mono);
  font-size: 0.62rem;
}

.tool-request {
  border-bottom: 1px solid var(--c-line);
}

.tool-request span:first-child {
  color: var(--c-accent);
  font-weight: 700;
}

.tool-request code {
  overflow: hidden;
  flex: 1;
  color: var(--c-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tool-foot {
  justify-content: space-between;
  border-top: 1px solid var(--c-line);
}

.github-result,
.profile-skeleton {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
  min-height: 7.4rem;
  padding: 1.15rem;
}

.github-result img {
  width: 3.5rem;
  height: 3.5rem;
  border: 1px solid var(--c-line);
  border-radius: 0.85rem;
  object-fit: cover;
}

.github-identity {
  min-width: 0;
}

.github-identity strong {
  display: block;
  color: var(--c-text);
  font-size: 0.94rem;
}

.github-identity > span,
.github-identity p {
  color: var(--c-muted);
  font-size: 0.72rem;
}

.github-identity p {
  margin: 0.42rem 0 0;
}

.github-result dl {
  display: flex;
  gap: 1.35rem;
  margin: 0;
}

.github-result dl div {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.2rem;
}

.github-result dt {
  color: var(--c-quiet);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  text-transform: uppercase;
}

.github-result dd {
  margin: 0;
  color: var(--c-text);
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 650;
}

.skeleton-avatar,
.skeleton-stat,
.skeleton-lines i {
  display: block;
  border-radius: 0.45rem;
  background: linear-gradient(90deg, var(--c-line), var(--c-surface), var(--c-line));
  background-size: 220% 100%;
  animation: skeleton 1.3s ease infinite;
}

.skeleton-avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0.85rem;
}

.skeleton-lines {
  display: grid;
  gap: 0.55rem;
}

.skeleton-lines i {
  width: 9rem;
  height: 0.55rem;
}

.skeleton-lines i:last-child {
  width: 6rem;
}

.skeleton-stat {
  width: 5rem;
  height: 1.8rem;
}

.response-node {
  border-color: var(--c-accent);
  background: var(--c-accent);
  color: var(--c-raised);
  font-weight: 700;
}

.response-step {
  scroll-margin-top: 2rem;
}

.response-content {
  padding-bottom: 0;
}

.response-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.response-status i {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: var(--c-accent);
  box-shadow: 0 0 0 0.2rem var(--c-accent-soft);
  animation: thinking-pulse 1s ease-in-out infinite;
}

.profile-render {
  color: var(--c-muted);
  font-family: var(--font-sans);
  font-size: 0.98rem;
  line-height: 1.75;
}

.profile-render h1,
.profile-render h2,
.profile-render h3,
.profile-render strong {
  color: var(--c-text);
}

.profile-render h1 {
  margin: 0.3rem 0 1rem;
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 650;
  letter-spacing: -0.055em;
  line-height: 1;
}

.profile-render h2 {
  margin: 2.4rem 0 0.8rem;
  font-size: 1.08rem;
  font-weight: 650;
  letter-spacing: -0.02em;
}

.profile-render a {
  color: var(--c-accent);
  text-decoration-color: color-mix(in srgb, var(--c-accent) 40%, transparent);
  text-underline-offset: 0.2em;
}

.profile-render blockquote {
  margin: 1.35rem 0;
  padding: 0.85rem 1rem;
  border-left: 2px solid var(--c-accent);
  background: var(--c-accent-soft);
  color: var(--c-text);
}

.profile-render code {
  padding: 0.15rem 0.35rem;
  border: 1px solid var(--c-line);
  border-radius: 0.35rem;
  background: var(--c-surface);
  color: var(--c-accent);
  font-family: var(--font-mono);
  font-size: 0.84em;
}

.response-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 2rem;
}

.response-actions a,
.response-actions button {
  display: inline-flex;
  min-height: 2.55rem;
  align-items: center;
  gap: 0.45rem;
  padding: 0 0.85rem;
  border: 1px solid var(--c-line-strong);
  border-radius: 0.6rem;
  background: var(--c-raised);
  color: var(--c-text);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  text-decoration: none;
}

.response-actions button {
  margin-left: auto;
  cursor: pointer;
}

.response-actions svg {
  width: 0.9rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.4;
}

@keyframes step-enter {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes thinking-pulse {
  50% { opacity: 0.35; transform: scale(0.72); }
}

@keyframes skeleton {
  to { background-position: -220% 0; }
}

@media (max-width: 640px) {
  .profile-run {
    width: min(100% - 1.5rem, 60rem);
    padding-top: 2.25rem;
  }

  .run-label {
    margin-bottom: 1.4rem;
  }

  .assistant-turn {
    margin-top: 2.8rem;
  }

  .process-step {
    grid-template-columns: 1.75rem minmax(0, 1fr);
    column-gap: 0.65rem;
  }

  .step-node {
    width: 1.55rem;
    height: 1.55rem;
  }

  .tool-request > span:last-child,
  .tool-foot > span:first-child {
    display: none;
  }

  .github-result {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .github-result dl {
    grid-column: 1 / -1;
    padding-left: 4.5rem;
  }

  .profile-skeleton {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .skeleton-stat {
    display: none;
  }

  .response-actions button {
    width: 100%;
    justify-content: center;
    margin-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .step-enter,
  .thinking-pulse,
  .profile-skeleton * {
    animation: none !important;
  }
}
</style>
