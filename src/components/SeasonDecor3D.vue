<script setup lang="ts">
import * as THREE from 'three'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type SeasonTheme = 'spring' | 'summer' | 'autumn' | 'winter'
type WinterVariant = 'snowman' | 'tree'

const props = withDefaults(
  defineProps<{
    theme: SeasonTheme
    variant?: WinterVariant
    width?: number
    height?: number
    dark?: boolean
  }>(),
  {
    variant: 'snowman',
    width: 190,
    height: 210,
    dark: false,
  },
)

const container = ref<HTMLDivElement | null>(null)
const isReady = ref(false)
const isVisible = ref(true)

let renderer: THREE.WebGLRenderer | undefined
let scene: THREE.Scene | undefined
let camera: THREE.PerspectiveCamera | undefined
let hemiLight: THREE.HemisphereLight | undefined
let dirLight: THREE.DirectionalLight | undefined
let fillLight: THREE.PointLight | undefined
let rafId = 0
let resizeObserver: ResizeObserver | undefined
let intersectionObserver: IntersectionObserver | undefined
let visibilityHandler: (() => void) | undefined

interface BuildResult {
  root: THREE.Object3D
  tick?: (dt: number, t: number) => void
  materials?: THREE.Material[]
  textures?: THREE.Texture[]
}

let build: BuildResult | undefined
let lastT = 0
let lastFrameTs = 0

const reduceMotion = computed(() => {
  if (typeof window === 'undefined')
    return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
})

const lowPower = computed(() => {
  if (typeof navigator === 'undefined')
    return true
  const saveData = (navigator as any).connection?.saveData ?? false
  const cores = navigator.hardwareConcurrency ?? 8
  return saveData || cores <= 4
})

const targetFps = computed(() => {
  if (reduceMotion.value)
    return 0
  // Decorative only: keep it smooth, but prioritize low CPU/battery.
  if (lowPower.value)
    return 24
  return 30
})

function cssVar(name: string, fallback: string) {
  const el = container.value
  if (!el || typeof window === 'undefined')
    return fallback
  const v = window.getComputedStyle(el).getPropertyValue(name).trim()
  return v || fallback
}

function normalizeThreeColorInput(value: string) {
  const v = value.trim()
  const rgba = v.match(/^rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*[\d.]+\s*\)$/i)
  if (rgba)
    return `rgb(${rgba[1]}, ${rgba[2]}, ${rgba[3]})`

  const hsla = v.match(/^hsla\(\s*([\d.]+)(deg)?\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*,\s*[\d.]+\s*\)$/i)
  if (hsla)
    return `hsl(${hsla[1]}${hsla[2] ?? ''}, ${hsla[3]}%, ${hsla[4]}%)`

  const hex8 = v.match(/^#([0-9a-f]{8})$/i)
  if (hex8)
    return `#${hex8[1].slice(0, 6)}`

  return v
}

function cssColor(name: string, fallback: string) {
  return new THREE.Color(normalizeThreeColorInput(cssVar(name, fallback)))
}

function makeCanvasTexture(draw: (ctx: CanvasRenderingContext2D, size: number) => void, size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, size, size)
  draw(ctx, size)
  const tex = new THREE.CanvasTexture(canvas)
  // three r142
  ;(tex as any).encoding = (THREE as any).sRGBEncoding ?? undefined
  tex.anisotropy = 4
  tex.needsUpdate = true
  return tex
}

function mergeIndexedGeometries(geometries: THREE.BufferGeometry[]) {
  const keys = ['position', 'normal', 'uv'] as const
  const totalVerts = geometries.reduce((acc, g) => acc + (g.getAttribute('position')?.count ?? 0), 0)
  const totalIndices = geometries.reduce((acc, g) => acc + (g.index?.count ?? 0), 0)
  if (!totalVerts || !totalIndices)
    throw new Error('mergeIndexedGeometries: empty geometry')

  const merged = new THREE.BufferGeometry()

  for (const k of keys) {
    const first = geometries[0].getAttribute(k) as THREE.BufferAttribute | undefined
    if (!first)
      continue
    const itemSize = first.itemSize
    const ArrayType = (first.array as any).constructor as typeof Float32Array
    const out = new ArrayType(totalVerts * itemSize)
    let offset = 0
    for (const g of geometries) {
      const attr = g.getAttribute(k) as THREE.BufferAttribute | undefined
      if (!attr)
        continue
      out.set(attr.array as any, offset)
      offset += attr.array.length
    }
    merged.setAttribute(k, new THREE.BufferAttribute(out, itemSize))
  }

  const indexOut = totalVerts > 65535 ? new Uint32Array(totalIndices) : new Uint16Array(totalIndices)
  let indexOffset = 0
  let vertOffset = 0
  for (const g of geometries) {
    const idx = g.index!
    for (let i = 0; i < idx.count; i++)
      indexOut[indexOffset + i] = (idx.array as any)[i] + vertOffset
    indexOffset += idx.count
    vertOffset += (g.getAttribute('position') as THREE.BufferAttribute).count
  }
  merged.setIndex(new THREE.BufferAttribute(indexOut, 1))
  merged.computeBoundingSphere()
  merged.computeBoundingBox()
  return merged
}

function fillIdentityInstanceMatrices(mesh: THREE.InstancedMesh) {
  const m = new THREE.Matrix4()
  for (let i = 0; i < mesh.count; i++)
    mesh.setMatrixAt(i, m)
  mesh.instanceMatrix.needsUpdate = true
}

function patchInstancedTransformMaterial(
  material: THREE.Material,
  opts: {
    cacheKey: string
    beginVertex: string
    hasNormal: boolean
    beginNormal?: string
    extraUniforms?: Record<string, any>
    replaceProjectVertex?: string
  },
) {
  const anyMat: any = material
  anyMat.onBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = { value: 0 }
    if (opts.extraUniforms) {
      for (const [k, v] of Object.entries(opts.extraUniforms))
        shader.uniforms[k] = v
    }

    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `#include <common>
uniform float uTime;
attribute vec3 iBasePos;
attribute vec4 iQuat;
attribute vec3 iAxis;
attribute float iPhase;
attribute float iAmp;
attribute float iRoll;
attribute float iLen;
attribute float iPappusRoll;
attribute float iPappusScale;
attribute float iAcheneScale;

vec4 quatAxisAngle(vec3 axis, float angle) {
  axis = normalize(axis);
  float s = sin(angle * 0.5);
  return vec4(axis * s, cos(angle * 0.5));
}

vec4 quatMul(vec4 a, vec4 b) {
  return vec4(
    a.w * b.xyz + b.w * a.xyz + cross(a.xyz, b.xyz),
    a.w * b.w - dot(a.xyz, b.xyz)
  );
}

vec3 quatRotate(vec4 q, vec3 v) {
  return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

vec4 getInstanceQuat(float t) {
  float wobble = sin(t * 0.9 + iPhase) * iAmp;
  vec4 qW = quatAxisAngle(iAxis, wobble);
  vec4 q = quatMul(qW, iQuat);
  vec4 qR = quatAxisAngle(vec3(0.0, 1.0, 0.0), iRoll);
  return quatMul(q, qR);
}
`,
    )

    if (opts.hasNormal) {
      const beginNormal = opts.beginNormal ?? `vec3 objectNormal = vec3( normal );
vec4 qInstN = getInstanceQuat(uTime);
objectNormal = normalize(quatRotate(qInstN, objectNormal));`
      shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        beginNormal,
      )
    }

    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', opts.beginVertex)

    if (opts.replaceProjectVertex) {
      shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', opts.replaceProjectVertex)
    }

    anyMat.userData.shader = shader
  }
  anyMat.customProgramCacheKey = () => opts.cacheKey
}

function createPetalTexture() {
  return makeCanvasTexture((ctx, size) => {
    const g = ctx.createRadialGradient(size * 0.45, size * 0.45, size * 0.05, size * 0.5, size * 0.55, size * 0.55)
    g.addColorStop(0, 'rgba(255,255,255,0.95)')
    g.addColorStop(0.35, 'rgba(255,210,226,0.92)')
    g.addColorStop(0.85, 'rgba(255,150,198,0.88)')
    g.addColorStop(1, 'rgba(255,150,198,0.0)')

    ctx.save()
    ctx.translate(size / 2, size / 2)
    ctx.rotate(-0.25)

    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(0, -size * 0.28)
    ctx.bezierCurveTo(size * 0.24, -size * 0.2, size * 0.24, size * 0.1, 0, size * 0.28)
    ctx.bezierCurveTo(-size * 0.24, size * 0.1, -size * 0.24, -size * 0.2, 0, -size * 0.28)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.lineWidth = Math.max(1, size * 0.008)
    ctx.stroke()
    ctx.restore()
  }, 256)
}

function createSakuraPetalTexture() {
  return makeCanvasTexture((ctx, size) => {
    const cx = size / 2
    const cy = size / 2

    // Petal silhouette with a small notch near the tip
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(-0.15)

    const w = size * 0.46
    const h = size * 0.56
    const notch = size * 0.06

    ctx.beginPath()
    ctx.moveTo(0, -h * 0.55)
    ctx.bezierCurveTo(w * 0.5, -h * 0.45, w * 0.55, -h * 0.05, w * 0.25, h * 0.35)
    ctx.bezierCurveTo(w * 0.1, h * 0.55, 0, h * 0.6, 0, h * 0.6)
    ctx.bezierCurveTo(0, h * 0.6, -w * 0.1, h * 0.55, -w * 0.25, h * 0.35)
    ctx.bezierCurveTo(-w * 0.55, -h * 0.05, -w * 0.5, -h * 0.45, 0, -h * 0.55)
    ctx.closePath()

    // Carve the notch
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(0, -h * 0.52, notch, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Soft pink gradient
    const g = ctx.createRadialGradient(-w * 0.1, -h * 0.25, size * 0.02, 0, h * 0.1, h * 0.85)
    g.addColorStop(0, 'rgba(255,255,255,0.98)')
    g.addColorStop(0.25, 'rgba(255,224,236,0.96)')
    g.addColorStop(0.75, 'rgba(255,164,206,0.92)')
    g.addColorStop(1, 'rgba(255,164,206,0.0)')

    ctx.fillStyle = g
    ctx.fill()

    // subtle outline + highlight vein
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = 'rgba(255,255,255,0.45)'
    ctx.lineWidth = Math.max(1, size * 0.007)
    ctx.stroke()

    ctx.strokeStyle = 'rgba(255,255,255,0.25)'
    ctx.lineWidth = Math.max(1, size * 0.004)
    ctx.beginPath()
    ctx.moveTo(0, -h * 0.45)
    ctx.quadraticCurveTo(-w * 0.06, -h * 0.05, 0, h * 0.5)
    ctx.stroke()

    ctx.restore()
  }, 256)
}

function createDandelionSeedTexture() {
  return makeCanvasTexture((ctx, size) => {
    ctx.save()
    ctx.translate(size / 2, size / 2)

    ctx.strokeStyle = 'rgba(255,255,255,0.75)'
    ctx.lineWidth = Math.max(1, size * 0.006)
    ctx.lineCap = 'round'

    const count = 18
    const r1 = size * 0.12
    const r2 = size * 0.36
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count
      ctx.beginPath()
      ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1)
      ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2)
      ctx.stroke()
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.55)'
    ctx.beginPath()
    ctx.moveTo(0, r1)
    ctx.lineTo(0, size * 0.45)
    ctx.stroke()

    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.05, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }, 256)
}

