<script setup lang="ts">
defineProps<{ projects: Record<string, any[]> }>();
</script>

<template>
  <div class="prose m-auto mb-8">
    <h1 class="mb-0 animateTitle">Projects</h1>
    <p class="opacity-50 !-mt-6 italic animateContent">
      List of projects that I am proud of
    </p>
  </div>
  <template v-for="key in Object.keys(projects)" :key="key">
    <h4 class="mt-10 font-bold">
      {{ key }}
    </h4>
    <div class="project-grid py-2 -mx-3 gap-2">
      <a
        v-for="(item, idx) in projects[key]"
        :key="idx"
        class="item relative flex items-center"
        :href="item.link"
        target="_blank"
        :class="!item.link ? 'opacity-0 pointer-events-none h-0 -mt-8 -mb-4' : ''"
        :title="item.name"
      >
        <div v-if="item.icon" class="pt-2 pr-5">
          <div class="text-3xl opacity-50" :class="item.icon || 'i-carbon-unknown'" />
        </div>
        <div class="flex-auto">
          <div cla ss="text-normal">
            <Typing interval="50">{{ item.name }}</Typing>
          </div>
          <div class="desc text-sm opacity-50 font-normal" v-html="item.desc" />
        </div>
      </a>
    </div>
  </template>
  <cd />
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
