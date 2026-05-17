<script setup lang="ts">
import type { Song } from 'vue3-music-player'
import { useEventListener } from '@vueuse/core'
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { isDark } from '~/logics'
// import antfu from '/images/af.png'
// import fs from '/images/fs.jpeg'
// import flag from '/images/flag.jpg'

import backTop from '/backTop.png'
import cloth from '/images/24.png'
import kb from '/images/kb.png'

const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'

useHead({
  meta: [
    { property: 'og:title', content: 'Simon He' },
    { property: 'og:image', content: '/black.png' },
    { name: 'description', content: 'Simon He\'s Portfolio' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:creator', content: '@simon_he1995' },
  ],
})

const loadMusicPlayer = () => import('./components/LazyMusicPlayer.vue')

const LazyMusicPlayer = defineAsyncComponent({
  loader: loadMusicPlayer,
  suspensible: false,
})

const LazySeasonDecor3D = defineAsyncComponent({
  loader: () => import('./components/SeasonDecor3D.vue'),
  suspensible: false,
})

function prefetchAsset(urls: string[]) {
  if (!isClient)
    return

  for (const href of urls) {
    if (document.head.querySelector(`link[rel="prefetch"][href="${href}"]`))
      continue

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.as = 'image'
    link.href = href
    document.head.appendChild(link)
  }
}

function runWhenIdle(task: () => void | Promise<void>, timeout = 1200) {
  if (!isClient)
    return () => {}

  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(() => {
      void task()
    }, { timeout })
    return () => window.cancelIdleCallback(id)
  }

  const id = window.setTimeout(() => {
    void task()
  }, Math.min(timeout, 600))
  return () => window.clearTimeout(id)
}

