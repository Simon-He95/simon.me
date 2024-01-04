<script setup lang="ts">
import { useRaf } from 'lazy-js-utils'

async function toBase64(o: File | string, type = 'url') {
  if (type === 'file' || type === 'blob')
    return await fileToBase64(o as File | Blob)
  else if (type === 'url')
    return await urlToBase64(o as string)
}

function fileToBase64(file: File | Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    try {
      reader.onload = function (e) {
        resolve(e?.target?.result)
      }
    }
    catch (error: any) {
      reject(new Error(error))
    }
  })
}

function urlToBase64(url: string) {
  return new Promise((resolve, reject) => {
    try {
      const canvas: HTMLCanvasElement = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = `${url}?timeStamp=${new Date().getTime()}`
      img.onload = function () {
        ctx?.drawImage(
          img,
          0,
          0,
          (canvas.width = img.width),
          (canvas.height = img.height),
        )
        resolve(canvas.toDataURL())
      }
    }
    catch (error: any) {}
  })
}

const map = Promise.all([
  toBase64('/images/1.png'),
  toBase64('/images/2.png'),
  toBase64('/images/6.png'),
  toBase64('/images/4.png'),
  toBase64('/images/5.png'),
])
let cache: any
const color = ref('white')
const backgroundImage = ref('url(/images/3.png)')
let index = 0
async function animationend() {
  cache = await map
  backgroundImage.value = `url(${cache[0]})`
  useRaf(() => {
    backgroundImage.value = `url(${cache[index]})`
    if (index < 4)
      index++
    else index = 0
  }, 1000)
}
</script>

<template>
  <section class="lg:w-1/3 flex flex-wrap items-center" fixed left-0 bottom-10>
    <div class="astronaut-wrapper" @animationend="animationend">
      <div class="astronaut" :style="{ backgroundImage }" />
    </div>
  </section>
</template>

<style scoped>
@media (min-width: 1024px) {
  @keyframes flyaway {
    0% {
      transform: translateX(0) rotate(0) scale(1);
    }
    40% {
      transform: translateX(-500px) rotate(-1turn) scale(0);
    }
    40.001% {
      transform: translate(100vw, 40vh) rotate(1turn) scale(0.2);
      transform-origin: center -100%;
    }
    80% {
      transform: translate(50vw, -100vh) rotate(-20turn) scale(0.2);
    }
    95% {
      transform: translate(25vw, -50vh) rotate(-20turn) scale(0.2);
    }
    100% {
      transform: translateX(0) rotate(0) scale(1);
    }
  }
  @keyframes levitation {
    0% {
      transform: translateY(-135px);
    }
    50% {
      transform: translateY(-110px);
    }
    100% {
      transform: translateY(-135px);
    }
  }
  .astronaut-wrapper {
    position: relative;
    left: 20%;
    top: 30%;
    will-change: transform;
    animation: flyaway 15s 0s ease-in 1 forwards;
  }
  .astronaut {
    width: 15vmax;
    height: 10vmax;
    position: relative;
    background-size: contain;
    background-repeat: no-repeat;
    transform: translateY(-50%);
    animation: levitation 7s 0s ease-in-out infinite;
  }
}
</style>
`
