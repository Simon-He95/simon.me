<script setup lang="ts">
import { ref } from 'vue'
import {
  DotImageCanvas,
  DotTextCanvas,
  getDevice,
  scrollToTop,
  useAnimationFrame,
} from 'lazy-js-utils'

import gitFork from '@simon_he/git-fork'
import { createMouseAnimation } from 'mouse-element'
import { sThree } from '@simon_he/s-three'
import { useEventListener } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { isZh } from '../lang'
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
const routerMap: any = {
  en: {
    '/': 'Simon',
    '/projects': 'Projects',
    '/posts': 'Blog',
  },
  zh: {
    '/': 'Simon',
    '/projects': '项目',
    '/posts': '博客',
  },
}
watch(
  router.currentRoute,
  (val) => {
    text.value = routerMap[isZh.value ? 'zh' : 'en'][val.path] || 'Docs'
    useAnimationFrame(update, 200, true)
  },
  {
    immediate: true,
  },
)
const dotText = new DotTextCanvas(
  text.value,
  14,
  isDark.value ? 'white' : 'black',
  5,
)
dotText.append('.dotText')
function update() {
  try {
    dotText.repaint(text.value, 14, isDark.value ? 'white' : 'black', 6)
  }
  catch (error) {
  }
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
const left = ref(0)
const top = ref(0)
const maxWidth = document.documentElement.clientWidth
const maxHeight = document.documentElement.clientHeight
document.addEventListener('mousemove', (e) => {
  left.value = 200 - (e.x / maxWidth) * 200
  top.value = 200 - (e.y / maxHeight) * 200
  createMouseAnimation(e)
})
</script>

<template>
  <git-fork
    v-if="imageShow"
    link="https://github.com/Simon-He95"
    type="ribbons"
    position="left"
    top="100px"
    class="lt-md:hidden"
  />
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

  <div
    fixed
    w-100
    z--5
    left-1
    top-80
    :style="{
      transform: `translate(${left}px, ${top}px)`,
    }"
  >
    <div className="planet">
      <svg width="100" height="100" class="ball" viewBox="0 0 24 24">
        <g fill="none" stroke-width="1.5">
          <g
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            clip-path="url(#svgIDa)"
          >
            <path
              d="M17.736 20.192c4.524-3.168 5.623-9.404 2.455-13.928C17.024 1.74 10.788.641 6.264 3.81C1.74 6.976.641 13.212 3.808 17.736c3.168 4.524 9.404 5.623 13.928 2.456Zm0 0L6.264 3.809"
            />
            <path d="M19.577 5.473c-3.77 5.896-8.508 9.214-16.302 11.415" />
            <path
              d="M13.06 2.056c.413 5.24 3.392 9.494 8.646 12.35M2.293 9.595c4.783 2.18 7.761 6.434 8.647 12.349"
            />
          </g>
          <defs>
            <clipPath id="svgIDa">
              <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
          </defs>
        </g>
      </svg>
    </div>
  </div>
</template>

<style>
body {
  cursor: url(https://cdn.custom-cursor.com/db/8130/32/manga-himouto-umaru-chan-umaru-and-cola-cursor.png),
    default !important;
}
a,.link {
  cursor: url(https://cdn.custom-cursor.com/db/8129/32/manga-himouto-umaru-chan-umaru-and-cola-pointer.png),
    pointer !important;
}

@keyframes planet-rotate {
  0% {
    transform: rotate(45deg) rotate(0);
  }
  100% {
    transform: rotate(45deg) rotate(360deg);
  }
}

@keyframes self-rotate {
  0% {
    transform: rotate(0) rotate(-45deg);
  }
  100% {
    transform: rotate(-360deg) rotate(-45deg);
  }
}

.planet {
  animation: planet-rotate 20s linear infinite;
}
.ball {
  animation: self-rotate 20s linear infinite;
}
.planet svg {
  filter: drop-shadow(2px 4px 6px black);
  color: rgb(229, 232, 235);
}
</style>