function scrollToTop() {
  if (!isClient)
    return

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let createMouseAnimationFn: any
let sThreeFactory: any

async function loadMouseAnimation() {
  if (!createMouseAnimationFn) {
    const mod = await import('mouse-element')
    createMouseAnimationFn = mod.createMouseAnimation
  }
  return createMouseAnimationFn
}

async function loadSThree() {
  if (!sThreeFactory) {
    const mod = await import('@simon_he/s-three')
    sThreeFactory = mod.sThree
  }
  return sThreeFactory
}

const reduceMotion = ref(true)
const lowPowerMode = ref(true)
const desktopViewport = ref(false)
const showSeasonDecor = ref(false)
const showPlanet = ref(false)
const showMusicPlayer = ref(false)
const musicLoading = ref(false)
const particleDensity = ref(1)
let cancelHeroIdle: (() => void) | undefined
let cancelSeasonIdle: (() => void) | undefined
let cancelSnowIdle: (() => void) | undefined

const macWindowsPlatformRegex = /mac|win/i
const macWindowsUserAgentRegex = /mac|windows/i

function detectDesktopOs() {
  if (!isClient)
    return false

  return macWindowsPlatformRegex.test(navigator.platform) || macWindowsUserAgentRegex.test(navigator.userAgent)
}

const imageShow = computed(() =>
  isClient
  && desktopViewport.value
  && !lowPowerMode.value
  && !reduceMotion.value
  && detectDesktopOs(),
)

const enableAtmosphere = computed(() =>
  isClient
  && desktopViewport.value
  && !lowPowerMode.value
  && !reduceMotion.value,
)

const playlist = shallowRef<Song[]>([])
const playlistLoaded = ref(false)
let playlistPromise: Promise<void> | undefined

function syncClientCapabilities() {
  if (!isClient)
    return

  const width = window.innerWidth || document.documentElement.clientWidth || 0
  const saveData = (navigator as any)?.connection?.saveData ?? false
  const cores = navigator.hardwareConcurrency ?? 8

  desktopViewport.value = width >= 640
  lowPowerMode.value = !!saveData || cores <= 4
  reduceMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  showPlanet.value = width >= 1280 && !lowPowerMode.value && !reduceMotion.value
  if (!desktopViewport.value || lowPowerMode.value || reduceMotion.value)
    showSeasonDecor.value = false
  particleDensity.value = lowPowerMode.value ? 0.42 : (cores <= 6 ? 0.66 : 0.85)
}

function ensurePlaylistLoaded() {
  if (playlistLoaded.value)
    return Promise.resolve()

  playlistPromise ||= import('./data/playlist').then(async (mod) => {
    playlist.value = await mod.loadPlaylist()
    playlistLoaded.value = true
  }).catch((error) => {
    playlistPromise = undefined
    throw error
  })

  return playlistPromise
}

async function ensureMusicPlayerVisible() {
  if (showMusicPlayer.value || musicLoading.value)
    return

  musicLoading.value = true

  try {
    await Promise.all([
      loadMusicPlayer(),
      ensurePlaylistLoaded(),
    ])
    showMusicPlayer.value = true
  }
  catch {
  }
  finally {
    musicLoading.value = false
  }
}

type DotImageCanvasCtor = typeof import('lazy-js-utils')['DotImageCanvas']

let dotImageCanvasCtor: DotImageCanvasCtor | undefined
let dotImage1: any
let dotImage2: any
const loadedScripts = new Map<string, Promise<void>>()
let cleanupDotImageScroll: (() => void) | undefined
let dotImageScrollTimer: number | undefined
let dotImageScrollAttempts = 0

function clearDotImageScrollTimer() {
  if (!isClient || dotImageScrollTimer === undefined)
    return

  window.clearTimeout(dotImageScrollTimer)
  dotImageScrollTimer = undefined
}

async function loadDotImageCanvas() {
  if (!dotImageCanvasCtor) {
    const mod = await import('lazy-js-utils')
    dotImageCanvasCtor = mod.DotImageCanvas
  }

  return dotImageCanvasCtor
}

function scheduleDotImageScrollAnimation(delay = 0) {
  if (!isClient)
    return

  clearDotImageScrollTimer()
  dotImageScrollTimer = window.setTimeout(() => {
    dotImageScrollTimer = undefined
    void setupDotImageScrollAnimation()
  }, delay)
}

function loadScriptOnce(src: string, isReady: () => boolean) {
  if (!isClient || isReady())
    return Promise.resolve()

  const existing = loadedScripts.get(src)
  if (existing)
    return existing

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.onload = () => resolve()
    script.onerror = () => {
      loadedScripts.delete(src)
      script.remove()
      reject(new Error(`Failed to load ${src}`))
    }
    document.head.appendChild(script)
  })

  loadedScripts.set(src, promise)
  return promise
}

async function loadGsap() {
  await loadScriptOnce('/gsap.min.js', () => !!window.gsap)
  await loadScriptOnce('/ScrollTrigger.min.js', () => !!window.ScrollTrigger)

  if (!window.gsap || !window.ScrollTrigger)
    throw new Error('GSAP or ScrollTrigger is not available')

  window.gsap.registerPlugin(window.ScrollTrigger)
  return window.gsap
}

async function setupDotImageScrollAnimation() {
  if (!isClient || !imageShow.value)
    return

  if (dotImage1?.status !== 'success') {
    if (dotImageScrollAttempts < 40) {
      dotImageScrollAttempts += 1
      scheduleDotImageScrollAnimation(250)
    }
    return
  }

  dotImageScrollAttempts = 0
  let gsap: any
  try {
    gsap = await loadGsap()
  }
  catch {
    return
  }

  if (!imageShow.value || dotImage1?.status !== 'success')
    return

  cleanupDotImageScroll?.()

  gsap.set('.dotImage', { opacity: 0 })
  gsap.to('.dotImage', {
    opacity: 1,
    duration: 0.8,
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: () => {
        tl.progress(window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight))
      },
    },
  })

  tl.fromTo('.dotImage', { translateX: '-15%' }, { translateX: '5%', ease: 'none' })

  gsap.set('.cloth', { opacity: 0 })
  gsap.to('.cloth', { opacity: 1, duration: 0.8 })

  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })

  tl2.fromTo('.cloth', { translateX: '5%' }, { translateX: '-5%', ease: 'none' })

  cleanupDotImageScroll = () => {
    tl.scrollTrigger?.kill()
    tl2.scrollTrigger?.kill()
    tl.kill()
    tl2.kill()
    gsap.killTweensOf(['.dotImage', '.cloth'])
  }
}

