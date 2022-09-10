<script setup lang="ts">
import { ref } from 'vue'
import {
  DotImageCanvas,
  DotTextCanvas,
  animationFrameWrapper,
  getDevice,
  scrollToTop,
} from 'simon-js-tool'
import { sThree } from '@simon_he/s-three'
import { useEventListener } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { isDark } from '~/logics'
import kb from '/images/kb.png'
// import flag from '/images/flag.jpg'
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

const imageShow = computed(() => {
  const { os } = getDevice()
  return os === 'mac' || os === 'windows'
})
if (imageShow.value)
  dotImage.append('.dotImage')

watch(isDark, update)
const router = useRouter()
const routerMap: Record<string, string> = {
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
const dotText = new DotTextCanvas(
  text.value,
  14,
  isDark.value ? 'white' : 'black',
  6,
)
dotText.append('.dotText')
function update() {
  dotText.repaint(text.value, 14, isDark.value ? 'white' : 'black', 6)
}
const isShow = ref(false)
useEventListener(
  document,
  'scroll',
  e => (isShow.value = document.documentElement.scrollTop > 500),
)

let points: any
let unmount: any
let geometry
let material
const params = {
  count: 200,
  size: 0.008,
  radius: 4.5,
  insideColor: '#552fc4',
  outsideColor: isDark.value ? '#000' : '#fff',
}
const { c, animationArray, THREE, scene, renderer } = sThree('#snow', {
  createMesh() {
    generateGalaxy()
  },
  createCamera() {
    const camera = c('PC')
    camera.position.set(0, 0, 2)
    return camera
  },
  animate({ camera, elapsedTime, timestamp }) {
    animationArray[0].rotation.y = Math.sin(elapsedTime * 0.01) * 10
    animationArray[0].rotation.x = elapsedTime * 0.05
  },
})
function generateGalaxy() {
  if (points) {
    unmount?.()
    animationArray.shift()
  }
  geometry = c('bufferg')
  const { positions, colors } = getRandomColorPosition()
  geometry.setAttribute('position', c('ba', positions, 3))
  geometry.setAttribute('color', c('ba', colors, 3))
  // Material
  material = c('pm', {
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })
  points = c('p', geometry, material)
  unmount = scene._add?.(points)
  renderer.setClearColor(c('c', 'transparent'), 0)
  animationArray.push(points)
}
function getRandomColorPosition() {
  const positions = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)
  const colorInside = new THREE.Color(params.insideColor)
  const colorOutside = new THREE.Color(params.outsideColor)
  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3
    // Position
    const radius = Math.random() * params.radius
    positions[i3 + 0] = (Math.random() - 0.5) * 3
    positions[i3 + 1] = (Math.random() - 0.5) * 3
    positions[i3 + 2] = (Math.random() - 0.5) * 3
    // Color
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / params.radius)
    colors[i3 + 0] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }
  return { colors, positions }
}
</script>

<template>
  <div id="snow" fixed w-full h-full z--1 />
  <span v-if="imageShow" class="dotImage" fixed top-20 right-0 z--1 />
  <span class="dotText" fixed bottom-5 right-0 />
  <NavBar />
  <main class="px-7 py-10" overflow-x-hidden>
    <router-view />
    <Footer />
    <!-- <Levitation /> -->
  </main>
  <a
    v-if="isShow"
    i-icon-park-outline:rocket-one
    animate-bounce
    hover="animate-none bg-red-400 "
    fixed
    bottom-40
    right-5
    text-3xl
    title="Top"
    @click="scrollToTop()"
  />
</template>

<style>
body {
  cursor: url(https://cdn.custom-cursor.com/db/8130/32/manga-himouto-umaru-chan-umaru-and-cola-cursor.png),
    default !important;
}
a {
  cursor: url(https://cdn.custom-cursor.com/db/8129/32/manga-himouto-umaru-chan-umaru-and-cola-pointer.png),
    pointer !important;
}
</style>
