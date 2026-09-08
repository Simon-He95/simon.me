<script setup lang="ts">
import { isZh } from '../../lang'

defineProps<{ projects: Record<string, any[]> }>()

const message = ref(isZh.value ? '我引以为豪的项目清单' : 'List of projects that I am proud of')
function finish() {
  if (message.value === 'List of projects that I am proud of' || message.value === '我引以为豪的项目清单')
    message.value = isZh.value ? '我引以为豪' : 'List of projects'
  else message.value = isZh.value ? '我引以为豪的项目清单' : 'List of projects that I am proud of'
}
</script>

<template>
  <div class="prose m-auto mb-8">
    <h1 class="mb-0 animateTitle">
      {{ isZh ? '项目' : 'Projects' }}
    </h1>
    <vivid-typing
      :content="message"
      :finish="finish"
      :interval="200"
      class="opacity-50 !-mt-6 italic animateContent"
    />
  </div>
  <div class="projects-wrap">
    <template v-for="key in Object.keys(projects)" :key="key">
      <div class="section-head slide-enter" style="--enter-stage: 11; --enter-step: 60ms;">
        <span class="section-stroke" aria-hidden="true">{{ key }}</span>
      </div>
      <div class="project-grid py-2" grid="~ cols-1 sm:cols-2 lg:cols-3 gap-4">
        <a
          v-for="(item, idx) in projects[key]"
          :key="idx"
          class="item relative flex items-start"
          :href="item.link"
          target="_blank"
          :class="!item.link ? 'opacity-0 pointer-events-none h-0 -mt-8 -mb-4' : ''"
          :title="isZh ? item.nameZh || item.name : item.name"
        >
          <div v-if="item.icon" class="w-8 h-8 shrink-0 grid place-items-center">
            <div class="project-icon" :class="item.icon || 'i-carbon-unknown'" />
          </div>
          <div class="flex-auto min-w-0">
            <div class="project-title min-h-6 lh-6 text-normal">
              {{ isZh ? item.nameZh || item.name : item.name }}
            </div>
            <div class="desc min-h-6 lh-6 text-sm opacity-50 font-normal">
              {{ isZh ? item.descZh || item.desc : item.desc }}
            </div>
          </div>
          <span class="external-mark" aria-hidden="true">↗</span>
        </a>
      </div>
    </template>
  </div>
</template>

<style scoped>
.projects-wrap {
  position: relative;
  left: 50%;
  width: min(calc(100vw - 3rem), 76rem);
  margin-inline: auto;
  transform: translateX(-50%);
  padding-bottom: 3rem;
}

.section-head {
  position: relative;
  height: 4.5rem;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.section-head::before {
  content: '';
  position: absolute;
  left: -0.4rem;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 1.6em;
  border-radius: 2px;
  background: var(--c-accent);
}

.section-stroke {
  font-size: clamp(3rem, 7vw, 4.6rem);
  font-weight: 700;
  line-height: 1em;
  letter-spacing: -0.03em;
  color: transparent;
  -webkit-text-stroke-width: 1.5px;
  -webkit-text-stroke-color: color-mix(in srgb, var(--c-accent) 60%, color-mix(in srgb, var(--c-accent-warm) 28%, var(--c-line-strong)));
  opacity: 0.95;
}

.animateTitle {
  --color: var(--c-text);
  animation-delay: 0.1s;
}

.animateContent {
  --color: var(--c-muted);
  animation-delay: 0.3s;
}

.prose > p > div > * {
  position: relative;
  clip-path: inset(-20% 0);
  animation-name: text-reveal, shimmy;
  animation-duration: 0.6s;
  animation-fill-mode: both;
  animation-timing-function: steps(1), ease-out;
}

@keyframes shimmy {
  0% {
    transform: translateX(-1ch);
  }
}

@keyframes text-reveal {
  0% {
    color: transparent;
  }
  50%,
  100% {
    color: var(--color);
  }
}

.animateTitle:after {
  content: "";
  position: absolute;
  inset: -20% 0;
  background-color: var(--color);
  animation-name: block-reveal;
  animation-duration: 0.6s;
  animation-delay: 0.1s;
  animation-fill-mode: both;
}
.animateContent:after {
  content: "";
  position: absolute;
  inset: -20% 0;
  background-color: var(--color);
  animation-name: block-reveal;
  animation-duration: 0.6s;
  animation-delay: 0.3s;
  animation-fill-mode: both;
}

@keyframes block-reveal {
  0% {
    transform: translateX(-110%);
  }
  45%,
  55% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(110%);
  }
}

.project-grid {
  width: 100%;
}

.project-grid a.item {
  background:
    radial-gradient(circle at 92% 0%, var(--c-glow-warm), transparent 55%),
    var(--c-raised);
  border: 1px solid var(--c-line);
  border-radius: 0.9rem;
  color: var(--c-text);
  font-size: 1.05rem;
  opacity: 1;
  width: 100%;
  padding: 1rem 1.1rem;
  box-shadow: 0 1px 2px var(--c-shadow), inset 0 1px 0 color-mix(in srgb, var(--c-text) 5%, transparent);
  content-visibility: auto;
  contain-intrinsic-size: 110px;
  transition: border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.project-grid a.item:hover {
  border-color: color-mix(in srgb, var(--c-accent) 55%, var(--c-line));
  background:
    radial-gradient(circle at 92% 0%, var(--c-glow-warm), transparent 60%),
    radial-gradient(circle at 8% 100%, var(--c-glow), transparent 55%),
    color-mix(in srgb, var(--c-raised) 94%, var(--c-accent-soft));
  transform: translateY(-2px);
  box-shadow: 0 12px 30px var(--c-shadow), inset 0 1px 0 color-mix(in srgb, var(--c-text) 5%, transparent);
  opacity: 1;
}

.project-grid a.item:active {
  transform: translateY(0) scale(0.99);
}

.project-icon {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 1.5rem;
  opacity: 0.55;
  transition: opacity 200ms ease, color 200ms ease;
}

.project-grid a.item:hover .project-icon {
  opacity: 1;
  color: var(--c-accent);
}

.external-mark {
  align-self: flex-start;
  margin-left: 0.4rem;
  color: var(--c-accent-warm);
  font-size: 0.7rem;
  opacity: 0;
  transform: translate(-2px, 2px);
  transition: opacity 200ms ease, transform 200ms ease, color 200ms ease;
}

.project-grid a.item:hover .external-mark {
  opacity: 1;
  transform: translate(0, 0);
  color: var(--c-accent-warm-strong);
}

.project-title {
  font-weight: 600;
  letter-spacing: -0.01em;
  overflow-wrap: break-word;
}

.desc {
  color: var(--c-muted);
  opacity: 1 !important;
  text-wrap: pretty;
  overflow-wrap: break-word;
}

@media (max-width: 640px) {
  .projects-wrap {
    width: min(calc(100vw - 1.5rem), 76rem);
  }
}
</style>