function pauseHeroImages() {
  dotImage1?.revert?.()
  dotImage2?.revert?.()
}

function resumeHeroImages() {
  dotImage1?.continue?.()
  dotImage2?.continue?.()
}

watch(imageShow, (visible) => {
  if (!isClient)
    return

  clearDotImageScrollTimer()
  dotImageScrollAttempts = 0
  cancelHeroIdle?.()
  cancelHeroIdle = undefined

  if (!visible) {
    cleanupDotImageScroll?.()
    cleanupDotImageScroll = undefined
    pauseHeroImages()
    return
  }

  resumeHeroImages()
  cancelHeroIdle = runWhenIdle(mountHeroImages, 500)
}, { flush: 'post' })

async function ensureHeroImages() {
  if (!isClient)
    return

  const DotImageCanvas = await loadDotImageCanvas()

  dotImage1 ||= new DotImageCanvas(kb, '', 3, 'transparent', 'out-center')
  dotImage2 ||= new DotImageCanvas(cloth, '', 3, 'transparent', 'center-out')
}

async function mountHeroImages() {
  if (!isClient || !imageShow.value)
    return

  await ensureHeroImages()

  if (!imageShow.value)
    return

  if (dotImage1 && !dotImage1.mounted) {
    dotImage1.mounted = true
    dotImage1.append('.dotImage')
  }
  if (dotImage2 && !dotImage2.mounted) {
    dotImage2.mounted = true
    dotImage2.append('.cloth')
  }

  dotImageScrollAttempts = 0
  scheduleDotImageScrollAnimation(250)
}

onMounted(() => {
  prefetchAsset(['https://cdn.jsdelivr.net/gh/Simon-He95/sponsor/sponsors_circle.svg'])
})

watch(isDark, update)
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
  syncClientCapabilities()

  const motionMql = window.matchMedia?.('(prefers-reduced-motion: reduce)')
  if (motionMql)
    useEventListener(motionMql, 'change', syncClientCapabilities)
  useEventListener(window, 'resize', syncClientCapabilities, { passive: true })

  cancelSeasonIdle = runWhenIdle(async () => {
    if (desktopViewport.value && !lowPowerMode.value && !reduceMotion.value)
      showSeasonDecor.value = true
  }, 900)

  scheduleSnowScene()
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

function handleScroll() {
  if (!isClient)
    return

  isShow.value = document.documentElement.scrollTop > 500
  lastInteractionTs = performance.now()
}

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
let c: any
let animationArray: any[] = []
let THREE: any
let scene: any
let renderer: any
let snowInitToken = 0

function syncSnowRendererSize() {
  if (!isClient || !renderer)
    return

  try {
    const snowEl = document.querySelector('#snow') as HTMLElement | null
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPowerMode.value ? 1 : 1.15))
    if (snowEl)
      renderer.setSize(snowEl.offsetWidth, snowEl.offsetHeight, false)
  }
  catch {
  }
}

function scheduleSnowScene() {
  if (!isClient)
    return

  cancelSnowIdle?.()
  cancelSnowIdle = undefined

  if (!enableAtmosphere.value)
    return

  cancelSnowIdle = runWhenIdle(async () => {
    await nextTick()

    if (!enableAtmosphere.value)
      return

    await initSnowScene()
    syncSnowRendererSize()
  }, 900)
}

function disposeSnowScene() {
  snowInitToken += 1

  unmount?.()

  if (points) {
    const idx = animationArray.indexOf(points)
    if (idx >= 0)
      animationArray.splice(idx, 1)
  }

  geometry?.dispose?.()
  material?.dispose?.()
  Object.values(textures).forEach(t => t?.dispose?.())
  renderer?.dispose?.()
  renderer?.domElement?.remove?.()

  points = undefined
  unmount = undefined
  geometry = undefined
  material = undefined
  particleCount = 0
  speeds = undefined
  drift = undefined
  driftStrengths = undefined
  particleScales = undefined
  particleAlphas = undefined

  c = undefined
  THREE = undefined
  scene = undefined
  renderer = undefined
  animationArray = []
  lastTimestamp = 0
  lastSnowUpdateTs = 0

  for (const key of Object.keys(textures) as SeasonTheme[])
    delete textures[key]
}

