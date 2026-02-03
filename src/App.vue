<script setup lang="ts">
import type { Song } from 'vue3-music-player'
import { sThree } from '@simon_he/s-three'

import { useEventListener } from '@vueuse/core'
import {
  DotImageCanvas,
  // DotTextCanvas,
  getDevice,
  prefetch,
  scrollToTop,
  useRaf,
} from 'lazy-js-utils'
// import gitFork from '@simon_he/git-fork-vue'
import { createMouseAnimation } from 'mouse-element'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import MusicPlayer from 'vue3-music-player'
import { useRouter } from 'vue-router'
import { isDark } from '~/logics'
import { isZh } from '../lang'
// import antfu from '/images/af.png'
// import fs from '/images/fs.jpeg'
// import flag from '/images/flag.jpg'
import daoxiangLrc from '../public/audio/daoxiang.lrc'
import kaibuliaokouLrc from '../public/audio/kaibuliaokou.lrc'
import 'vue3-music-player/index.css'
import 'vue3-music-player/tailwind.css'

import backTop from '/backTop.png'
import cloth from '/images/24.png'
import kb from '/images/kb.png'

useHead({
  meta: [
    { property: 'og:title', content: 'Simon He' },
    { property: 'og:image', content: '/black.png' },
    { name: 'description', content: 'Simon He\'s Portfolio' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:creator', content: '@simon_he1995' },
  ],
})
const imageShow = computed(() => {
  const { os } = getDevice()
  return os === 'mac' || os === 'windows' || os === 'macOS'
})
const musicPlayer = ref<any>(null)
// 示例播放列表 - 包含本地和在线备用音频及歌词
const playlist = ref<Song[]>([
  {
    id: 1,
    title: '稻香',
    artist: '周杰伦',
    cover: 'data:image/jpeg;base64,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',
    src: '/audio/daoxiang.mp3',
    lyrics: daoxiangLrc,
  },
  {
    id: 2,
    title: '开不了口',
    artist: '周杰伦',
    cover: 'data:image/jpeg;base64,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',
    src: '/audio/kaibuliaokou.mp3',
    lyrics: kaibuliaokouLrc,
  },
])

const dotImage1 = new DotImageCanvas(kb, '', 3, 'transparent', 'out-center')
const dotImage2 = new DotImageCanvas(cloth, '', 3, 'transparent', 'center-out')

const text = ref('')

onMounted(() => {
  prefetch(['https://cdn.jsdelivr.net/gh/Simon-He95/sponsor/sponsors_circle.svg'])
  if (imageShow.value) {
    dotImage1.append('.dotImage')
    dotImage2.append('.cloth')
  }
  const stop = useEventListener('click', () => {
    musicPlayer.value.play()
    stop()
  })
})

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
    // useRaf(update, 200, true)
    // if (val.path === '/friends') {
    //   setTimeout(() => {
    //     dotImage.repaint(antfu, '', 3, 'transparent')
    //   })
    // } else if (val.path === '/') {
    //   setTimeout(() => {
    //     dotImage.clearCanvas()
    //     dotImage.repaint(kb, '', 3, 'transparent')
    //   })
    // }
  },
  {
    immediate: true,
  },
)
// const fontSize = 18
// const fontWeight = 7
// const dotText = new DotTextCanvas(
//   text.value,
//   fontSize,
//   isDark.value ? 'white' : 'black',
//   fontWeight,
// )
// dotText.append('.dotText')
type SeasonTheme = 'spring' | 'summer' | 'autumn' | 'winter'

const seasonTheme = ref<SeasonTheme>('winter')

function getSeasonThemeByDate(date: Date): SeasonTheme {
  const m = date.getMonth() + 1
  if (m >= 3 && m <= 5)
    return 'spring'
  if (m >= 6 && m <= 8)
    return 'summer'
  if (m >= 9 && m <= 11)
    return 'autumn'
  return 'winter'
}

function resolveSeasonTheme() {
  if (typeof window === 'undefined')
    return getSeasonThemeByDate(new Date())

  const q = new URLSearchParams(window.location.search).get('season')?.toLowerCase()
  if (q === 'spring' || q === 'summer' || q === 'autumn' || q === 'winter')
    return q

  return getSeasonThemeByDate(new Date())
}

onMounted(() => {
  seasonTheme.value = resolveSeasonTheme()
})

function getParticleTint(theme: SeasonTheme) {
  if (theme === 'winter')
    return isDark.value ? '#ffffff' : '#8fbbe8'
  if (theme === 'summer')
    return isDark.value ? '#ffffff' : '#64748b'
  return '#ffffff'
}

let material: any
function update() {
  try {
    // dotText.repaint(text.value, fontSize, isDark.value ? 'white' : 'black', fontWeight)
    material?.color?.set(getParticleTint(seasonTheme.value))
  }
  catch (error) {
  }
}
const isShow = ref(false)
let lastInteractionTs = 0
let isLowPowerDevice = false
let prefersReducedMotion = false
useEventListener(
  document,
  'scroll',
  () => {
    isShow.value = document.documentElement.scrollTop > 500
    lastInteractionTs = performance.now()
  },
  { passive: true },
)

