<script setup lang="ts">
import { ref } from 'vue'
import {
  DotImageCanvas,
  DotTextCanvas,
  getDevice,
  scrollToTop,
  useRaf,
} from 'lazy-js-utils'

// import gitFork from '@simon_he/git-fork-vue'
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
    useRaf(update, 200, true)
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
  createMouseAnimation(e, {
    background: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxnIGZpbGw9IiNjY2NjY2MiPjxwYXRoIGQ9Ik0yMzIgMTA4YTIwIDIwIDAgMSAxLTIwLTIwYTIwIDIwIDAgMCAxIDIwIDIwbS0xNjggMGEyMCAyMCAwIDEgMC0yMCAyMGEyMCAyMCAwIDAgMCAyMC0yMG0yOC0yOGEyMCAyMCAwIDEgMC0yMC0yMGEyMCAyMCAwIDAgMCAyMCAyMG03MiAwYTIwIDIwIDAgMSAwLTIwLTIwYTIwIDIwIDAgMCAwIDIwIDIwbTE5LjI0IDc1Ljg1QTQzLjQ2IDQzLjQ2IDAgMCAxIDE2Mi41NyAxMzBhMzYgMzYgMCAwIDAtNjkuMTQgMGE0My40OSA0My40OSAwIDAgMS0yMC42NyAyNS45YTMyIDMyIDAgMCAwIDI3LjczIDU3LjYyYTcyLjQ5IDcyLjQ5IDAgMCAxIDU1IDBhMzIgMzIgMCAwIDAgMjcuNzMtNTcuNjJaIiBvcGFjaXR5PSIuMiIvPjxwYXRoIGQ9Ik0yMTIgODBhMjggMjggMCAxIDAgMjggMjhhMjggMjggMCAwIDAtMjgtMjhtMCA0MGExMiAxMiAwIDEgMSAxMi0xMmExMiAxMiAwIDAgMS0xMiAxMk03MiAxMDhhMjggMjggMCAxIDAtMjggMjhhMjggMjggMCAwIDAgMjgtMjhtLTI4IDEyYTEyIDEyIDAgMSAxIDEyLTEyYTEyIDEyIDAgMCAxLTEyIDEybTQ4LTMyYTI4IDI4IDAgMSAwLTI4LTI4YTI4IDI4IDAgMCAwIDI4IDI4bTAtNDBhMTIgMTIgMCAxIDEtMTIgMTJhMTIgMTIgMCAwIDEgMTItMTJtNzIgNDBhMjggMjggMCAxIDAtMjgtMjhhMjggMjggMCAwIDAgMjggMjhtMC00MGExMiAxMiAwIDEgMS0xMiAxMmExMiAxMiAwIDAgMSAxMi0xMm0yMy4xMiAxMDAuODZhMzUuMyAzNS4zIDAgMCAxLTE2Ljg3LTIxLjE0YTQ0IDQ0IDAgMCAwLTg0LjUgMEEzNS4yNSAzNS4yNSAwIDAgMSA2OSAxNDguODJBNDAgNDAgMCAwIDAgODggMjI0YTM5LjQ4IDM5LjQ4IDAgMCAwIDE1LjUyLTMuMTNhNjQuMDkgNjQuMDkgMCAwIDEgNDguODcgMGE0MCA0MCAwIDAgMCAzNC43My03MlpNMTY4IDIwOGEyNCAyNCAwIDAgMS05LjQ1LTEuOTNhODAuMTQgODAuMTQgMCAwIDAtNjEuMTkgMGEyNCAyNCAwIDAgMS0yMC43MS00My4yNmE1MS4yMiA1MS4yMiAwIDAgMCAyNC40Ni0zMC42N2EyOCAyOCAwIDAgMSA1My43OCAwYTUxLjI3IDUxLjI3IDAgMCAwIDI0LjUzIDMwLjcxQTI0IDI0IDAgMCAxIDE2OCAyMDgiLz48L2c+PC9zdmc+) center center no-repeat',
  })
})
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
      <svg class="ball" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><g fill="none" stroke="#cccccc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7c.08.703 1.725 1.722 3.656 1c1.261-.472 1.96-1.45 2.344-2.5m5.767-3.328c0-1.39 1.577-2.493 3.5-2.172c2.823.47 4.113 6.006 4 7c-.08.703-1.725 1.722-3.656 1c-1.261-.472-1.855-1.45-2.239-2.5M8 14v.5m8-.5v.5m-4.75 1.75h1.5L12 17z" /><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" /></g></svg>
      <!-- <svg width="100" height="100" class="ball" viewBox="0 0 24 24">
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
      </svg> -->
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