watch(enableAtmosphere, (enabled) => {
  if (!isClient)
    return

  if (!enabled) {
    cancelSnowIdle?.()
    cancelSnowIdle = undefined
    disposeSnowScene()
    return
  }

  scheduleSnowScene()
}, { flush: 'post' })

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

async function initSnowScene() {
  const token = ++snowInitToken

  if (!isClient || renderer || !enableAtmosphere.value)
    return

  const sThree = await loadSThree()

  if (token !== snowInitToken || renderer || !enableAtmosphere.value) {
    return
  }

  ;({ c, animationArray, THREE, scene, renderer } = sThree('#snow', {
    createMesh() {
      generateSeason()
    },
    createCamera() {
      const camera = c('pc')
      camera.position.set(0, 0, 2.5)
      return camera
    },
    animate({ camera, elapsedTime, timestamp }) {
      if (document.hidden || !enableAtmosphere.value)
        return
      if (!geometry || !speeds || !drift || !driftStrengths || !particleScales || !particleAlphas || particleCount <= 0)
        return

      // Throttle the CPU-heavy particle simulation:
      // - run slower when user is idle
      // - respect prefers-reduced-motion / low-power hints
      const now = timestamp || performance.now()
      const idle = now - (lastInteractionTs || now) > 1500
      const baseFps = lowPowerMode.value ? 20 : 30
      const idleFps = lowPowerMode.value ? 12 : baseFps
      const targetFps = reduceMotion.value ? 0 : (idle ? idleFps : baseFps)
      if (targetFps <= 0)
        return

      const interval = 1000 / targetFps
      if (lastSnowUpdateTs && now - lastSnowUpdateTs < interval)
        return

      lastSnowUpdateTs = now

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
  }))
  syncSnowRendererSize()
}
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
  if (!c || !THREE || !scene || !renderer)
    return

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
  if (!renderer)
    return
  generateSeason()
  update()
})

let lastMouseFxTs = 0
let mouseRaf = 0
let pendingMouse: MouseEvent | null = null

onBeforeUnmount(() => {
  cancelHeroIdle?.()
  cancelSeasonIdle?.()
  cancelSnowIdle?.()
  clearDotImageScrollTimer()
  cleanupDotImageScroll?.()
  disposeSnowScene()
  if (isClient && mouseRaf)
    window.cancelAnimationFrame(mouseRaf)
})
const left = ref(0)
const top = ref(0)
// 初始化获取鼠标位置

let dotImage3: any
watch(() => isShow.value, async (newV) => {
  if (!isClient)
    return

  if (newV) {
    const DotImageCanvas = await loadDotImageCanvas()

    if (!isShow.value)
      return

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
    dotImage3?.revert()
  }
})