let points: any
let unmount: any
let geometry: any
const textures: Partial<Record<SeasonTheme, any>> = {}
let speeds: Float32Array | undefined
let drift: Float32Array | undefined
let driftStrengths: Float32Array | undefined
let particleScales: Float32Array | undefined
let particleAlphas: Float32Array | undefined
let particleCount = 0
let lastTimestamp = 0
let lastSnowUpdateTs = 0
const particleDensity = ref(1)
interface ThemeConfig {
  count: number
  size: number
  depth: number
  zNear?: number
  speedMin: number
  speedMax: number
  driftStrength: number
  swaySpeed: number
  opacity: number
  direction: 1 | -1
}
const themeConfigs: Record<SeasonTheme, ThemeConfig> = {
  spring: {
    count: 500,
    size: 0.05,
    depth: 2.2,
    speedMin: 0.12,
    speedMax: 0.35,
    driftStrength: 0.22,
    swaySpeed: 0.7,
    opacity: 0.95,
    direction: 1,
  },
  summer: {
    count: 380,
    size: 0.05,
    depth: 2.2,
    speedMin: 0.08,
    speedMax: 0.22,
    driftStrength: 0.12,
    swaySpeed: 0.55,
    opacity: 0.95,
    direction: 1,
  },
  autumn: {
    count: 460,
    size: 0.055,
    depth: 2.4,
    speedMin: 0.18,
    speedMax: 0.5,
    driftStrength: 0.18,
    swaySpeed: 0.65,
    opacity: 0.95,
    direction: 1,
  },
  winter: {
    count: 420,
    size: 0.075,
    depth: 3.4,
    zNear: 1.4,
    speedMin: 0.22,
    speedMax: 0.75,
    driftStrength: 0.12,
    swaySpeed: 0.6,
    opacity: 0.98,
    direction: 1,
  },
}
let snowPointerX = 0
let snowPointerY = 0
let snowParallaxX = 0
let snowParallaxY = 0

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function resolveZRange(config: ThemeConfig, cameraZ: number) {
  const zNear = Math.min(config.zNear ?? (cameraZ - 1.1), cameraZ - 0.2)
  const zFar = zNear - Math.max(0.0001, config.depth)
  const span = Math.max(0.0001, zNear - zFar)
  return { zNear, zFar, span }
}

function zToDepthT(z: number, zRange: ReturnType<typeof resolveZRange>) {
  return clamp((z - zRange.zFar) / zRange.span, 0, 1)
}