function createDandelionFluffTexture() {
  return makeCanvasTexture((ctx, size) => {
    const c = size / 2
    ctx.save()
    ctx.translate(c, c)

    // soft core
    const core = ctx.createRadialGradient(0, 0, size * 0.02, 0, 0, size * 0.28)
    core.addColorStop(0, 'rgba(255,255,255,0.85)')
    core.addColorStop(0.45, 'rgba(255,255,255,0.25)')
    core.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = core
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2)
    ctx.fill()

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = 'rgba(255,255,255,0.55)'
    ctx.shadowBlur = size * 0.02

    const hairs = 120
    const r0 = size * 0.06
    for (let i = 0; i < hairs; i++) {
      const a = (Math.random() * Math.PI * 2)
      const len = size * (0.22 + Math.random() * 0.28)
      const wobble = (Math.random() - 0.5) * 0.18
      const width = Math.max(1, size * (0.0028 + Math.random() * 0.0012))
      const alpha = 0.12 + Math.random() * 0.18

      ctx.strokeStyle = `rgba(255,255,255,${alpha})`
      ctx.lineWidth = width

      const x0 = Math.cos(a) * r0
      const y0 = Math.sin(a) * r0
      const x1 = Math.cos(a + wobble) * len
      const y1 = Math.sin(a + wobble) * len
      const cx1 = Math.cos(a + wobble * 0.55) * (len * 0.55)
      const cy1 = Math.sin(a + wobble * 0.55) * (len * 0.55)

      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.quadraticCurveTo(cx1, cy1, x1, y1)
      ctx.stroke()

      // tip highlight
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`
      ctx.beginPath()
      ctx.arc(x1, y1, width * 0.9, 0, Math.PI * 2)
      ctx.fill()
    }

    // extra subtle haze
    const haze = ctx.createRadialGradient(0, 0, size * 0.05, 0, 0, size * 0.42)
    haze.addColorStop(0, 'rgba(255,255,255,0.10)')
    haze.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = haze
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.42, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }, 256)
}

function createDandelionPappusTexture() {
  return makeCanvasTexture((ctx, size) => {
    const c = size / 2
    ctx.save()
    ctx.translate(c, c)

    ctx.clearRect(-c, -c, size, size)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = 'rgba(255,255,255,0.75)'
    ctx.shadowBlur = size * 0.02

    const core = ctx.createRadialGradient(0, 0, size * 0.02, 0, 0, size * 0.22)
    core.addColorStop(0, 'rgba(255,255,255,0.9)')
    core.addColorStop(0.35, 'rgba(255,255,255,0.35)')
    core.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = core
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.22, 0, Math.PI * 2)
    ctx.fill()

    const hairs = 120
    const r0 = size * 0.04
    for (let i = 0; i < hairs; i++) {
      const a = (i / hairs) * Math.PI * 2 + (Math.random() - 0.5) * 0.06
      const len = size * (0.26 + Math.random() * 0.18)
      const bend = (Math.random() - 0.5) * 0.22

      const x0 = Math.cos(a) * r0
      const y0 = Math.sin(a) * r0
      const x1 = Math.cos(a + bend) * len
      const y1 = Math.sin(a + bend) * len
      const cx = Math.cos(a + bend * 0.55) * (len * 0.55)
      const cy = Math.sin(a + bend * 0.55) * (len * 0.55)

      ctx.strokeStyle = 'rgba(255,255,255,0.95)'
      ctx.lineWidth = Math.max(1, size * (0.0032 + Math.random() * 0.0009))
      ctx.beginPath()
      ctx.moveTo(x0, y0)
      ctx.quadraticCurveTo(cx, cy, x1, y1)
      ctx.stroke()
    }

    // outer haze to avoid harsh alphaTest edges
    const haze = ctx.createRadialGradient(0, 0, size * 0.12, 0, 0, size * 0.48)
    haze.addColorStop(0, 'rgba(255,255,255,0.12)')
    haze.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = haze
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.48, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }, 512)
}

function createLeafTexture() {
  return makeCanvasTexture((ctx, size) => {
    const grd = ctx.createLinearGradient(0, size * 0.1, size, size * 0.9)
    grd.addColorStop(0, 'rgba(249,115,22,0.98)')
    grd.addColorStop(0.55, 'rgba(245,158,11,0.98)')
    grd.addColorStop(1, 'rgba(239,68,68,0.96)')

    ctx.save()
    ctx.translate(size / 2, size / 2)
    ctx.rotate(-0.35)

    const scale = size * 0.44
    ctx.beginPath()
    // Maple-like silhouette
    ctx.moveTo(0, -1.05 * scale)
    ctx.bezierCurveTo(0.25 * scale, -0.85 * scale, 0.38 * scale, -0.55 * scale, 0.35 * scale, -0.28 * scale)
    ctx.bezierCurveTo(0.65 * scale, -0.35 * scale, 0.85 * scale, -0.15 * scale, 0.6 * scale, 0.05 * scale)
    ctx.bezierCurveTo(0.88 * scale, 0.15 * scale, 0.8 * scale, 0.42 * scale, 0.5 * scale, 0.38 * scale)
    ctx.bezierCurveTo(0.55 * scale, 0.75 * scale, 0.22 * scale, 0.85 * scale, 0.08 * scale, 0.55 * scale)
    ctx.bezierCurveTo(0.02 * scale, 0.95 * scale, -0.02 * scale, 0.95 * scale, -0.08 * scale, 0.55 * scale)
    ctx.bezierCurveTo(-0.22 * scale, 0.85 * scale, -0.55 * scale, 0.75 * scale, -0.5 * scale, 0.38 * scale)
    ctx.bezierCurveTo(-0.8 * scale, 0.42 * scale, -0.88 * scale, 0.15 * scale, -0.6 * scale, 0.05 * scale)
    ctx.bezierCurveTo(-0.85 * scale, -0.15 * scale, -0.65 * scale, -0.35 * scale, -0.35 * scale, -0.28 * scale)
    ctx.bezierCurveTo(-0.38 * scale, -0.55 * scale, -0.25 * scale, -0.85 * scale, 0, -1.05 * scale)
    ctx.closePath()

    ctx.fillStyle = grd
    ctx.fill()

    ctx.strokeStyle = 'rgba(120,53,15,0.35)'
    ctx.lineWidth = Math.max(1, size * 0.006)
    ctx.stroke()

    // veins
    ctx.strokeStyle = 'rgba(120,53,15,0.25)'
    ctx.lineWidth = Math.max(1, size * 0.004)
    ctx.beginPath()
    ctx.moveTo(0, -0.9 * scale)
    ctx.lineTo(0, 0.78 * scale)
    ctx.stroke()
    for (const sign of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(0, -0.25 * scale)
      ctx.quadraticCurveTo(sign * 0.25 * scale, -0.12 * scale, sign * 0.55 * scale, 0.1 * scale)
      ctx.stroke()
    }

    ctx.restore()
  }, 256)
}

function createSnowBumpTexture() {
  return makeCanvasTexture((ctx, size) => {
    const img = ctx.createImageData(size, size)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 210 + Math.floor(Math.random() * 45)
      img.data[i + 0] = v
      img.data[i + 1] = v
      img.data[i + 2] = v
      img.data[i + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
    ctx.globalAlpha = 0.35
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const r = 2 + Math.random() * 10
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }, 256)
}

function createDandelionReceptacleTextures() {
  const bump = makeCanvasTexture((ctx, size) => {
    // grayscale bump with lots of tiny dimples
    ctx.fillStyle = 'rgb(128,128,128)'
    ctx.fillRect(0, 0, size, size)

    const count = 520
    for (let i = 0; i < count; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const r = 2 + Math.random() * 5
      const g = ctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, 'rgba(90,90,90,1)')
      g.addColorStop(0.45, 'rgba(130,130,130,1)')
      g.addColorStop(1, 'rgba(128,128,128,1)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }, 256)

  const color = makeCanvasTexture((ctx, size) => {
    const g = ctx.createRadialGradient(size * 0.45, size * 0.42, size * 0.05, size * 0.5, size * 0.5, size * 0.6)
    g.addColorStop(0, 'rgba(245,245,245,1)')
    g.addColorStop(0.35, 'rgba(233,226,212,1)')
    g.addColorStop(1, 'rgba(198,186,166,1)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)

    ctx.globalAlpha = 0.18
    ctx.fillStyle = '#000'
    for (let i = 0; i < 220; i++) {
      const x = Math.random() * size
      const y = Math.random() * size
      const r = 0.6 + Math.random() * 1.5
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }, 256)

  return { bump, color }
}

function createAcheneTexture() {
  return makeCanvasTexture((ctx, size) => {
    const g = ctx.createLinearGradient(0, 0, 0, size)
    g.addColorStop(0, 'rgba(200,160,110,1)')
    g.addColorStop(0.25, 'rgba(220,185,130,1)')
    g.addColorStop(0.6, 'rgba(195,150,95,1)')
    g.addColorStop(1, 'rgba(130,90,55,1)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)

    // subtle fibrous noise
    ctx.globalAlpha = 0.12
    ctx.strokeStyle = 'rgba(255,255,255,1)'
    for (let i = 0; i < 220; i++) {
      const y = Math.random() * size
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(Math.random() * size, y)
      ctx.lineTo(Math.random() * size, y + (Math.random() - 0.5) * 10)
      ctx.stroke()
    }
    ctx.globalAlpha = 1

    // darker tip
    const tip = ctx.createRadialGradient(size * 0.5, size * 0.92, 0, size * 0.5, size * 0.92, size * 0.25)
    tip.addColorStop(0, 'rgba(60,35,20,0.85)')
    tip.addColorStop(1, 'rgba(60,35,20,0)')
    ctx.fillStyle = tip
    ctx.fillRect(0, 0, size, size)
  }, 256)
}

function createKnitScarfTexture() {
  return makeCanvasTexture((ctx, size) => {
    // base fabric
    ctx.fillStyle = 'rgb(239,68,68)'
    ctx.fillRect(0, 0, size, size)

    // subtle weave
    ctx.globalAlpha = 0.12
    ctx.fillStyle = '#000'
    for (let y = 0; y < size; y += 6) {
      for (let x = 0; x < size; x += 6) {
        if ((x + y) % 12 === 0)
          ctx.fillRect(x, y, 2, 2)
      }
    }
    ctx.globalAlpha = 1

    // zig-zag pattern
    ctx.strokeStyle = 'rgba(34,197,94,0.85)'
    ctx.lineWidth = Math.max(2, size * 0.018)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const rows = 6
    const amp = size * 0.08
    const stepX = size / 6
    const rowH = size / rows
    for (let r = 0; r < rows; r++) {
      const y0 = r * rowH + rowH * 0.55
      ctx.beginPath()
      for (let i = -1; i <= 7; i++) {
        const x = i * stepX
        const up = i % 2 === 0
        ctx.lineTo(x, y0 + (up ? -amp : amp))
      }
      ctx.stroke()
    }

    // stitched edge
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.lineWidth = Math.max(1, size * 0.01)
    ctx.beginPath()
    ctx.moveTo(0, size * 0.12)
    ctx.lineTo(size, size * 0.12)
    ctx.moveTo(0, size * 0.88)
    ctx.lineTo(size, size * 0.88)
    ctx.stroke()
  }, 256)
}

function disposeSceneObject(obj: THREE.Object3D) {
  obj.traverse((child: any) => {
    const geometry: THREE.BufferGeometry | undefined = child.geometry
    const material: THREE.Material | THREE.Material[] | undefined = child.material
    geometry?.dispose?.()
    if (material) {
      if (Array.isArray(material))
        material.forEach(m => m.dispose?.())
      else
        material.dispose?.()
    }
  })
}

function applyMaterialColors(materials: THREE.Material[]) {
  for (const m of materials) {
    const anyM: any = m
    if (anyM.userData?.cssColorVar && anyM.color) {
      anyM.color.set(cssVar(anyM.userData.cssColorVar, anyM.color.getStyle()))
    }
    if (anyM.userData?.cssEmissiveVar && anyM.emissive) {
      anyM.emissive.set(cssVar(anyM.userData.cssEmissiveVar, anyM.emissive.getStyle()))
    }
  }
}

function springBuild(): BuildResult {
  const root = new THREE.Group()

  const trunk = cssColor('--spring-trunk', '#7a3f17')
  const blossom1 = cssColor('--spring-blossom-1', '#ffc0cb')
  const blossom2 = cssColor('--spring-blossom-2', '#ff99cc')
  const petal = cssColor('--spring-petal', '#ffeff7')

  const mats: THREE.Material[] = []
  const texs: THREE.Texture[] = []

  const branchMat = new THREE.MeshStandardMaterial({ color: trunk, roughness: 0.95, metalness: 0 })
  ;(branchMat as any).userData = { cssColorVar: '--spring-trunk' }
  mats.push(branchMat)

  const curve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-0.5, -0.9, 0.1),
      new THREE.Vector3(-0.15, -0.35, 0.08),
      new THREE.Vector3(0.15, 0.2, 0.02),
      new THREE.Vector3(0.55, 0.72, -0.08),
    ],
    false,
    'catmullrom',
    0.6,
  )
  const branchGeo = new THREE.TubeGeometry(curve, 64, 0.06, 10, false)
  const branch = new THREE.Mesh(branchGeo, branchMat)
  root.add(branch)

  const blossomTex = createSakuraPetalTexture()
  texs.push(blossomTex)

  const blossomPetalMat = new THREE.MeshPhysicalMaterial({
    color: blossom1,
    map: blossomTex,
    transparent: true,
    opacity: 0.98,
    roughness: 0.55,
    metalness: 0,
    clearcoat: 0.22,
    clearcoatRoughness: 0.72,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  ;(blossomPetalMat as any).userData = { cssColorVar: '--spring-blossom-1' }
  mats.push(blossomPetalMat)

  const blossomPetalMat2 = new THREE.MeshPhysicalMaterial({
    color: blossom2,
    map: blossomTex,
    transparent: true,
    opacity: 0.98,
    roughness: 0.55,
    metalness: 0,
    clearcoat: 0.22,
    clearcoatRoughness: 0.72,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  ;(blossomPetalMat2 as any).userData = { cssColorVar: '--spring-blossom-2' }
  mats.push(blossomPetalMat2)

  const stamenMat = new THREE.MeshStandardMaterial({
    color: '#FBBF24',
    emissive: '#F59E0B',
    emissiveIntensity: 0.18,
    roughness: 0.55,
    metalness: 0,
  })
  mats.push(stamenMat)

  const blossomPetalGeo = new THREE.PlaneGeometry(0.22, 0.28, 8, 10)
  const posAttr = blossomPetalGeo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i)
    const y = posAttr.getY(i)
    const xT = x / 0.11
    const yT = y / 0.14
    const cup = Math.sin(xT * Math.PI * 0.5) * 0.035
    const curl = Math.max(0, yT) * 0.025
    posAttr.setZ(i, cup + curl)
  }
  posAttr.needsUpdate = true
  blossomPetalGeo.computeVertexNormals()
  // Pivot at petal base for nicer rotations
  blossomPetalGeo.translate(0, 0.07, 0)

  const centerGeo = new THREE.SphereGeometry(0.04, 12, 12)

  function createSakuraFlower(material: THREE.Material) {
    const g = new THREE.Group()
    const petals = 5
    for (let i = 0; i < petals; i++) {
      const a = (Math.PI * 2 * i) / petals
      const petalMesh = new THREE.Mesh(blossomPetalGeo, material)
      petalMesh.rotation.z = a + (Math.random() - 0.5) * 0.12
      petalMesh.rotation.x = 0.25 + Math.random() * 0.25
      petalMesh.rotation.y = (Math.random() - 0.5) * 0.25
      petalMesh.position.set(Math.cos(a) * 0.01, Math.sin(a) * 0.01, (Math.random() - 0.5) * 0.01)
      g.add(petalMesh)
    }

    const center = new THREE.Mesh(centerGeo, stamenMat)
    center.position.set(0, 0.04, 0.02)
    g.add(center)

    // a few small stamens
    const filamentGeo = new THREE.CylinderGeometry(0.004, 0.003, 0.08, 8)
    const filamentCount = 10
    const filaments = new THREE.InstancedMesh(filamentGeo, stamenMat, filamentCount)
    const m4 = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const v = new THREE.Vector3()
    const s = new THREE.Vector3()
    for (let i = 0; i < filamentCount; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 0.025 + Math.random() * 0.02
      v.set(Math.cos(a) * r, 0.045 + Math.random() * 0.02, Math.sin(a) * r)
      e.set((Math.random() - 0.5) * 0.7, 0, (Math.random() - 0.5) * 0.7)
      q.setFromEuler(e)
      s.set(1, 1, 1)
      m4.compose(v, q, s)
      filaments.setMatrixAt(i, m4)
    }
    filaments.instanceMatrix.needsUpdate = true
    g.add(filaments)

    return g
  }

  const flowerA = createSakuraFlower(blossomPetalMat)
  const flowerB = createSakuraFlower(blossomPetalMat2)

  const blossomCount = 14
  const up = new THREE.Vector3(0, 1, 0)
  for (let i = 0; i < blossomCount; i++) {
    // Bias blossoms towards the upper part of the branch
    const tt = i / Math.max(1, blossomCount - 1)
    const t = 0.18 + (tt ** 0.7) * 0.78 + (Math.random() - 0.5) * 0.06

    const p = curve.getPointAt(Math.min(0.98, Math.max(0.02, t)))
    const tangent = curve.getTangentAt(Math.min(0.98, Math.max(0.02, t))).normalize()
    const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 0, 1))
    if (normal.lengthSq() < 1e-6)
      normal.copy(up)
    normal.normalize()
    const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize()

    const flower = (Math.random() < 0.55 ? flowerA : flowerB).clone(true)
    const out = normal.clone().addScaledVector(binormal, (Math.random() - 0.5) * 0.65).normalize()
    flower.quaternion.setFromUnitVectors(up, out)
    flower.rotateOnAxis(out, (Math.random() - 0.5) * 0.6)

    flower.position.copy(p)
      .addScaledVector(out, 0.09 + Math.random() * 0.06)
      .add(new THREE.Vector3((Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.05, (Math.random() - 0.5) * 0.04))

    const scale = 0.85 + Math.random() * 0.55
    flower.scale.setScalar(scale)
    root.add(flower)
  }

  const petalTex = createPetalTexture()
  texs.push(petalTex)
  const petalMat = new THREE.MeshStandardMaterial({
    color: petal,
    map: petalTex,
    transparent: true,
    opacity: 0.95,
    roughness: 0.8,
    metalness: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  ;(petalMat as any).userData = { cssColorVar: '--spring-petal' }
  mats.push(petalMat)

  const petalGeo = new THREE.PlaneGeometry(0.22, 0.22)
  const petalsCount = 70
  const petals = new THREE.InstancedMesh(petalGeo, petalMat, petalsCount)
  const pPos = new Array(petalsCount).fill(0).map(() => ({
    x: (Math.random() - 0.5) * 1.7,
    y: -0.2 + Math.random() * 1.6,
    z: (Math.random() - 0.5) * 0.6,
    s: 0.55 + Math.random() * 0.9,
    vy: 0.15 + Math.random() * 0.35,
    vx: (Math.random() - 0.5) * 0.15,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 1.4,
  }))
  const mat4 = new THREE.Matrix4()
  const quat = new THREE.Quaternion()
  const euler = new THREE.Euler()
  const pos = new THREE.Vector3()
  const scl = new THREE.Vector3()
  function writePetals() {
    for (let i = 0; i < petalsCount; i++) {
      const p = pPos[i]
      pos.set(p.x, p.y, p.z)
      euler.set(0, 0, p.rot)
      quat.setFromEuler(euler)
      scl.set(p.s, p.s, p.s)
      mat4.compose(pos, quat, scl)
      petals.setMatrixAt(i, mat4)
    }
    petals.instanceMatrix.needsUpdate = true
  }
  writePetals()
  root.add(petals)

  root.position.set(0, -0.08, 0)
  root.scale.setScalar(1.05)

  let sway = Math.random() * Math.PI * 2
  const tick = (dt: number, t: number) => {
    sway += dt
    root.rotation.z = Math.sin(sway * 0.55) * 0.06
    root.rotation.x = Math.sin(sway * 0.35) * 0.03

    for (let i = 0; i < petalsCount; i++) {
      const p = pPos[i]
      p.y -= p.vy * dt
      p.x += (p.vx + Math.sin(t * 0.9 + p.z * 2) * 0.04) * dt
      p.rot += p.vr * dt
      if (p.y < -1.05) {
        p.y = 0.95 + Math.random() * 0.7
        p.x = (Math.random() - 0.5) * 1.7
        p.z = (Math.random() - 0.5) * 0.6
        p.s = 0.55 + Math.random() * 0.9
        p.vy = 0.15 + Math.random() * 0.35
        p.vx = (Math.random() - 0.5) * 0.15
        p.vr = (Math.random() - 0.5) * 1.4
      }
    }
    writePetals()
  }

  return { root, tick, materials: mats, textures: texs }
}

function summerBuild(): BuildResult {
  const root = new THREE.Group()

  const stemColor = cssColor('--summer-stem', '#3a9b55')
  const headColor = cssColor('--summer-head', '#cbd5e1')
  const seedColor = cssColor('--summer-seed', '#ffffff')

  const mats: THREE.Material[] = []
  const texs: THREE.Texture[] = []

  const stemMat = new THREE.MeshStandardMaterial({ color: stemColor, roughness: 0.9, metalness: 0 })
  ;(stemMat as any).userData = { cssColorVar: '--summer-stem' }
  mats.push(stemMat)

  const stemCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-0.55, -0.95, 0.08),
      new THREE.Vector3(-0.35, -0.35, 0.04),
      new THREE.Vector3(-0.08, 0.25, 0.01),
      new THREE.Vector3(0.18, 0.78, 0),
    ],
    false,
    'catmullrom',
    0.65,
  )
  const stemGeo = new THREE.TubeGeometry(stemCurve, 100, 0.045, 12, false)
  const stem = new THREE.Mesh(stemGeo, stemMat)
  root.add(stem)

  const headPos = stemCurve.getPointAt(1).clone()

  const headMat = new THREE.MeshPhysicalMaterial({
    color: headColor,
    roughness: 0.65,
    metalness: 0,
    clearcoat: 0.08,
    clearcoatRoughness: 0.85,
  })
  ;(headMat as any).userData = { cssColorVar: '--summer-head' }
  mats.push(headMat)

  // Seed head / receptacle: add subtle dimples so it reads more photographic
  const { bump: receptacleBump, color: receptacleColor } = createDandelionReceptacleTextures()
  texs.push(receptacleBump, receptacleColor)
  headMat.map = receptacleColor
  headMat.bumpMap = receptacleBump
  headMat.bumpScale = 0.08

  const headGeo = new THREE.SphereGeometry(0.1, 20, 20)
  const head = new THREE.Mesh(headGeo, headMat)
  head.position.copy(headPos)
  root.add(head)

  // small green calyx to visually connect head + stem
  const calyxMat = new THREE.MeshStandardMaterial({
    color: stemColor.clone().multiplyScalar(0.9),
    roughness: 0.9,
    metalness: 0,
  })
  ;(calyxMat as any).userData = { cssColorVar: '--summer-stem' }
  mats.push(calyxMat)
  const calyx = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.08, 16, 1, true), calyxMat)
  calyx.position.copy(headPos).add(new THREE.Vector3(0, -0.1, 0))
  calyx.rotation.x = Math.PI
  root.add(calyx)

  const vUp = new THREE.Vector3(0, 1, 0)
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const q2 = new THREE.Quaternion()
  const e = new THREE.Euler()
  const v = new THREE.Vector3()
  const v2 = new THREE.Vector3()
  const sc = new THREE.Vector3()

  // A dense puff: instanced seed stems + instanced pappus sprites (billboarded toward the camera).
  const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1
  const puffCount = dpr >= 2 ? 170 : 220

  const stalkMat = new THREE.MeshStandardMaterial({
    color: seedColor,
    roughness: 0.95,
    metalness: 0,
    emissive: seedColor.clone(),
    emissiveIntensity: 0.02,
  })
  ;(stalkMat as any).userData = { cssColorVar: '--summer-seed' }
  mats.push(stalkMat)

  const stalkGeo = new THREE.CylinderGeometry(0.005, 0.0025, 1, 7, 12, true)
  // Base at y=0
  stalkGeo.translate(0, 0.5, 0)
  // Subtle built-in bend (rotated per instance) so it never looks like "needles"
  const stalkPos = stalkGeo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < stalkPos.count; i++) {
    const y = stalkPos.getY(i)
    const bend = (y * y) * 0.06
    stalkPos.setX(i, stalkPos.getX(i) + bend)
  }
  stalkPos.needsUpdate = true
  stalkGeo.computeVertexNormals()

  const stalks = new THREE.InstancedMesh(stalkGeo, stalkMat, puffCount)
  stalks.instanceMatrix.setUsage(THREE.StaticDrawUsage)
  stalks.frustumCulled = false
  root.add(stalks)

  const pappusTex = createDandelionPappusTexture()
  texs.push(pappusTex)
  const pappusMat = new THREE.MeshStandardMaterial({
    color: seedColor,
    map: pappusTex,
    alphaTest: 0.08,
    transparent: false,
    side: THREE.DoubleSide,
    roughness: 0.95,
    metalness: 0,
    emissive: seedColor.clone(),
    emissiveIntensity: 0.06,
  })
  ;(pappusMat as any).userData = { cssColorVar: '--summer-seed' }
  mats.push(pappusMat)

  const p0 = new THREE.PlaneGeometry(0.2, 0.2)
  const p1 = p0.clone()
  p1.rotateY(Math.PI / 2)
  const pappusGeo = mergeIndexedGeometries([p0, p1])
  p0.dispose()
  p1.dispose()

  const pappus = new THREE.InstancedMesh(pappusGeo, pappusMat, puffCount)
  pappus.instanceMatrix.setUsage(THREE.StaticDrawUsage)
  pappus.frustumCulled = false
  root.add(pappus)

  // Achene (seed body) for photo-level realism
  const acheneTex = createAcheneTexture()
  texs.push(acheneTex)
  const acheneMat = new THREE.MeshPhysicalMaterial({
    color: '#FFFFFF',
    map: acheneTex,
    roughness: 0.65,
    metalness: 0,
    clearcoat: 0.12,
    clearcoatRoughness: 0.8,
  })
  mats.push(acheneMat)
  const acheneGeo = (THREE as any).CapsuleGeometry
    ? new (THREE as any).CapsuleGeometry(0.017, 0.045, 4, 10)
    : new THREE.CylinderGeometry(0.017, 0.012, 0.08, 12, 1, false)
  ;(acheneGeo as any).translate?.(0, 0.04, 0)
  const achenes = new THREE.InstancedMesh(acheneGeo as any, acheneMat, puffCount)
  achenes.instanceMatrix.setUsage(THREE.StaticDrawUsage)
  achenes.frustumCulled = false
  root.add(achenes)

  // Soft volumetric haze (small count, transparent) to remove CG sharpness without killing performance.
  const hazeTex = createDandelionFluffTexture()
  texs.push(hazeTex)
  const hazeMat = new THREE.MeshStandardMaterial({
    color: seedColor,
    map: hazeTex,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    side: THREE.DoubleSide,
    roughness: 1,
    metalness: 0,
    emissive: seedColor.clone(),
    emissiveIntensity: 0.02,
  })
  ;(hazeMat as any).userData = { cssColorVar: '--summer-seed' }
  mats.push(hazeMat)
  const hazeGeo = new THREE.PlaneGeometry(0.36, 0.36)
  const hazeCount = 26
  const haze = new THREE.InstancedMesh(hazeGeo, hazeMat, hazeCount)
  haze.instanceMatrix.setUsage(THREE.StaticDrawUsage)
  root.add(haze)

  const baseRots = new Array<THREE.Quaternion>(puffCount)
  const basePos = new Array<THREE.Vector3>(puffCount)
  const wobbleAxes = new Array<THREE.Vector3>(puffCount)
  const lengths = new Float32Array(puffCount)
  const rolls = new Float32Array(puffCount)
  const phases = new Float32Array(puffCount)
  const amps = new Float32Array(puffCount)
  const pappusRoll = new Float32Array(puffCount)
  const pappusScale = new Float32Array(puffCount)
  const acheneScale = new Float32Array(puffCount)

  const golden = Math.PI * (3 - Math.sqrt(5))
  const headRadius = 0.105
  const wind = new THREE.Vector3(1, 0.25, 0.18).normalize()

  for (let i = 0; i < puffCount; i++) {
    // Fibonacci sphere distribution with slight upward bias
    const y = 1 - (i / Math.max(1, puffCount - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    const dir = new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r)
    dir.y = dir.y * 0.82 + 0.22
    dir.add(new THREE.Vector3((Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.06, (Math.random() - 0.5) * 0.08))
    dir.normalize()

    baseRots[i] = new THREE.Quaternion().setFromUnitVectors(vUp, dir)
    basePos[i] = headPos.clone().addScaledVector(dir, headRadius)
    const wobbleAxis = new THREE.Vector3().crossVectors(dir, wind)
    if (wobbleAxis.lengthSq() < 1e-6)
      wobbleAxis.set(1, 0, 0)
    wobbleAxis.normalize()
    wobbleAxes[i] = wobbleAxis

    lengths[i] = 0.12 + Math.random() * 0.11
    rolls[i] = Math.random() * Math.PI * 2
    phases[i] = Math.random() * Math.PI * 2
    amps[i] = 0.06 + Math.random() * 0.12
    pappusRoll[i] = Math.random() * Math.PI * 2
    pappusScale[i] = 0.75 + Math.random() * 0.35
    acheneScale[i] = 0.85 + Math.random() * 0.4
  }

  // haze placement (only once)
  for (let i = 0; i < hazeCount; i++) {
    const u = Math.random()
    const v0 = Math.random()
    const theta = 2 * Math.PI * u
    const y = (v0 * 2 - 1) * 0.9
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    v.set(Math.cos(theta) * r, y, Math.sin(theta) * r).normalize()
    v2.copy(headPos).addScaledVector(v, 0.26 + Math.random() * 0.12)
    q.copy(camera?.quaternion ?? new THREE.Quaternion())
    e.set(0, 0, Math.random() * Math.PI * 2)
    q2.setFromEuler(e)
    q.multiply(q2)
    sc.setScalar(0.65 + Math.random() * 0.55)
    m4.compose(v2, q, sc)
    haze.setMatrixAt(i, m4)
  }
  haze.instanceMatrix.needsUpdate = true
  // GPU-driven puff: instance matrices stay identity, per-instance motion runs in the vertex shader.
  // This removes the heaviest per-frame CPU loops (setMatrixAt for hundreds of instances).
  const iBasePos = new THREE.InstancedBufferAttribute(new Float32Array(puffCount * 3), 3)
  const iQuat = new THREE.InstancedBufferAttribute(new Float32Array(puffCount * 4), 4)
  const iAxis = new THREE.InstancedBufferAttribute(new Float32Array(puffCount * 3), 3)
  const iPhase = new THREE.InstancedBufferAttribute(phases, 1)
  const iAmp = new THREE.InstancedBufferAttribute(amps, 1)
  const iRoll = new THREE.InstancedBufferAttribute(rolls, 1)
  const iLen = new THREE.InstancedBufferAttribute(lengths, 1)
  const iPappusRoll = new THREE.InstancedBufferAttribute(pappusRoll, 1)
  const iPappusScale = new THREE.InstancedBufferAttribute(pappusScale, 1)
  const iAcheneScale = new THREE.InstancedBufferAttribute(acheneScale, 1)

  for (let i = 0; i < puffCount; i++) {
    const p = basePos[i]
    iBasePos.setXYZ(i, p.x, p.y, p.z)
    const quat = baseRots[i]
    iQuat.setXYZW(i, quat.x, quat.y, quat.z, quat.w)
    const a = wobbleAxes[i]
    iAxis.setXYZ(i, a.x, a.y, a.z)
  }
  iBasePos.needsUpdate = true
  iQuat.needsUpdate = true
  iAxis.needsUpdate = true

  for (const geo of [stalkGeo, pappusGeo, acheneGeo as any] as THREE.BufferGeometry[]) {
    geo.setAttribute('iBasePos', iBasePos)
    geo.setAttribute('iQuat', iQuat)
    geo.setAttribute('iAxis', iAxis)
    geo.setAttribute('iPhase', iPhase)
    geo.setAttribute('iAmp', iAmp)
    geo.setAttribute('iRoll', iRoll)
    geo.setAttribute('iLen', iLen)
    geo.setAttribute('iPappusRoll', iPappusRoll)
    geo.setAttribute('iPappusScale', iPappusScale)
    geo.setAttribute('iAcheneScale', iAcheneScale)
  }

  fillIdentityInstanceMatrices(stalks)
  fillIdentityInstanceMatrices(pappus)
  fillIdentityInstanceMatrices(achenes)

  patchInstancedTransformMaterial(stalkMat, {
    cacheKey: 'summer-stalks-gpu-v1',
    hasNormal: true,
    beginNormal: `vec3 objectNormal = vec3( normal );
objectNormal.xz /= 0.26;
objectNormal.y /= max(iLen, 0.0001);
objectNormal = normalize(objectNormal);
vec4 qInstN = getInstanceQuat(uTime);
objectNormal = normalize(quatRotate(qInstN, objectNormal));`,
    beginVertex: `vec3 transformed = vec3( position );
transformed.xz *= 0.26;
transformed.y *= iLen;
vec4 qInst = getInstanceQuat(uTime);
transformed = quatRotate(qInst, transformed);
transformed += iBasePos;`,
  })

  patchInstancedTransformMaterial(acheneMat, {
    cacheKey: 'summer-achenes-gpu-v1',
    hasNormal: true,
    beginVertex: `vec3 transformed = vec3( position ) * iAcheneScale;
vec4 qInst = getInstanceQuat(uTime);
transformed = quatRotate(qInst, transformed);
vec3 dir = quatRotate(qInst, vec3(0.0, 1.0, 0.0));
transformed += iBasePos + dir * (-0.035);`,
  })

  patchInstancedTransformMaterial(pappusMat, {
    cacheKey: 'summer-pappus-gpu-v1',
    hasNormal: true,
    beginNormal: `vec3 objectNormal = vec3( normal );

mat3 mv = mat3( modelViewMatrix );
float s0 = length(mv[0]);
float s1 = length(mv[1]);
float s2 = length(mv[2]);
float s = max(1e-6, (s0 + s1 + s2) / 3.0);
mat3 R = mat3(mv[0] / s, mv[1] / s, mv[2] / s);
mat3 bill = transpose(R);

float m00 = bill[0][0], m01 = bill[0][1], m02 = bill[0][2];
float m10 = bill[1][0], m11 = bill[1][1], m12 = bill[1][2];
float m20 = bill[2][0], m21 = bill[2][1], m22 = bill[2][2];

vec4 qBill;
float tr = m00 + m11 + m22;
if (tr > 0.0) {
  float S = sqrt(tr + 1.0) * 2.0;
  qBill = vec4((m21 - m12) / S, (m02 - m20) / S, (m10 - m01) / S, 0.25 * S);
}
else if (m00 > m11 && m00 > m22) {
  float S = sqrt(1.0 + m00 - m11 - m22) * 2.0;
  qBill = vec4(0.25 * S, (m01 + m10) / S, (m02 + m20) / S, (m21 - m12) / S);
}
else if (m11 > m22) {
  float S = sqrt(1.0 + m11 - m00 - m22) * 2.0;
  qBill = vec4((m01 + m10) / S, 0.25 * S, (m12 + m21) / S, (m02 - m20) / S);
}
else {
  float S = sqrt(1.0 + m22 - m00 - m11) * 2.0;
  qBill = vec4((m02 + m20) / S, (m12 + m21) / S, 0.25 * S, (m10 - m01) / S);
}
qBill = normalize(qBill);

vec4 qBase = iQuat;
if (dot(qBill, qBase) < 0.0) qBase = -qBase;
vec4 qMix = normalize(mix(qBill, qBase, 0.22));
vec4 qR = quatAxisAngle(vec3(0.0, 1.0, 0.0), iPappusRoll + sin(uTime * 0.6 + iPhase) * 0.15);
vec4 qFinal = quatMul(qMix, qR);
objectNormal = normalize(quatRotate(qFinal, objectNormal));`,
    beginVertex: `mat3 mv = mat3( modelViewMatrix );
float s0 = length(mv[0]);
float s1 = length(mv[1]);
float s2 = length(mv[2]);
float s = max(1e-6, (s0 + s1 + s2) / 3.0);
mat3 R = mat3(mv[0] / s, mv[1] / s, mv[2] / s);
mat3 bill = transpose(R);

float m00 = bill[0][0], m01 = bill[0][1], m02 = bill[0][2];
float m10 = bill[1][0], m11 = bill[1][1], m12 = bill[1][2];
float m20 = bill[2][0], m21 = bill[2][1], m22 = bill[2][2];

vec4 qBill;
float tr = m00 + m11 + m22;
if (tr > 0.0) {
  float S = sqrt(tr + 1.0) * 2.0;
  qBill = vec4((m21 - m12) / S, (m02 - m20) / S, (m10 - m01) / S, 0.25 * S);
}
else if (m00 > m11 && m00 > m22) {
  float S = sqrt(1.0 + m00 - m11 - m22) * 2.0;
  qBill = vec4(0.25 * S, (m01 + m10) / S, (m02 + m20) / S, (m21 - m12) / S);
}
else if (m11 > m22) {
  float S = sqrt(1.0 + m11 - m00 - m22) * 2.0;
  qBill = vec4((m01 + m10) / S, 0.25 * S, (m12 + m21) / S, (m02 - m20) / S);
}
else {
  float S = sqrt(1.0 + m22 - m00 - m11) * 2.0;
  qBill = vec4((m02 + m20) / S, (m12 + m21) / S, 0.25 * S, (m10 - m01) / S);
}
qBill = normalize(qBill);

vec4 qBase = iQuat;
if (dot(qBill, qBase) < 0.0) qBase = -qBase;
vec4 qMix = normalize(mix(qBill, qBase, 0.22));
vec4 qR = quatAxisAngle(vec3(0.0, 1.0, 0.0), iPappusRoll + sin(uTime * 0.6 + iPhase) * 0.15);
vec4 qFinal = quatMul(qMix, qR);

float sP = iPappusScale * (0.96 + sin(uTime * 0.8 + iPhase) * 0.04);
vec3 transformed = vec3( position ) * sP;
transformed = quatRotate(qFinal, transformed);

vec4 qInst = getInstanceQuat(uTime);
vec3 dir = quatRotate(qInst, vec3(0.0, 1.0, 0.0));
vec3 tip = iBasePos + dir * iLen;
transformed += tip;`,
  })

  const updateGpuTime = (t: number) => {
    for (const m of [stalkMat, pappusMat, acheneMat]) {
      const shader = (m as any)?.userData?.shader
      if (shader?.uniforms?.uTime)
        shader.uniforms.uTime.value = t
    }
  }

  root.position.set(0, -0.32, 0)
  root.scale.setScalar(1.08)

  // Detached floating seeds (few, for realism)
  const seedTex = createDandelionSeedTexture()
  texs.push(seedTex)
  const seedMat = new THREE.MeshStandardMaterial({
    color: seedColor,
    map: seedTex,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
    depthWrite: false,
    roughness: 0.95,
    metalness: 0,
  })
  ;(seedMat as any).userData = { cssColorVar: '--summer-seed' }
  mats.push(seedMat)

  const seedGeo = new THREE.PlaneGeometry(0.22, 0.22)
  const seedsCount = 24
  const seeds = new THREE.InstancedMesh(seedGeo, seedMat, seedsCount)
  seeds.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  const seedsState = new Array(seedsCount).fill(0).map(() => ({
    x: head.position.x + (Math.random() - 0.5) * 0.18,
    y: head.position.y + (Math.random() - 0.5) * 0.18,
    z: (Math.random() - 0.5) * 0.22,
    vx: 0.22 + Math.random() * 0.55,
    vy: 0.06 + Math.random() * 0.28,
    vz: (Math.random() - 0.5) * 0.2,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 1.6,
    life: Math.random() * 1.2,
    s: 0.58 + Math.random() * 0.22,
  }))

  const tmpPos = new THREE.Vector3()
  const tmpEuler = new THREE.Euler()
  const tmpQuat = new THREE.Quaternion()
  const tmpScale = new THREE.Vector3()
  function writeSeeds() {
    for (let i = 0; i < seedsCount; i++) {
      const s0 = seedsState[i]
      tmpPos.set(s0.x, s0.y, s0.z)
      tmpEuler.set(0, 0, s0.rot)
      tmpQuat.setFromEuler(tmpEuler)
      tmpScale.set(s0.s, s0.s, s0.s)
      m4.compose(tmpPos, tmpQuat, tmpScale)
      seeds.setMatrixAt(i, m4)
    }
    seeds.instanceMatrix.needsUpdate = true
  }
  writeSeeds()
  root.add(seeds)

  let sway = Math.random() * Math.PI * 2
  const tick = (dt: number, t: number) => {
    sway += dt
    root.rotation.z = Math.sin(sway * 0.45) * 0.05
    root.rotation.x = Math.sin(sway * 0.3) * 0.02
    updateGpuTime(t)

    for (let i = 0; i < seedsCount; i++) {
      const s0 = seedsState[i]
      s0.life += dt
      s0.x += s0.vx * dt
      s0.y += s0.vy * dt + Math.sin(t * 1.2 + i) * 0.01
      s0.z += s0.vz * dt
      s0.rot += s0.vr * dt
      if (s0.life > 2.6 || s0.x > 1.45 || s0.y > 1.55 || s0.y < -1.2) {
        s0.life = Math.random() * 0.8
        s0.x = head.position.x + (Math.random() - 0.5) * 0.2
        s0.y = head.position.y + (Math.random() - 0.5) * 0.2
        s0.z = (Math.random() - 0.5) * 0.22
        s0.vx = 0.22 + Math.random() * 0.55
        s0.vy = 0.06 + Math.random() * 0.28
        s0.vz = (Math.random() - 0.5) * 0.2
        s0.vr = (Math.random() - 0.5) * 1.6
        s0.rot = Math.random() * Math.PI * 2
        s0.s = 0.58 + Math.random() * 0.22
      }
    }
    writeSeeds()
  }

  return { root, tick, materials: mats, textures: texs }
}

function autumnBuild(): BuildResult {
  const root = new THREE.Group()
  const mats: THREE.Material[] = []
  const texs: THREE.Texture[] = []

  const leafTex = createLeafTexture()
  texs.push(leafTex)

  const leafMat = new THREE.MeshStandardMaterial({
    map: leafTex,
    transparent: true,
    opacity: 1,
    roughness: 0.85,
    metalness: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  mats.push(leafMat)

  const mainGeo = new THREE.PlaneGeometry(1.25, 1.25, 18, 18)
  // subtle curl
  const pos = mainGeo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const curl = Math.sin((x + 0.6) * 2.2) * 0.03 + Math.cos((y - 0.2) * 2.6) * 0.03
    pos.setZ(i, curl)
  }
  pos.needsUpdate = true
  mainGeo.computeVertexNormals()

  const mainLeaf = new THREE.Mesh(mainGeo, leafMat)
  mainLeaf.position.set(0.2, 0.25, 0)
  mainLeaf.rotation.set(0.18, -0.15, -0.6)
  root.add(mainLeaf)

  const leafMat2 = leafMat.clone()
  ;(leafMat2 as THREE.MeshStandardMaterial).color = cssColor('--autumn-leaf-2', '#f59e0b')
  ;(leafMat2 as any).userData = { cssColorVar: '--autumn-leaf-2' }
  mats.push(leafMat2)

  const instGeo = new THREE.PlaneGeometry(0.42, 0.42)
  const fallCount = 34
  const leaves = new THREE.InstancedMesh(instGeo, leafMat2, fallCount)
  const colors = [
    cssColor('--autumn-leaf-1', '#f97316'),
    cssColor('--autumn-leaf-2', '#f59e0b'),
    cssColor('--autumn-leaf-3', '#ef4444'),
  ]

  const states = new Array(fallCount).fill(0).map(() => ({
    x: (Math.random() - 0.5) * 1.9,
    y: -0.1 + Math.random() * 1.6,
    z: (Math.random() - 0.5) * 0.8,
    vy: 0.18 + Math.random() * 0.42,
    vx: (Math.random() - 0.5) * 0.2,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 2.6,
    tilt: (Math.random() - 0.5) * 0.7,
    s: 0.7 + Math.random() * 0.8,
  }))

  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const v = new THREE.Vector3()
  const sc = new THREE.Vector3()

  for (let i = 0; i < fallCount; i++) {
    leaves.setColorAt(i, colors[i % colors.length])
  }
  function write() {
    for (let i = 0; i < fallCount; i++) {
      const s0 = states[i]
      v.set(s0.x, s0.y, s0.z)
      e.set(s0.tilt, 0, s0.rot)
      q.setFromEuler(e)
      sc.set(s0.s, s0.s, s0.s)
      m4.compose(v, q, sc)
      leaves.setMatrixAt(i, m4)
    }
    leaves.instanceMatrix.needsUpdate = true
    if (leaves.instanceColor)
      leaves.instanceColor.needsUpdate = true
  }
  write()
  root.add(leaves)

  root.position.set(0, -0.18, 0)
  root.scale.setScalar(1.05)

  const tick = (dt: number, t: number) => {
    root.rotation.z = Math.sin(t * 0.25) * 0.035
    for (let i = 0; i < fallCount; i++) {
      const s0 = states[i]
      s0.y -= s0.vy * dt
      s0.x += (s0.vx + Math.sin(t * 0.9 + s0.z * 2) * 0.07) * dt
      s0.rot += s0.vr * dt
      s0.tilt = Math.sin(t * 1.1 + i) * 0.35
      if (s0.y < -1.15) {
        s0.y = 0.95 + Math.random() * 0.75
        s0.x = (Math.random() - 0.5) * 1.9
        s0.z = (Math.random() - 0.5) * 0.8
        s0.vy = 0.18 + Math.random() * 0.42
        s0.vx = (Math.random() - 0.5) * 0.2
        s0.vr = (Math.random() - 0.5) * 2.6
        s0.rot = Math.random() * Math.PI * 2
        s0.s = 0.7 + Math.random() * 0.8
      }
    }
    write()
  }

  return { root, tick, materials: mats, textures: texs }
}

function winterSnowmanBuild(): BuildResult {
  const root = new THREE.Group()
  const mats: THREE.Material[] = []
  const texs: THREE.Texture[] = []

  const snow = cssColor('--winter-snow', '#ffffff')
  const eye = cssColor('--winter-eye', '#111827')
  const mouth = cssColor('--winter-mouth', '#374151')
  const button = cssColor('--winter-button', '#111827')
  const scarf = cssColor('--winter-scarf', '#ef4444')
  const nose = cssColor('--winter-nose', '#f97316')

  const noseBoost = nose.clone()
  {
    const hsl = { h: 0, s: 0, l: 0 }
    noseBoost.getHSL(hsl)
    noseBoost.setHSL(hsl.h, Math.min(1, hsl.s * 1.25 + 0.18), Math.max(0, Math.min(1, hsl.l * 0.92)))
  }

  const bump = createSnowBumpTexture()
  texs.push(bump)
  ;(bump as any).wrapS = THREE.RepeatWrapping
  ;(bump as any).wrapT = THREE.RepeatWrapping
  bump.repeat.set(2, 2)

  const snowMat = new THREE.MeshPhysicalMaterial({
    color: snow,
    roughness: 0.95,
    metalness: 0,
    clearcoat: 0.05,
    clearcoatRoughness: 0.9,
    bumpMap: bump,
    bumpScale: 0.12,
  })
  ;(snowMat as any).userData = { cssColorVar: '--winter-snow' }
  mats.push(snowMat)

  const body1 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 26, 26), snowMat)
  body1.position.set(0, -0.45, 0)
  const body2 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 26, 26), snowMat)
  body2.position.set(0, 0.15, 0.02)
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 26, 26), snowMat)
  head.position.set(0, 0.62, 0.02)
  root.add(body1, body2, head)

  const eyeMat = new THREE.MeshStandardMaterial({ color: eye, roughness: 0.25, metalness: 0 })
  ;(eyeMat as any).userData = { cssColorVar: '--winter-eye' }
  mats.push(eyeMat)

  const eyeGeo = new THREE.SphereGeometry(0.03, 12, 12)
  const e1 = new THREE.Mesh(eyeGeo, eyeMat)
  const e2 = new THREE.Mesh(eyeGeo, eyeMat)
  // Place slightly in front of the snow surface so eyes never disappear due to depth/lighting
  e1.position.set(-0.075, 0.685, 0.305)
  e2.position.set(0.075, 0.685, 0.305)
  root.add(e1, e2)

  const noseMat = new THREE.MeshPhysicalMaterial({
    color: noseBoost,
    roughness: 0.55,
    metalness: 0,
    clearcoat: 0.15,
    clearcoatRoughness: 0.85,
    emissive: noseBoost.clone(),
    emissiveIntensity: 0.14,
  })
  ;(noseMat as any).userData = { cssColorVar: '--winter-nose' }
  mats.push(noseMat)
  const noseMesh = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.24, 18), noseMat)
  noseMesh.position.set(0, 0.62, 0.39)
  noseMesh.rotation.x = Math.PI / 2
  root.add(noseMesh)

  const mouthMat = new THREE.MeshStandardMaterial({ color: mouth, roughness: 0.5, metalness: 0 })
  ;(mouthMat as any).userData = { cssColorVar: '--winter-mouth' }
  mats.push(mouthMat)

  // Coal mouth (small dots in an arc)
  const mouthGeo = new THREE.SphereGeometry(0.022, 12, 12)
  const mouthCount = 7
  for (let i = 0; i < mouthCount; i++) {
    const t = i / (mouthCount - 1)
    const x = (t - 0.5) * 0.18
    const y = 0.635 + Math.sin((t - 0.5) * Math.PI) * -0.035
    const m0 = new THREE.Mesh(mouthGeo, mouthMat)
    m0.position.set(x, y, 0.33)
    root.add(m0)
  }

  const buttonMat = new THREE.MeshStandardMaterial({ color: button, roughness: 0.35, metalness: 0 })
  ;(buttonMat as any).userData = { cssColorVar: '--winter-button' }
  mats.push(buttonMat)
  const btnGeo = new THREE.SphereGeometry(0.028, 12, 12)
  const btn1 = new THREE.Mesh(btnGeo, buttonMat)
  const btn2 = new THREE.Mesh(btnGeo, buttonMat)
  const btn3 = new THREE.Mesh(btnGeo, buttonMat)
  btn1.position.set(0, 0.18, 0.39)
  btn2.position.set(0, 0.05, 0.41)
  btn3.position.set(0, -0.1, 0.39)
  root.add(btn1, btn2, btn3)

  // Twig arms
  const twigMat = new THREE.MeshStandardMaterial({ color: cssColor('--season-stroke', 'rgba(55, 65, 81, 0.5)'), roughness: 0.95, metalness: 0 })
  mats.push(twigMat)
  const armGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.65, 10)
  const armL = new THREE.Mesh(armGeo, twigMat)
  const armR = new THREE.Mesh(armGeo, twigMat)
  armL.position.set(-0.55, 0.15, 0.05)
  armL.rotation.z = 0.55
  armL.rotation.x = 0.35
  armR.position.set(0.55, 0.15, 0.05)
  armR.rotation.z = -0.55
  armR.rotation.x = 0.35
  root.add(armL, armR)

  const twigSmallGeo = new THREE.CylinderGeometry(0.01, 0.012, 0.22, 10)
  for (const side of [-1, 1]) {
    const t1 = new THREE.Mesh(twigSmallGeo, twigMat)
    t1.position.set(0.78 * side, 0.34, 0.08)
    t1.rotation.z = side > 0 ? -1.25 : 1.25
    t1.rotation.x = 0.35
    root.add(t1)
  }

  const scarfMat = new THREE.MeshStandardMaterial({ color: scarf, roughness: 0.65, metalness: 0 })
  ;(scarfMat as any).userData = { cssColorVar: '--winter-scarf' }
  mats.push(scarfMat)
  const scarfTex = createKnitScarfTexture()
  texs.push(scarfTex)
  scarfTex.wrapS = THREE.RepeatWrapping
  scarfTex.wrapT = THREE.RepeatWrapping
  scarfTex.repeat.set(2.2, 1.4)
  scarfMat.map = scarfTex
  scarfMat.needsUpdate = true

  const scarfMesh = new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.075, 16, 28), scarfMat)
  scarfMesh.position.set(0, 0.37, 0.12)
  scarfMesh.rotation.x = Math.PI / 2
  scarfMesh.rotation.z = -0.12
  root.add(scarfMesh)

  const scarfTail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.36, 0.08), scarfMat)
  scarfTail.position.set(0.2, 0.16, 0.26)
  scarfTail.rotation.z = -0.35
  scarfTail.rotation.x = 0.08
  root.add(scarfTail)

  const scarfTail2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.075), scarfMat)
  scarfTail2.position.set(0.06, 0.12, 0.23)
  scarfTail2.rotation.z = 0.18
  scarfTail2.rotation.x = 0.1
  root.add(scarfTail2)

  // Santa hat (cute)
  const hatRedMat = new THREE.MeshPhysicalMaterial({
    color: scarf.clone(),
    roughness: 0.75,
    metalness: 0,
    clearcoat: 0.12,
    clearcoatRoughness: 0.85,
  })
  ;(hatRedMat as any).userData = { cssColorVar: '--winter-scarf' }
  mats.push(hatRedMat)

  const hatWhiteMat = new THREE.MeshPhysicalMaterial({
    color: snow.clone(),
    roughness: 0.9,
    metalness: 0,
    clearcoat: 0.05,
    clearcoatRoughness: 0.95,
  })
  ;(hatWhiteMat as any).userData = { cssColorVar: '--winter-snow' }
  mats.push(hatWhiteMat)

  // reuse snow bump for a fuzzy brim/pom look
  hatWhiteMat.bumpMap = bump
  hatWhiteMat.bumpScale = 0.06
  hatWhiteMat.needsUpdate = true

  const hatGroup = new THREE.Group()
  hatGroup.position.copy(head.position).add(new THREE.Vector3(0, 0.235, 0.065))
  hatGroup.rotation.set(0.14, 0.06, -0.18)
  root.add(hatGroup)

  const hatGeo = new THREE.ConeGeometry(0.23, 0.56, 28, 12)
  // bend the hat tip a bit for cuteness
  const hatPos = hatGeo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < hatPos.count; i++) {
    const y = hatPos.getY(i)
    const t = (y + 0.28) / 0.56 // 0..1
    if (t > 0.25) {
      const bend = (t ** 2.2) * 0.16
      hatPos.setX(i, hatPos.getX(i) + bend)
      hatPos.setZ(i, hatPos.getZ(i) + bend * 0.35)
    }
  }
  hatPos.needsUpdate = true
  hatGeo.computeVertexNormals()
  hatGeo.translate(0, 0.28, 0) // base at y=0

  const hatCone = new THREE.Mesh(hatGeo, hatRedMat)
  hatCone.position.set(0, 0.01, 0)
  hatGroup.add(hatCone)

  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.265, 0.265, 0.11, 28, 1, false), hatWhiteMat)
  brim.position.set(0, 0.045, 0.01)
  hatGroup.add(brim)

  const pom = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 18), hatWhiteMat)
  pom.position.set(0.22, 0.56, 0.08)
  hatGroup.add(pom)

  // blush cheeks
  const blushMat = new THREE.MeshStandardMaterial({
    color: '#fb7185',
    transparent: true,
    opacity: 0.35,
    roughness: 0.9,
    metalness: 0,
    depthWrite: false,
  })
  mats.push(blushMat)
  const blushGeo = new THREE.SphereGeometry(0.055, 14, 14)
  const blushL = new THREE.Mesh(blushGeo, blushMat)
  const blushR = new THREE.Mesh(blushGeo, blushMat)
  blushL.position.set(-0.16, 0.62, 0.265)
  blushR.position.set(0.16, 0.62, 0.265)
  blushL.scale.set(1.15, 0.75, 0.55)
  blushR.scale.set(1.15, 0.75, 0.55)
  root.add(blushL, blushR)

  // red mittens for extra cuteness
  const mittenMat = new THREE.MeshPhysicalMaterial({
    color: scarf.clone(),
    roughness: 0.65,
    metalness: 0,
    clearcoat: 0.2,
    clearcoatRoughness: 0.85,
  })
  ;(mittenMat as any).userData = { cssColorVar: '--winter-scarf' }
  mats.push(mittenMat)
  const mitten = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 18), mittenMat)
  const mitten2 = mitten.clone()
  // attach to arms so it follows motion
  armL.add(mitten)
  mitten.position.set(0, 0.34, 0)
  armR.add(mitten2)
  mitten2.position.set(0, 0.34, 0)

  root.position.set(0, -0.4, 0)
  root.scale.setScalar(1.1)

  let sway = Math.random() * Math.PI * 2
  const tick = (dt: number, t: number) => {
    sway += dt
    root.rotation.y = Math.sin(sway * 0.35) * 0.22
  }

  return { root, tick, materials: mats, textures: texs }
}

function winterTreeBuild(): BuildResult {
  const root = new THREE.Group()
  const mats: THREE.Material[] = []

  const treeColor = cssColor('--winter-tree', '#22c55e')
  const trunkColor = cssColor('--winter-trunk', '#7a3f17')
  const starColor = cssColor('--winter-star', '#facc15')
  const o1 = cssColor('--winter-ornament-1', '#ef4444')
  const o2 = cssColor('--winter-ornament-2', '#3b82f6')
  const o3 = cssColor('--winter-ornament-3', '#a855f7')

  const treeMat = new THREE.MeshStandardMaterial({ color: treeColor, roughness: 0.85, metalness: 0 })
  ;(treeMat as any).userData = { cssColorVar: '--winter-tree' }
  mats.push(treeMat)

  const trunkMat = new THREE.MeshStandardMaterial({ color: trunkColor, roughness: 0.9, metalness: 0 })
  ;(trunkMat as any).userData = { cssColorVar: '--winter-trunk' }
  mats.push(trunkMat)

  const starMat = new THREE.MeshPhysicalMaterial({
    color: starColor,
    roughness: 0.25,
    metalness: 0,
    emissive: starColor.clone(),
    emissiveIntensity: 0.65,
    clearcoat: 0.3,
  })
  ;(starMat as any).userData = { cssColorVar: '--winter-star', cssEmissiveVar: '--winter-star' }
  mats.push(starMat)

  const ornamentMat = new THREE.MeshPhysicalMaterial({
    color: o1,
    roughness: 0.3,
    metalness: 0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.55,
    emissive: o1.clone(),
    emissiveIntensity: 0.25,
  })
  ;(ornamentMat as any).userData = { cssColorVar: '--winter-ornament-1', cssEmissiveVar: '--winter-ornament-1' }
  mats.push(ornamentMat)

  const ornamentMat2 = ornamentMat.clone()
  ;(ornamentMat2 as any).userData = { cssColorVar: '--winter-ornament-2', cssEmissiveVar: '--winter-ornament-2' }
  ;(ornamentMat2 as THREE.MeshPhysicalMaterial).color = o2
  ;(ornamentMat2 as THREE.MeshPhysicalMaterial).emissive = o2.clone()
  mats.push(ornamentMat2)

  const ornamentMat3 = ornamentMat.clone()
  ;(ornamentMat3 as any).userData = { cssColorVar: '--winter-ornament-3', cssEmissiveVar: '--winter-ornament-3' }
  ;(ornamentMat3 as THREE.MeshPhysicalMaterial).color = o3
  ;(ornamentMat3 as THREE.MeshPhysicalMaterial).emissive = o3.clone()
  mats.push(ornamentMat3)

  const cones = [
    { y: -0.15, r: 0.65, h: 0.8 },
    { y: 0.25, r: 0.52, h: 0.72 },
    { y: 0.58, r: 0.38, h: 0.62 },
  ]
  for (const c0 of cones) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(c0.r, c0.h, 18, 1), treeMat)
    cone.position.set(0, c0.y, 0)
    root.add(cone)
  }
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.35, 16), trunkMat)
  trunk.position.set(0, -0.72, 0)
  root.add(trunk)

  // star
  const starShape = new THREE.Shape()
  const spikes = 5
  const outer = 0.22
  const inner = 0.1
  let rot = Math.PI / 2 * 3
  let x = 0
  let y = 0
  starShape.moveTo(0, -outer)
  for (let i = 0; i < spikes; i++) {
    x = Math.cos(rot) * outer
    y = Math.sin(rot) * outer
    starShape.lineTo(x, y)
    rot += Math.PI / spikes
    x = Math.cos(rot) * inner
    y = Math.sin(rot) * inner
    starShape.lineTo(x, y)
    rot += Math.PI / spikes
  }
  starShape.closePath()
  const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 })
  const star = new THREE.Mesh(starGeo, starMat)
  star.position.set(0, 1.06, 0.02)
  star.rotation.x = Math.PI
  root.add(star)

  const orbGeo = new THREE.SphereGeometry(0.06, 16, 16)
  const orbs: THREE.Mesh[] = []
  const orbSlots = [
    { x: -0.25, y: 0.2, z: 0.35, m: ornamentMat },
    { x: 0.25, y: 0.1, z: -0.32, m: ornamentMat2 },
    { x: 0.12, y: -0.1, z: 0.42, m: ornamentMat3 },
    { x: -0.12, y: -0.28, z: -0.36, m: ornamentMat },
    { x: 0.32, y: -0.32, z: 0.1, m: ornamentMat2 },
  ]
  for (const o of orbSlots) {
    const mesh = new THREE.Mesh(orbGeo, o.m)
    mesh.position.set(o.x, o.y, o.z)
    root.add(mesh)
    orbs.push(mesh)
  }

  // garland
  const garlandMat = new THREE.MeshPhysicalMaterial({
    color: cssColor('--winter-garland', '#60a5fa'),
    roughness: 0.4,
    metalness: 0,
    emissive: cssColor('--winter-garland', '#60a5fa'),
    emissiveIntensity: 0.25,
    clearcoat: 0.25,
  })
  ;(garlandMat as any).userData = { cssColorVar: '--winter-garland', cssEmissiveVar: '--winter-garland' }
  mats.push(garlandMat)

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.5, 0.1, 0.25),
    new THREE.Vector3(0, 0.05, 0.38),
    new THREE.Vector3(0.5, 0.1, 0.25),
  ])
  const garland = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.03, 10, false), garlandMat)
  root.add(garland)

  root.position.set(0, -0.28, 0)
  root.scale.setScalar(1.05)

  const tick = (_dt: number, t: number) => {
    root.rotation.y = Math.sin(t * 0.25) * 0.25
    star.rotation.z = Math.sin(t * 1.2) * 0.12
    ;(starMat as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.55 + (Math.sin(t * 1.4) * 0.5 + 0.5) * 0.55
    ;(garlandMat as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.18 + (Math.sin(t * 2.2) * 0.5 + 0.5) * 0.22

    for (let i = 0; i < orbs.length; i++) {
      const m: any = orbs[i].material
      if (m?.emissiveIntensity != null)
        m.emissiveIntensity = 0.18 + (Math.sin(t * 2.5 + i) * 0.5 + 0.5) * 0.35
    }
  }

  return { root, tick, materials: mats }
}

function buildForProps(): BuildResult {
  if (props.theme === 'spring')
    return springBuild()
  if (props.theme === 'summer')
    return summerBuild()
  if (props.theme === 'autumn')
    return autumnBuild()
  if (props.variant === 'tree')
    return winterTreeBuild()
  return winterSnowmanBuild()
}

function ensureThree() {
  if (!container.value || typeof window === 'undefined')
    return

  isReady.value = false
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 20)
  camera.position.set(0.25, 0.35, 3.3)
  camera.lookAt(0, 0.15, 0)

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !lowPower.value,
    powerPreference: lowPower.value ? 'low-power' : 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower.value ? 1.25 : 2))
  renderer.setClearColor(0x000000, 0)
  renderer.setSize(props.width, props.height, false)
  ;(renderer as any).outputEncoding = (THREE as any).sRGBEncoding ?? undefined
  renderer.toneMapping = (THREE as any).ACESFilmicToneMapping ?? THREE.NoToneMapping
  renderer.toneMappingExposure = 1.05

  // Prevent a white "uninitialized canvas" flash: keep it hidden until first render.
  renderer.domElement.style.background = 'transparent'
  renderer.domElement.style.opacity = '0'
  renderer.domElement.style.transition = 'opacity 160ms ease'
  renderer.clear(true, true, true)

  container.value.appendChild(renderer.domElement)

  hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x223344, props.dark ? 0.95 : 0.85)
  hemiLight.position.set(0, 1.2, 0)
  dirLight = new THREE.DirectionalLight(0xFFFFFF, props.dark ? 0.95 : 0.85)
  dirLight.position.set(1.6, 2.3, 2.2)
  fillLight = new THREE.PointLight(0xFFFFFF, 0.55, 10)
  fillLight.position.set(-1.2, 0.6, 2.2)
  scene.add(hemiLight, dirLight, fillLight)
}

function syncSize() {
  if (!container.value || !renderer || !camera)
    return
  const w = Math.max(1, container.value.clientWidth || props.width)
  const h = Math.max(1, container.value.clientHeight || props.height)
  camera.aspect = Math.min(w / h, 2)
  camera.updateProjectionMatrix()
  camera.lookAt(0, 0.15, 0)
  renderer.setSize(w, h, false)
}

function rebuild() {
  if (!scene)
    return
  if (build?.root) {
    scene.remove(build.root)
    disposeSceneObject(build.root)
    build.textures?.forEach(t => t.dispose())
    build.materials?.forEach(m => m.dispose())
  }
  build = buildForProps()
  scene.add(build.root)
  if (build.materials)
    applyMaterialColors(build.materials)
}

function renderOnce() {
  if (!renderer || !scene || !camera)
    return
  renderer.render(scene, camera)
  isReady.value = true
  renderer.domElement.style.opacity = '1'
}

function loop(ts: number) {
  if (!renderer || !scene || !camera)
    return
  if (!isVisible.value || document.hidden) {
    stop()
    return
  }
  rafId = window.requestAnimationFrame(loop)
  const fps = targetFps.value
  if (fps > 0) {
    const interval = 1000 / fps
    if (lastFrameTs && ts - lastFrameTs < interval)
      return
    lastFrameTs = ts
  }
  const t = ts / 1000
  const dt = Math.min(0.05, Math.max(0.001, (ts - (lastT || ts)) / 1000))
  lastT = ts
  build?.tick?.(dt, t)
  renderer.render(scene, camera)
  if (!isReady.value)
    isReady.value = true
  renderer.domElement.style.opacity = '1'
}

function start() {
  if (!renderer)
    return
  if (!isVisible.value || (typeof document !== 'undefined' && document.hidden))
    return
  lastT = 0
  lastFrameTs = 0
  if (reduceMotion.value) {
    // still render with one tick for subtle pose
    build?.tick?.(1 / 60, performance.now() / 1000)
    renderOnce()
    return
  }
  rafId = window.requestAnimationFrame(loop)
}

function stop() {
  if (rafId) {
    window.cancelAnimationFrame(rafId)
    rafId = 0
  }
}

function teardown() {
  stop()
  resizeObserver?.disconnect()
  resizeObserver = undefined
  intersectionObserver?.disconnect()
  intersectionObserver = undefined
  if (visibilityHandler) {
    window.removeEventListener('visibilitychange', visibilityHandler)
    visibilityHandler = undefined
  }
  isReady.value = false

  if (build?.root && scene) {
    scene.remove(build.root)
    disposeSceneObject(build.root)
  }
  build?.textures?.forEach(t => t.dispose())
  build?.materials?.forEach(m => m.dispose())
  build = undefined

  renderer?.dispose()
  if (renderer?.domElement?.parentNode)
    renderer.domElement.parentNode.removeChild(renderer.domElement)

  renderer = undefined
  scene = undefined
  camera = undefined
  hemiLight = undefined
  dirLight = undefined
  fillLight = undefined
}

function refreshThemeColors() {
  if (!build?.materials)
    return
  applyMaterialColors(build.materials)
  renderOnce()
}

onMounted(() => {
  if (!container.value || typeof window === 'undefined')
    return

  ensureThree()
  if (!scene || !renderer || !camera)
    return

  rebuild()
  syncSize()
  // Render immediately so we never show an uninitialized (white) canvas.
  build?.tick?.(1 / 60, performance.now() / 1000)
  renderOnce()

  resizeObserver = new ResizeObserver(() => {
    syncSize()
    renderOnce()
  })
  resizeObserver.observe(container.value)

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      const next = entry?.isIntersecting ?? true
      if (isVisible.value === next)
        return
      isVisible.value = next
      if (isVisible.value)
        start()
      else
        stop()
    },
    { root: null, threshold: 0.01 },
  )
  intersectionObserver.observe(container.value)

  visibilityHandler = () => {
    if (document.hidden)
      stop()
    else if (isVisible.value)
      start()
  }
  window.addEventListener('visibilitychange', visibilityHandler)

  start()
})

watch(
  () => [props.theme, props.variant, props.width, props.height],
  () => {
    if (!scene)
      return
    stop()
    rebuild()
    syncSize()
    build?.tick?.(1 / 60, performance.now() / 1000)
    renderOnce()
    start()
  },
)

watch(
  () => props.dark,
  () => {
    if (!scene || !renderer)
      return
    // lighting + CSS vars change
    if (hemiLight)
      hemiLight.intensity = props.dark ? 0.95 : 0.85
    if (dirLight)
      dirLight.intensity = props.dark ? 0.95 : 0.85
    refreshThemeColors()
    renderOnce()
  },
)

onBeforeUnmount(() => teardown())
</script>

<template>
  <div ref="container" class="season-decor-3d" :class="{ 'is-ready': isReady }" :style="{ width: `${width}px`, height: `${height}px` }" />
</template>

<style scoped>
.season-decor-3d :deep(canvas) {
  width: 100%;
  height: 100%;
  display: block;
  background: transparent;
  opacity: 0;
  transition: opacity 160ms ease;
}

.season-decor-3d.is-ready :deep(canvas) {
  opacity: 1;
}
</style>