function flushMouse() {
  if (!isClient)
    return

  mouseRaf = 0
  const e = pendingMouse
  pendingMouse = null
  if (!e)
    return
  if (document.hidden)
    return

  const docEl = document.documentElement
  const w = window.innerWidth || docEl.clientWidth || 1
  const h = window.innerHeight || docEl.clientHeight || 1
  snowPointerX = (e.clientX / w) * 2 - 1
  snowPointerY = (e.clientY / h) * 2 - 1
  if (showPlanet.value) {
    left.value = 200 - (e.clientX / w) * 200
    top.value = 200 - (e.clientY / h) * 200
  }

  const now = performance.now()
  if (!showPlanet.value || now - lastMouseFxTs <= 180)
    return

  lastMouseFxTs = now
  void loadMouseAnimation().then((createMouseAnimation) => {
    createMouseAnimation(e, {
      background: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI1NiAyNTYiPjxnIGZpbGw9IiNjY2NjY2MiPjxwYXRoIGQ9Ik0yMzIgMTA4YTIwIDIwIDAgMSAxLTIwLTIwYTIwIDIwIDAgMCAxIDIwIDIwbS0xNjggMGEyMCAyMCAwIDEgMC0yMCAyMGEyMCAyMCAwIDAgMCAyMC0yMG0yOC0yOGEyMCAyMCAwIDEgMC0yMC0yMGEyMCAyMCAwIDAgMCAyMCAyMG03MiAwYTIwIDIwIDAgMSAwLTIwLTIwYTIwIDIwIDAgMCAwIDIwIDIwbTE5LjI0IDc1Ljg1QTQzLjQ2IDQzLjQ2IDAgMCAxIDE2Mi41NyAxMzBhMzYgMzYgMCAwIDAtNjkuMTQgMGE0My40OSA0My40OSAwIDAgMS0yMC42NyAyNS45YTMyIDMyIDAgMCAwIDI3LjczIDU3LjYyYTcyLjQ5IDcyLjQ5IDAgMCAxIDU1IDBhMzIgMzIgMCAwIDAgMjcuNzMtNTcuNjJaIiBvcGFjaXR5PSIuMiIvPjxwYXRoIGQ9Ik0yMTIgODBhMjggMjggMCAxIDAgMjggMjhhMjggMjggMCAwIDAtMjgtMjhtMCA0MGExMiAxMiAwIDEgMSAxMi0xMmExMiAxMiAwIDAgMS0xMiAxMk03MiAxMDhhMjggMjggMCAxIDAtMjggMjhhMjggMjggMCAwIDAgMjgtMjhtLTI4IDEyYTEyIDEyIDAgMSAxIDEyLTEyYTEyIDEyIDAgMCAxLTEyIDEybTQ4LTMyYTI4IDI4IDAgMSAwLTI4LTI4YTI4IDI4IDAgMCAwIDI4IDI4bTAtNDBhMTIgMTIgMCAxIDEtMTIgMTJhMTIgMTIgMCAwIDEgMTItMTJtNzIgNDBhMjggMjggMCAxIDAtMjgtMjhhMjggMjggMCAwIDAgMjggMjhtMC00MGExMiAxMiAwIDEgMS0xMiAxMmExMiAxMiAwIDAgMSAxMi0xMm0yMy4xMiAxMDAuODZhMzUuMyAzNS4zIDAgMCAxLTE2Ljg3LTIxLjE0YTQ0IDQ0IDAgMCAwLTg0LjUgMEEzNS4yNSAzNS4yNSAwIDAgMSA2OSAxNDguODJBNDAgNDAgMCAwIDAgODggMjI0YTM5LjQ4IDM5LjQ4IDAgMCAwIDE1LjUyLTMuMTNhNjQuMDkgNjQuMDkgMCAwIDEgNDguODcgMGE0MCA0MCAwIDAgMCAzNC43My03MlpNMTY4IDIwOGEyNCAyNCAwIDAgMS05LjQ1LTEuOTNhODAuMTQgODAuMTQgMCAwIDAtNjEuMTkgMGEyNCAyNCAwIDAgMS0yMC43MS00My4yNmE1MS4yMiA1MS4yMiAwIDAgMCAyNC40Ni0zMC42N2EyOCAyOCAwIDAgMSA1My43OCAwYTUxLjI3IDUxLjI3IDAgMCAwIDI0LjUzIDMwLjcxQTI0IDI0IDAgMCAxIDE2OCAyMDgiLz48L2c+PC9zdmc+) center center no-repeat',
    })
  })
}

onMounted(() => {
  useEventListener(window, 'scroll', handleScroll, { passive: true })
  useEventListener(
    window,
    'mousemove',
    (e: MouseEvent) => {
      lastInteractionTs = performance.now()
      pendingMouse = e
      if (!mouseRaf)
        mouseRaf = window.requestAnimationFrame(flushMouse)
    },
    { passive: true },
  )

  handleScroll()
  lastInteractionTs = performance.now()
  useEventListener(window, 'resize', syncSnowRendererSize, { passive: true })
})
</script>

