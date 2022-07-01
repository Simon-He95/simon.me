<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DotImageCanvas, DotTextCanvas } from 'simon-js-tool'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'
import { isDark } from '~/logics'
import lufei from '/images/lufei.png'
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
const dotImage = new DotImageCanvas(lufei, 2)
const el = ref<HTMLElement>(null)
const imageEl = ref(null)
onMounted(() => {
  el.value?.appendChild(dotText.canvas)
  dotImage.canvas.style.width = '10rem'
  imageEl.value?.appendChild(dotImage.canvas)
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
    setTimeout(update)
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
  const child = el.value.childNodes[0]
  if (child)
    el.value?.replaceChild(newDotText.canvas, child)
}
</script>

<template>
  <span ref="imageEl" fixed top-20 w-100 h-100 />
  <span ref="el" fixed bottom-5 right-0 />
  <NavBar />
  <main class="px-7 py-10" overflow-x-hidden>
    <router-view />
    <Footer />
    <Levitation />
  </main>
</template>
