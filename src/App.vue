<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  DotImageCanvas,
  DotTextCanvas,
  animationFrameWrapper,
  scrollToTop,
} from 'simon-js-tool'
import { useEventListener } from '@vueuse/core'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { isDark } from '~/logics'
import hy from '/images/gm1.jpg'
import tr from '/images/gm5.jpg'
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
const dotText = new DotTextCanvas(text.value, 20, isDark.value ? 'white' : 'black', 10)
const dotImage = new DotImageCanvas(hy, '', 2, 'transparent')
const dotImage1 = new DotImageCanvas(flag, '', 1, 'transparent')
const dotImage2 = new DotImageCanvas(tr, '', 2, 'transparent')
const el = ref<HTMLElement>(null)
const imageEl = ref(null)
const imageEl1 = ref(null)
const flagEl = ref(null)
onMounted(() => {
  el.value?.appendChild(dotText.canvas)
  dotImage.canvas.style.width = '10rem'
  imageEl.value?.appendChild(dotImage.canvas)
  imageEl1.value?.appendChild(dotImage2.canvas)
  flagEl.value?.appendChild(dotImage1.canvas)
})
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
    text.value = routerMap[val.path] || 'China'
    animationFrameWrapper(update, 0, true)
  },
  {
    immediate: true,
  },
)

function update() {
  const newDotText = dotText.repaint(
    text.value,
    20,
    isDark.value ? 'white' : 'black',
    10,
  )
  const child = el.value?.childNodes[0]
  if (child)
    el.value?.replaceChild(newDotText.canvas, child)
}
const isShow = ref(false)
useEventListener(document, 'scroll', (e) => {
  if (document.documentElement.scrollTop > 500)
    isShow.value = true
  else isShow.value = false
})
</script>

<template>
  <span ref="imageEl" fixed top-20 w-100 h-100 z--1 />
  <span ref="imageEl1" fixed top-20 right-0 h-100 z--1 />
  <span ref="flagEl" fixed bottom--5 right--10 flex w-40 h-40 z--1 />
  <span ref="el" fixed bottom-5 right-0 />
  <NavBar />
  <main class="px-7 py-10" overflow-x-hidden>
    <router-view />
    <Footer />
    <Levitation />
  </main>
  <span
    v-if="isShow"
    i-icon-park-outline:rocket-one
    animate-bounce
    fixed
    bottom-40
    right-5
    text-3xl
    cursor-pointer
    style="-webkit-tap-highlight-color: rgba(255, 255, 255, 0)"
    @click="scrollToTop()"
  />
</template>