<template>
  <div v-show="enableAtmosphere" id="snow" fixed w-full h-full z--1 />
  <LazySeasonDecor3D
    v-if="showSeasonDecor && seasonTheme === 'spring'"
    theme="spring"
    :dark="isDark"
    :width="190"
    :height="210"
    class="season-decor spring-decor lt-sm:hidden"
    fixed
    bottom-6
    left-6
    z-0
    pointer-events-none
  />
  <LazySeasonDecor3D
    v-if="showSeasonDecor && seasonTheme === 'summer'"
    theme="summer"
    :dark="isDark"
    :width="190"
    :height="210"
    class="season-decor summer-decor lt-sm:hidden"
    fixed
    bottom-6
    right-6
    z-0
    pointer-events-none
  />
  <LazySeasonDecor3D
    v-if="showSeasonDecor && seasonTheme === 'autumn'"
    theme="autumn"
    :dark="isDark"
    :width="200"
    :height="220"
    class="season-decor autumn-decor lt-sm:hidden"
    fixed
    bottom-6
    right-6
    z-0
    pointer-events-none
  />
  <LazySeasonDecor3D
    v-if="showSeasonDecor && seasonTheme === 'winter'"
    theme="winter"
    variant="snowman"
    :dark="isDark"
    :width="150"
    :height="190"
    class="season-decor winter-decor winter-snowman lt-sm:hidden"
    fixed
    bottom-6
    left-6
    z-0
    pointer-events-none
  />
  <LazySeasonDecor3D
    v-if="showSeasonDecor && seasonTheme === 'winter'"
    theme="winter"
    variant="tree"
    :dark="isDark"
    :width="160"
    :height="200"
    class="season-decor winter-decor winter-tree lt-sm:hidden"
    fixed
    bottom-6
    right-6
    z-0
    pointer-events-none
  />
  <span v-show="imageShow" class="dotImage" fixed top-20 left--80 z--1 />
  <span v-show="imageShow" class="cloth" fixed top-20 right--120 z--1 />
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
  <button
    v-if="!showMusicPlayer"
    type="button"
    :disabled="musicLoading"
    class="music-toggle fixed bottom-28 right-5 z-10 h-10 w-10 flex items-center justify-center rounded-full border border-gray-300 bg-white/80 text-xl text-gray-800 shadow-sm backdrop-blur transition-colors hover:bg-white disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-100 dark:hover:bg-gray-900"
    aria-label="Music"
    title="Music"
    @click="ensureMusicPlayerVisible()"
  >
    <span v-if="!musicLoading" class="i-carbon:music" aria-hidden="true" />
    <span v-else class="i-carbon:circle-dash" aria-hidden="true" />
  </button>
  <!-- <img
    v-if="isShow" animate-tada hover="animate-none"
    fixed bottom-40 right-5 text-3xl src="/backTop.png" alt="backTop" @click="scrollToTop()"
  > -->
  <div
    v-if="showPlanet"
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
  <LazyMusicPlayer v-if="showMusicPlayer && playlistLoaded" :playlist="playlist" />
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
    animation: season-float 4.8s ease-in-out infinite;

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

  .spring-decor {
    animation-duration: 5.8s;
  }

  .summer-decor {
    animation-duration: 4.6s;
    animation-delay: -0.8s;
  }

  .autumn-decor {
    animation-duration: 5.2s;
    animation-delay: -1.5s;
  }

  .winter-snowman {
    animation-duration: 4.9s;
  }

  .winter-tree {
    animation-duration: 5.4s;
  }

  @media (max-width: 900px) {
    .season-decor {
      opacity: 0.98;
      filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.2));
    }
  }

  @keyframes season-float {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(-1deg);
    }

    50% {
      transform: translate3d(0, -14px, 0) rotate(1deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .planet,
    .ball,
    .season-decor {
      animation: none !important;
      transform: none !important;
    }
  }
</style>
