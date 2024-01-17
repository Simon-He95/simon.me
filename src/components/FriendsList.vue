<script setup lang="ts">
import { onMounted } from 'vue'
import { isDark } from '~/logics'
const friends = [
  {
    name: 'Simon He',
    avatar: 'https://avatars.githubusercontent.com/u/57086651?v=4',
    blog: 'https://simonme.netlify.app/',
    description: 'Front-end development, Open source',
  },
]
onMounted(() => {
  const figure = document.querySelectorAll('figure')
  figure?.forEach(f => f.style.setProperty('--border-color', isDark.value ? 'rgb(220 252 231 / 0.1)' : 'rgb(20 184 166 / 0.1)'))
})
</script>

<template>
  <div>
    <ul class="grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="friend in friends" :key="friend.name" class="text-sm leading-6">
        <figure
          :class="[isDark ? 'dark:bg-dark-800' : 'dark:bg-slate-800']"
          class="relative flex flex-col-reverse bg-slate-50 rounded-lg p-6  dark:highlight-white/5"
        >
          <blockquote class="mt-6 text-slate-700 dark:text-slate-300">
            <p xt-marked="ok">
              {{ friend.description }}
            </p>
          </blockquote>
          <figcaption class="flex items-center space-x-4">
            <img
              :src="friend.avatar" alt="" class="flex-none w-14 h-14 rounded-full object-cover" loading="lazy"
              decoding="async"
            >
            <div class="flex-auto">
              <div class="text-base text-slate-900 font-semibold dark:text-slate-300">
                <a :href="friend.blog" tabindex="0"><span class="absolute inset-0" />{{ friend.name }}</a>
              </div>
              <div class="mt-0.5">
                core member of unocss and vue vine, webview-use author
              </div>
            </div>
          </figcaption>
        </figure>
      </li>
    </ul>
    <div class="prose m-auto mt-8">
      <h1>Sponsors</h1>
    </div>
    <a href="https://cdn.jsdelivr.net/gh/Simon-He95/sponsor@main/sponsors.svg">
      <img src="https://cdn.jsdelivr.net/gh/Simon-He95/sponsor@main/sponsors.svg" mlauto mrauto>
    </a>
  </div>
</template>

<style>
article>.prose {
  max-width: 100% !important;
}
</style>

<style scoped>
:deep(article > .prose) {
  max-width: 100% !important;
}

.prose ul>li::before {
  display: none;
}

.prose ul {
  margin: 0;
}

.prose li {
  margin: 0
}

.prose figure {
  margin: 0;
}

.prose ul>li {
  padding: 0;
}

figure:hover img {
  transition: 0.4s ease-in-out;
  transform: scale(1.2) rotate3d(1, 0, 0, 360deg);
}

figure {
  transition: all .5s;
}

figure:hover::before {
  animation: clippath 3s infinite linear;
  border: 2px solid var(--border-color);
}

figure::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.5rem;
  border: 2px solid transparent;
}

@keyframes clippath {

  0%,
  100% {
    clip-path: inset(0 0 95% 0);
  }

  25% {
    clip-path: inset(0 95% 0 0);
  }

  50% {
    clip-path: inset(95% 0 0 0);
  }

  75% {
    clip-path: inset(0 0 0 95%);
  }
}
</style>