function applyDepthMaterialHooks(mat: any) {
  mat.onBeforeCompile = (shader: any) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>\nattribute float aScale;\nattribute float aAlpha;\nvarying float vAlpha;`,
      )
      .replace(
        '#include <color_vertex>',
        `#include <color_vertex>\n\tvAlpha = aAlpha;`,
      )
      .replace('gl_PointSize = size;', 'gl_PointSize = size * aScale;')

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying float vAlpha;`)
      .replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        'vec4 diffuseColor = vec4( diffuse, opacity * vAlpha );',
      )
  }
  mat.customProgramCacheKey = () => 'depth-points-v1'
}

const { c, animationArray, THREE, scene, renderer } = sThree('#snow', {
  createMesh() {
    generateSeason()
  },
  createCamera() {
    const camera = c('pc')
    camera.position.set(0, 0, 2.5)
    return camera
  },
  animate({ camera, elapsedTime, timestamp }) {
    if (typeof document !== 'undefined' && document.hidden)
      return
    if (!geometry || !speeds || !drift || !driftStrengths || !particleScales || !particleAlphas || particleCount <= 0)
      return

    // Throttle the CPU-heavy particle simulation:
    // - run slower when user is idle
    // - respect prefers-reduced-motion / low-power hints
    const now = timestamp || performance.now()
    const idle = now - (lastInteractionTs || now) > 1500
    const targetFps = prefersReducedMotion ? 0 : (idle || isLowPowerDevice ? 12 : 30)
    if (targetFps > 0) {
      const interval = 1000 / targetFps
      if (lastSnowUpdateTs && now - lastSnowUpdateTs < interval)
        return
      lastSnowUpdateTs = now
    }

    const config = themeConfigs[seasonTheme.value]
    const positions = geometry.attributes.position.array as Float32Array
    const dt = Math.min(0.12, Math.max(0.001, (now - (lastTimestamp || now)) / 1000))
    lastTimestamp = now

    const parallaxStrength = seasonTheme.value === 'winter' ? 0.22 : 0.14
    const smoothing = Math.min(1, dt * 4.5)
    snowParallaxX += (snowPointerX * parallaxStrength - snowParallaxX) * smoothing
    snowParallaxY += (-snowPointerY * parallaxStrength - snowParallaxY) * smoothing
    camera.position.x = snowParallaxX
    camera.position.y = snowParallaxY
    camera.lookAt(0, 0, 0)

    const baseView = getViewSize(camera, 0)
    const baseDistance = Math.max(0.0001, Math.abs((camera?.position?.z ?? 0) - 0))
    const zRange = resolveZRange(config, camera?.position?.z ?? 2.5)
    let depthAttributesDirty = false

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3

      positions[i3 + 1] -= speeds[i] * dt * config.direction
      positions[i3 + 0] += Math.sin(elapsedTime * config.swaySpeed + drift[i]) * driftStrengths[i] * dt

      const z = positions[i3 + 2]
      const distance = Math.max(0.0001, Math.abs((camera?.position?.z ?? 0) - z))
      const viewScale = distance / baseDistance
      const width = baseView.width * viewScale
      const height = baseView.height * viewScale
      const halfWidth = width / 2
      const halfHeight = height / 2

      const outY = config.direction === 1 ? positions[i3 + 1] < -halfHeight : positions[i3 + 1] > halfHeight
      if (outY) {
        const nextZ = zRange.zFar + Math.random() * zRange.span
        const depthT = zToDepthT(nextZ, zRange)
        const depthCurve = depthT ** (seasonTheme.value === 'winter' ? 1.35 : 1.15)

        const scaleRange = seasonTheme.value === 'winter'
          ? { min: 0.45, max: 1.35 }
          : { min: 0.6, max: 1.15 }
        const alphaMin = seasonTheme.value === 'winter' ? 0.25 : 0.35

        particleScales[i] = lerp(scaleRange.min, scaleRange.max, depthCurve) * lerp(0.85, 1.15, Math.random())
        particleAlphas[i] = lerp(alphaMin, 1, depthT ** 1.15)
        driftStrengths[i] = config.driftStrength * lerp(0.22, 1, depthT)

        const baseSpeed = config.speedMin + Math.random() * (config.speedMax - config.speedMin)
        speeds[i] = baseSpeed * lerp(0.25, 1, depthT) * lerp(0.85, 1.15, Math.random())
        drift[i] = Math.random() * Math.PI * 2
        depthAttributesDirty = true

        const nextDistance = Math.max(0.0001, Math.abs((camera?.position?.z ?? 0) - nextZ))
        const nextViewScale = nextDistance / baseDistance
        const nextWidth = baseView.width * nextViewScale
        const nextHeight = baseView.height * nextViewScale
        const nextHalfWidth = nextWidth / 2
        const nextHalfHeight = nextHeight / 2

        positions[i3 + 0] = (Math.random() - 0.5) * nextWidth
        positions[i3 + 1] = config.direction === 1
          ? nextHalfHeight + Math.random() * nextHeight * 0.2
          : -nextHalfHeight - Math.random() * nextHeight * 0.2
        positions[i3 + 2] = nextZ
      }
      else if (positions[i3 + 0] > halfWidth) {
        positions[i3 + 0] -= width
      }
      else if (positions[i3 + 0] < -halfWidth) {
        positions[i3 + 0] += width
      }
    }

    geometry.attributes.position.needsUpdate = true
    if (depthAttributesDirty) {
      geometry.attributes.aScale.needsUpdate = true
      geometry.attributes.aAlpha.needsUpdate = true
    }
  },
})
function getViewSize(camera: any, z = 0) {
  const distance = Math.abs((camera?.position?.z ?? 0) - z)
  const vFov = ((camera?.fov ?? 50) * Math.PI) / 180
  const height = 2 * Math.tan(vFov / 2) * Math.max(0.0001, distance)
  return { width: height * (camera?.aspect ?? 1), height }
}

function setupTexture(tex: any) {
  tex.generateMipmaps = false
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.needsUpdate = true
  return tex
}

function createSnowTexture() {
  const canvas = document.createElement('canvas')
  const size = 256
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, size, size)

  const center = size / 2
  const radius = size * 0.42
  const branchLen = radius * 0.18

  ctx.save()
  ctx.translate(center, center)

  ctx.strokeStyle = 'rgba(255,255,255,1)'
  ctx.lineWidth = Math.max(2, size * 0.028)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (let i = 0; i < 6; i++) {
    ctx.save()
    ctx.rotate((Math.PI / 3) * i)

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -radius)

    const b1 = radius * 0.35
    const b2 = radius * 0.6

    ctx.moveTo(0, -b1)
    ctx.lineTo(branchLen, -b1 - branchLen * 0.2)
    ctx.moveTo(0, -b1)
    ctx.lineTo(-branchLen, -b1 - branchLen * 0.2)

    ctx.moveTo(0, -b2)
    ctx.lineTo(branchLen * 0.9, -b2 - branchLen * 0.15)
    ctx.moveTo(0, -b2)
    ctx.lineTo(-branchLen * 0.9, -b2 - branchLen * 0.15)

    ctx.stroke()
    ctx.restore()
  }

  ctx.fillStyle = 'rgba(255,255,255,1)'
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.07, 0, Math.PI * 2)
  ctx.fill()

  // tips (adds readability when downscaled + alpha-tested)
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  const tipR = radius * 0.04
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i
    ctx.beginPath()
    ctx.arc(Math.cos(a) * radius, Math.sin(a) * radius, tipR, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()

  return setupTexture(new THREE.CanvasTexture(canvas))
}

function createSakuraTexture() {
  const canvas = document.createElement('canvas')
  const size = 128
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, size, size)
  const center = size / 2
  const radius = size * 0.42

  ctx.save()
  ctx.translate(center, center)
  ctx.rotate(-0.25)

  const grad = ctx.createLinearGradient(-radius, -radius, radius, radius)
  grad.addColorStop(0, 'rgba(255, 226, 236, 1)')
  grad.addColorStop(0.6, 'rgba(255, 168, 198, 1)')
  grad.addColorStop(1, 'rgba(255, 120, 170, 1)')

  ctx.fillStyle = grad
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(0, -radius * 0.95)
  ctx.bezierCurveTo(radius * 0.65, -radius * 0.85, radius * 0.95, -radius * 0.1, 0, radius * 0.95)
  ctx.bezierCurveTo(-radius * 0.95, -radius * 0.1, -radius * 0.65, -radius * 0.85, 0, -radius * 0.95)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.globalAlpha = 0.35
  ctx.fillStyle = 'rgba(255,255,255,1)'
  ctx.beginPath()
  ctx.ellipse(-radius * 0.12, -radius * 0.25, radius * 0.18, radius * 0.35, -0.35, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()

  return setupTexture(new THREE.CanvasTexture(canvas))
}

function createDandelionTexture() {
  const canvas = document.createElement('canvas')
  const size = 160
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, size, size)
  const center = size / 2
  const tuftY = -26

  ctx.save()
  ctx.translate(center, center)
  ctx.rotate(-0.35)

  const halo = ctx.createRadialGradient(0, tuftY, 0, 0, tuftY, size * 0.55)
  halo.addColorStop(0, 'rgba(255,255,255,0.18)')
  halo.addColorStop(0.35, 'rgba(255,255,255,0.12)')
  halo.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = halo
  ctx.beginPath()
  ctx.arc(0, tuftY, size * 0.52, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalAlpha = 0.9
  ctx.strokeStyle = 'rgba(255,255,255,0.72)'
  ctx.lineWidth = Math.max(1.1, size * 0.01)
  ctx.lineCap = 'round'

  const stalkY0 = 46
  const seedY = 30
  ctx.beginPath()
  ctx.moveTo(0, stalkY0)
  ctx.quadraticCurveTo(-8, 8, 0, tuftY + 8)
  ctx.stroke()

  const seedGrad = ctx.createLinearGradient(-4, seedY - 8, 4, seedY + 8)
  seedGrad.addColorStop(0, 'rgba(180, 83, 9, 0.7)')
  seedGrad.addColorStop(1, 'rgba(120, 53, 15, 0.55)')
  ctx.fillStyle = seedGrad
  ctx.beginPath()
  ctx.ellipse(0, seedY, 3.2, 6.8, -0.25, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,255,255,0.78)'
  ctx.lineWidth = 1

  const hairs = 18
  for (let i = 0; i < hairs; i++) {
    const angle = (Math.PI * 2 * i) / hairs
    const len = size * 0.23
    const x2 = Math.cos(angle) * len
    const y2 = tuftY + Math.sin(angle) * len

    ctx.globalAlpha = 0.75
    ctx.beginPath()
    ctx.moveTo(0, tuftY)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    const px = -Math.sin(angle)
    const py = Math.cos(angle)
    ctx.globalAlpha = 0.28
    ctx.beginPath()
    ctx.moveTo(x2 - px * 4, y2 - py * 4)
    ctx.lineTo(x2 + px * 4, y2 + py * 4)
    ctx.stroke()
  }

  ctx.globalAlpha = 0.55
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.beginPath()
  ctx.arc(0, tuftY, 2.2, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()

  return setupTexture(new THREE.CanvasTexture(canvas))
}

function createMapleTexture() {
  const canvas = document.createElement('canvas')
  const size = 140
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, size, size)

  const center = size / 2
  const r = size * 0.42

  ctx.save()
  ctx.translate(center, center)
  ctx.rotate(-0.35)

  const grad = ctx.createLinearGradient(-r, -r, r, r)
  grad.addColorStop(0, 'rgba(251, 113, 133, 1)')
  grad.addColorStop(0.55, 'rgba(249, 115, 22, 1)')
  grad.addColorStop(1, 'rgba(245, 158, 11, 1)')
  ctx.fillStyle = grad
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.moveTo(0, -r * 1.05)
  ctx.lineTo(r * 0.18, -r * 0.58)
  ctx.lineTo(r * 0.7, -r * 0.78)
  ctx.lineTo(r * 0.42, -r * 0.3)
  ctx.lineTo(r * 0.96, -r * 0.12)
  ctx.lineTo(r * 0.38, r * 0.05)
  ctx.lineTo(r * 0.6, r * 0.65)
  ctx.lineTo(r * 0.18, r * 0.35)
  ctx.lineTo(0, r * 0.98)
  ctx.lineTo(-r * 0.18, r * 0.35)
  ctx.lineTo(-r * 0.6, r * 0.65)
  ctx.lineTo(-r * 0.38, r * 0.05)
  ctx.lineTo(-r * 0.96, -r * 0.12)
  ctx.lineTo(-r * 0.42, -r * 0.3)
  ctx.lineTo(-r * 0.7, -r * 0.78)
  ctx.lineTo(-r * 0.18, -r * 0.58)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.strokeStyle = 'rgba(120, 53, 15, 0.35)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, r * 0.95)
  ctx.lineTo(0, -r * 0.55)
  ctx.stroke()

  ctx.restore()

  return setupTexture(new THREE.CanvasTexture(canvas))
}

function getThemeTexture(theme: SeasonTheme) {
  if (textures[theme])
    return textures[theme]

  if (typeof document === 'undefined')
    return undefined

  const tex = theme === 'winter'
    ? createSnowTexture()
    : theme === 'spring'
      ? createSakuraTexture()
      : theme === 'summer'
        ? createDandelionTexture()
        : createMapleTexture()

  textures[theme] = tex
  return tex
}

function generateSeason() {
  generateParticles(seasonTheme.value)
}

function generateParticles(theme: SeasonTheme) {
  const config = themeConfigs[theme]
  const count = Math.max(40, Math.round(config.count * particleDensity.value))
  if (points) {
    unmount?.()
    const idx = animationArray.indexOf(points)
    if (idx >= 0)
      animationArray.splice(idx, 1)
    geometry?.dispose?.()
    material?.dispose?.()
  }

  geometry = c('bufferg')

  const aspect = typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1
  const baseHeight = 4
  const baseWidth = baseHeight * aspect
  const cameraZ = 2.5
  const zRange = resolveZRange(config, cameraZ)

  const positions = new Float32Array(count * 3)
  speeds = new Float32Array(count)
  drift = new Float32Array(count)
  driftStrengths = new Float32Array(count)
  particleScales = new Float32Array(count)
  particleAlphas = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const z = zRange.zFar + Math.random() * zRange.span
    const depthT = zToDepthT(z, zRange)
    const depthCurve = depthT ** (theme === 'winter' ? 1.35 : 1.15)

    const scaleRange = theme === 'winter'
      ? { min: 0.8, max: 2.6 }
      : { min: 0.6, max: 1.15 }
    const alphaMin = theme === 'winter' ? 0.3 : 0.35

    particleScales[i] = lerp(scaleRange.min, scaleRange.max, depthCurve) * lerp(0.85, 1.15, Math.random())
    particleAlphas[i] = lerp(alphaMin, 1, depthT ** 1.15)
    driftStrengths[i] = config.driftStrength * lerp(0.22, 1, depthT)

    const baseSpeed = config.speedMin + Math.random() * (config.speedMax - config.speedMin)
    speeds[i] = baseSpeed * lerp(0.25, 1, depthT) * lerp(0.85, 1.15, Math.random())
    drift[i] = Math.random() * Math.PI * 2

    const distance = Math.max(0.0001, cameraZ - z)
    const viewScale = distance / cameraZ
    const width = baseWidth * viewScale
    const height = baseHeight * viewScale
    const halfHeight = height / 2

    positions[i3 + 0] = (Math.random() - 0.5) * width
    // On initial load, let snow "enter" from the top instead of popping everywhere.
    // Keep only a tiny portion inside the view, and spread spawn distance so it trickles in.
    if (theme === 'winter' && Math.random() < 0.94)
      positions[i3 + 1] = halfHeight + Math.random() * height * 4.5
    else
      positions[i3 + 1] = (Math.random() - 0.5) * height
    positions[i3 + 2] = z
  }

  geometry.setAttribute('position', c('ba', positions, 3))
  geometry.setAttribute('aScale', c('ba', particleScales, 1))
  geometry.setAttribute('aAlpha', c('ba', particleAlphas, 1))

  material = c('pm', {
    size: config.size,
    sizeAttenuation: true,
    depthWrite: false,
    transparent: true,
    opacity: config.opacity,
    blending: THREE.NormalBlending,
    map: getThemeTexture(theme),
    alphaTest: theme === 'winter' ? 0.02 : 0.08,
    color: getParticleTint(theme),
  })
  applyDepthMaterialHooks(material)

  points = c('p', geometry, material)
  unmount = scene._add?.(points)
  renderer.setClearColor(c('c', 'transparent'), 0)
  animationArray.push(points)
  particleCount = count
  lastTimestamp = 0
  lastSnowUpdateTs = 0
}

watch(seasonTheme, () => {
  generateSeason()
  update()
})

onBeforeUnmount(() => {
  unmount?.()
  geometry?.dispose?.()
  material?.dispose?.()
  Object.values(textures).forEach(t => t?.dispose?.())
})
const left = ref(0)
const top = ref(0)
// 初始化获取鼠标位置

const maxWidth = document.documentElement.clientWidth
const maxHeight = document.documentElement.clientHeight
let dotImage3
watch(() => isShow.value, (newV) => {
  if (newV) {
    if (!dotImage3) {
      dotImage3 = new DotImageCanvas(backTop, '', 3, 'transparent', 'center-out')
      dotImage3.isPreferred = true
    }

    if (!dotImage3.mounted) {
      dotImage3.mounted = true
      dotImage3.append('.backTop')
      dotImage3.canvas.style.width = '100%'
    }
    else {
      dotImage3.continue()
    }
  }
  else {
    dotImage3.revert()
  }
})
let lastMouseFxTs = 0
let mouseRaf = 0
let pendingMouse: MouseEvent | null = null

function flushMouse() {
  mouseRaf = 0
  const e = pendingMouse
  pendingMouse = null
  if (!e)
    return
  if (typeof document !== 'undefined' && document.hidden)
    return

  const w = window.innerWidth || document.documentElement.clientWidth || 1
  const h = window.innerHeight || document.documentElement.clientHeight || 1
  snowPointerX = (e.clientX / w) * 2 - 1
  snowPointerY = (e.clientY / h) * 2 - 1
  left.value = 200 - (e.x / maxWidth) * 200
  top.value = 200 - (e.y / maxHeight) * 200

  const now = performance.now()
  if (now - lastMouseFxTs > 140) {
    lastMouseFxTs = now
    createMouseAnimation(e, {
      background: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxnIGZpbGw9IiNjY2NjY2MiPjxwYXRoIGQ9Ik0yMzIgMTA4YTIwIDIwIDAgMSAxLTIwLTIwYTIwIDIwIDAgMCAxIDIwIDIwbS0xNjggMGEyMCAyMCAwIDEgMC0yMCAyMGEyMCAyMCAwIDAgMCAyMC0yMG0yOC0yOGEyMCAyMCAwIDEgMC0yMC0yMGEyMCAyMCAwIDAgMCAyMCAyMG03MiAwYTIwIDIwIDAgMSAwLTIwLTIwYTIwIDIwIDAgMCAwIDIwIDIwbTE5LjI0IDc1Ljg1QTQzLjQ2IDQzLjQ2IDAgMCAxIDE2Mi41NyAxMzBhMzYgMzYgMCAwIDAtNjkuMTQgMGE0My40OSA0My40OSAwIDAgMS0yMC42NyAyNS45YTMyIDMyIDAgMCAwIDI3LjczIDU3LjYyYTcyLjQ5IDcyLjQ5IDAgMCAxIDU1IDBhMzIgMzIgMCAwIDAgMjcuNzMtNTcuNjJaIiBvcGFjaXR5PSIuMiIvPjxwYXRoIGQ9Ik0yMTIgODBhMjggMjggMCAxIDAgMjggMjhhMjggMjggMCAwIDAtMjgtMjhtMCA0MGExMiAxMiAwIDEgMSAxMi0xMmExMiAxMiAwIDAgMS0xMiAxMk03MiAxMDhhMjggMjggMCAxIDAtMjggMjhhMjggMjggMCAwIDAgMjgtMjhtLTI4IDEyYTEyIDEyIDAgMSAxIDEyLTEyYTEyIDEyIDAgMCAxLTEyIDEybTQ4LTMyYTI4IDI4IDAgMSAwLTI4LTI4YTI4IDI4IDAgMCAwIDI4IDI4bTAtNDBhMTIgMTIgMCAxIDEtMTIgMTJhMTIgMTIgMCAwIDEgMTItMTJtNzIgNDBhMjggMjggMCAxIDAtMjgtMjhhMjggMjggMCAwIDAgMjggMjhtMC00MGExMiAxMiAwIDEgMS0xMiAxMmExMiAxMiAwIDAgMSAxMi0xMm0yMy4xMiAxMDAuODZhMzUuMyAzNS4zIDAgMCAxLTE2Ljg3LTIxLjE0YTQ0IDQ0IDAgMCAwLTg0LjUgMEEzNS4yNSAzNS4yNSAwIDAgMSA2OSAxNDguODJBNDAgNDAgMCAwIDAgODggMjI0YTM5LjQ4IDM5LjQ4IDAgMCAwIDE1LjUyLTMuMTNhNjQuMDkgNjQuMDkgMCAwIDEgNDguODcgMGE0MCA0MCAwIDAgMCAzNC43My03MlpNMTY4IDIwOGEyNCAyNCAwIDAgMS05LjQ1LTEuOTNhODAuMTQgODAuMTQgMCAwIDAtNjEuMTkgMGEyNCAyNCAwIDAgMS0yMC43MS00My4yNmE1MS4yMiA1MS4yMiAwIDAgMCAyNC40Ni0zMC42N2EyOCAyOCAwIDAgMSA1My43OCAwYTUxLjI3IDUxLjI3IDAgMCAwIDI0LjUzIDMwLjcxQTI0IDI0IDAgMCAxIDE2OCAyMDgiLz48L2c+PC9zdmc+) center center no-repeat',
    })
  }
}

useEventListener(
  document,
  'mousemove',
  (e: MouseEvent) => {
    if (typeof window === 'undefined')
      return
    lastInteractionTs = performance.now()
    pendingMouse = e
    if (!mouseRaf)
      mouseRaf = window.requestAnimationFrame(flushMouse)
  },
  { passive: true },
)

onMounted(() => {
  lastInteractionTs = performance.now()
  try {
    const saveData = (navigator as any)?.connection?.saveData
    const cores = navigator.hardwareConcurrency ?? 8
    isLowPowerDevice = !!saveData || cores <= 4
    particleDensity.value = isLowPowerDevice ? 0.55 : (cores <= 6 ? 0.75 : 1)
    const mql = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (mql) {
      prefersReducedMotion = mql.matches
      mql.addEventListener?.('change', ev => (prefersReducedMotion = (ev as MediaQueryListEvent).matches))
    }
  }
  catch {
    isLowPowerDevice = true
    particleDensity.value = 0.75
  }

  try {
    const snowEl = document.querySelector('#snow') as HTMLElement | null
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLowPowerDevice ? 1 : 1.25))
    if (snowEl)
      renderer.setSize(snowEl.offsetWidth, snowEl.offsetHeight, false)
  }
  catch {
  }

  const stop = useRaf(() => {
    if (dotImage1.status === 'success' && window.gsap && window.ScrollTrigger) {
      stop()
      window.gsap.registerPlugin(window.ScrollTrigger)

      // First set initial opacity to 0
      window.gsap.set('.dotImage', { opacity: 0 })

      // Fade in first with a simple animation
      window.gsap.to('.dotImage', {
        opacity: 1,
        duration: 0.8,
      })

      // Create a simple timeline for horizontal movement
      const tl = window.gsap.timeline({
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true, // Smooth scrubbing effect
          invalidateOnRefresh: true,
          onRefresh: () => {
            // Recalculate on window resize
            tl.progress(window.scrollY / (document.body.scrollHeight - window.innerHeight))
          },
        },
      })

      // Add the horizontal movement animation
      tl.fromTo('.dotImage', { translateX: '-15%' }, { translateX: '5%', ease: 'none' })

      // Do the same for the second image if needed
      window.gsap.set('.cloth', { opacity: 0 })
      window.gsap.to('.cloth', { opacity: 1, duration: 0.8 })

      const tl2 = window.gsap.timeline({
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      tl2.fromTo('.cloth', { translateX: '5%' }, { translateX: '-5%', ease: 'none' })
    }
  }, {
    delta: 200,
  })
})
</script>

<template>
  <!-- <gitFork lt-md:hidden position="left" z--1 link="https://github.com/Simon-He95" /> -->
  <div id="snow" fixed w-full h-full z--1 />
  <SeasonDecor3D
    v-if="seasonTheme === 'spring'"
    theme="spring"
    :dark="isDark"
    :width="190"
    :height="210"
    class="season-decor spring-decor lt-md:hidden"
    fixed
    bottom-6
    left-6
    z-0
    pointer-events-none
  />
  <SeasonDecor3D
    v-if="seasonTheme === 'summer'"
    theme="summer"
    :dark="isDark"
    :width="190"
    :height="210"
    class="season-decor summer-decor lt-md:hidden"
    fixed
    bottom-6
    right-6
    z-0
    pointer-events-none
  />
  <SeasonDecor3D
    v-if="seasonTheme === 'autumn'"
    theme="autumn"
    :dark="isDark"
    :width="200"
    :height="220"
    class="season-decor autumn-decor lt-md:hidden"
    fixed
    bottom-6
    right-6
    z-0
    pointer-events-none
  />
  <SeasonDecor3D
    v-if="seasonTheme === 'winter'"
    theme="winter"
    variant="snowman"
    :dark="isDark"
    :width="150"
    :height="190"
    class="season-decor winter-decor winter-snowman lt-md:hidden"
    fixed
    bottom-6
    left-6
    z-0
    pointer-events-none
  />
  <SeasonDecor3D
    v-if="seasonTheme === 'winter'"
    theme="winter"
    variant="tree"
    :dark="isDark"
    :width="160"
    :height="200"
    class="season-decor winter-decor winter-tree lt-md:hidden"
    fixed
    bottom-6
    right-6
    z-0
    pointer-events-none
  />
  <span v-if="imageShow" class="dotImage" fixed top-20 left--80 z--1 />
  <span v-if="imageShow" class="cloth" fixed top-20 right--120 z--1 />
  <span class="dotText" fixed bottom-5 right-0 />
  <NavBar />
  <main class="px-7 py-10" overflow-x-hidden>
    <router-view />
    <Footer />
    <!-- <Levitation /> -->
  </main>
  <a
    class="backTop" animate-tada hover="animate-none" fixed bottom-40 right-5 text-3xl w30 src="/backTop.png"
    alt="backTop" @click="scrollToTop()"
  />
  <!-- <img
    v-if="isShow" animate-tada hover="animate-none"
    fixed bottom-40 right-5 text-3xl src="/backTop.png" alt="backTop" @click="scrollToTop()"
  > -->
  <div
    fixed w-100 z--5 left-1 top-80 :style="{
      transform: `translate(${left}px, ${top}px)`,
    }"
  >
    <div className="planet">
      <img class="ball" src="/ball.png" alt="">
      <!--
      <svg class="ball" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
        <g fill="none" stroke="#cccccc" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path
            d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7c.08.703 1.725 1.722 3.656 1c1.261-.472 1.96-1.45 2.344-2.5m5.767-3.328c0-1.39 1.577-2.493 3.5-2.172c2.823.47 4.113 6.006 4 7c-.08.703-1.725 1.722-3.656 1c-1.261-.472-1.855-1.45-2.239-2.5M8 14v.5m8-.5v.5m-4.75 1.75h1.5L12 17z"
          />
          <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306"
          />
        </g>
      </svg>
      -->
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
  <MusicPlayer ref="musicPlayer" :playlist="playlist" />
</template>

<style>
  body {
    cursor: url(https://cdn.custom-cursor.com/db/8130/32/manga-himouto-umaru-chan-umaru-and-cola-cursor.png),
      default !important;
  }

  a,
  .link {
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

  .rotated-hand {
    animation: rotate 1s 0.5s infinite linear alternate-reverse;
  }

  @keyframes rotate {
    0% {
      transform: rotate(-20deg);
    }

    100% {
      transform: rotate(30deg);
    }

  }

  .season-decor {
    opacity: 0.95;
    filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.18));
    transform-origin: bottom center;
    animation: winter-float 6s ease-in-out infinite;

    --season-stroke: rgba(55, 65, 81, 0.45);
  }

  .dark .season-decor {
    filter: drop-shadow(0 14px 30px rgba(0, 0, 0, 0.35));
    --season-stroke: rgba(255, 255, 255, 0.22);
  }

  .spring-decor {
    --spring-trunk: rgba(120, 53, 15, 0.72);
    --spring-branch: rgba(120, 53, 15, 0.45);
    --spring-blossom-1: rgba(255, 192, 203, 0.98);
    --spring-blossom-2: rgba(255, 153, 204, 0.95);
    --spring-petal: rgba(255, 235, 243, 0.95);
  }

  .autumn-decor {
    --autumn-trunk: rgba(120, 53, 15, 0.78);
    --autumn-leaf-1: rgba(249, 115, 22, 0.96);
    --autumn-leaf-2: rgba(245, 158, 11, 0.95);
    --autumn-leaf-3: rgba(239, 68, 68, 0.92);
  }

  .summer-decor {
    --summer-stem: rgba(34, 197, 94, 0.82);
    --summer-head: rgba(226, 232, 240, 0.95);
    --summer-seed: rgba(255, 255, 255, 0.98);
  }

  .winter-decor {
    --season-stroke: rgba(55, 65, 81, 0.5);
    --winter-stroke: rgba(55, 65, 81, 0.5);
    --winter-snow: rgba(255, 255, 255, 0.95);
    --winter-eye: rgba(31, 41, 55, 0.9);
    --winter-mouth: rgba(55, 65, 81, 0.7);
    --winter-button: rgba(31, 41, 55, 0.85);
    --winter-nose: rgba(255, 94, 0, 0.98);
    --winter-scarf: rgba(239, 68, 68, 0.9);
    --winter-hat: rgba(31, 41, 55, 0.9);

    --winter-star: rgba(250, 204, 21, 0.95);
    --winter-tree: rgba(34, 197, 94, 0.88);
    --winter-trunk: rgba(120, 53, 15, 0.85);
    --winter-garland: rgba(59, 130, 246, 0.7);
    --winter-ornament-1: rgba(239, 68, 68, 0.95);
    --winter-ornament-2: rgba(59, 130, 246, 0.95);
    --winter-ornament-3: rgba(168, 85, 247, 0.95);
  }

  .dark .winter-decor {
    --season-stroke: rgba(255, 255, 255, 0.22);
    --winter-stroke: rgba(255, 255, 255, 0.22);
    --winter-snow: rgba(255, 255, 255, 0.98);
    --winter-eye: rgba(17, 24, 39, 0.95);
    --winter-mouth: rgba(17, 24, 39, 0.7);
  }

  .winter-tree {
    animation-delay: -1.2s;
  }

  @keyframes winter-float {
    0%,
    100% {
      transform: translateY(0) rotate(-0.5deg);
    }

    50% {
      transform: translateY(-6px) rotate(0.5deg);
    }
  }
</style>
