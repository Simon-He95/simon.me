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
    <h1 ref="projectEl" class="mb-0 animateTitle">
      {{ isZh ? '项目' : 'Projects' }}
    </h1>
    <vivid-typing
      :content="message"
      :finish="finish"
      :interval="200"
      class="opacity-50 !-mt-6 italic animateContent"
    />
  </div>
  <template v-for="key in Object.keys(projects)" :key="key">
    <vivid-typing class="mt-10 font-bold" :content="key" />
    <div class="project-grid py-2 -mx-3 gap-2">
      <a
        v-for="(item, idx) in projects[key]"
        :key="idx"
        class="item relative flex items-center"
        :href="item.link"
        target="_blank"
        :class="!item.link ? 'opacity-0 pointer-events-none h-0 -mt-8 -mb-4' : ''"
        :title="isZh ? item.nameZh || item.name : item.name"
      >
        <div v-if="item.icon" class="pt-2 pr-5">
          <div class="text-3xl opacity-50" :class="item.icon || 'i-carbon-unknown'" />
        </div>
        <div class="flex-auto">
          <template v-if="isZh">
            <vivid-typing min-h-6 lh-6 :content=" item.nameZh || item.name " :delay="idx * 200 " class="text-normal" />
            <vivid-typing spilt-tag="span" class="desc text-sm opacity-50 font-normal" min-h-6 lh-6 :content=" item.descZh || item.desc " :delay="idx * 200" />
          </template>

          <template v-else>
            <vivid-typing min-h-6 lh-6 :content="item.name" :delay="idx * 200 " class="text-normal" />
            <vivid-typing spilt-tag="span" class="desc text-sm opacity-50 font-normal" min-h-6 lh-6 :content="item.desc" :delay="idx * 200" />
          </template>
          <!-- <div class="desc text-sm opacity-50 font-normal" v-html="isZh ? item.descZh || item.desc : item.desc" /> -->
        </div>
      </a>
    </div>
  </template>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.project-grid a.item {
  padding: 0.8em 1em;
  background: transparent;
  font-size: 1.1rem;
}

.project-grid a.item:hover {
  background: #88888808;
}

.animateTitle {
  --color: #222;
  animation-delay: 0.1s;
}

.animateContent {
  --color: #555;
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
</style>
