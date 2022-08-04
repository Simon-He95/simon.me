<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  DotImageCanvas,
  DotTextCanvas,
  animationFrameWrapper,
  lazyLoad,
  scrollToTop,
} from 'simon-js-tool'
import { useEventListener } from '@vueuse/core'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { isDark } from '~/logics'
import kb from '/images/kb.png'
import flag from '/images/flag.jpg'
useHead({
  meta: [
    { property: 'og:title', content: 'Simon He' },
    { property: 'og:image', content: '/black.png' },
    { name: 'description', content: 'Simon He\'s Portfolio' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:creator', content: '@simon_he1995' },
  ],
})
const text = ref('')
const dotImage = new DotImageCanvas(kb, '', 3, 'transparent')
dotImage.append('.dotImage')

watch(isDark, update)
const router = useRouter()

const routerMap = {
  '/': 'Simon',
  '/projects': 'Projects',
  '/posts': 'Blog',
}
watch(
  router.currentRoute,
  (val) => {
    text.value = routerMap[val.path] || 'Docs'
    animationFrameWrapper(update, 200, true)
  },
  {
    immediate: true,
  },
)
const dotText = new DotTextCanvas(text.value, 16, isDark.value ? 'white' : 'black', 10)
dotText.append('.dotText')
function update() {
  dotText.repaint(text.value, 16, isDark.value ? 'white' : 'black', 10)
}
const isShow = ref(false)
useEventListener(
  document,
  'scroll',
  e => (isShow.value = document.documentElement.scrollTop > 500),
)
</script>

<template>
  <span class="dotImage" fixed top-20 right-0 z--1 />
  <span class="dotText" fixed bottom-5 right-0 />
  <NavBar />
  <main class="px-7 py-10" overflow-x-hidden>
    <router-view />
    <Footer />
    <!-- <Levitation /> -->
  </main>
  <span
    v-if="isShow"
    i-icon-park-outline:rocket-one
    animate-bounce
    hover="animate-none bg-red-400 "
    fixed
    bottom-40
    right-5
    text-3xl
    cursor-pointer
    title="Top"
    @click="scrollToTop()"
  />
</template>
