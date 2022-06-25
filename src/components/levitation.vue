<script setup lang="ts">
import { preload } from 'simon-js-tool'
preload([
  '/images/portrait.png',
  '/images/yellow.png',
  '/images/red.png',
  '/images/blue.png',
  '/images/purple.png',
])
const el = ref(null)
const wrapperEl = ref(null)
const color = ref('white')
const backgroundImage = ref('url(/images/R.png)')
function animationend() {
  backgroundImage.value = 'url(/images/portrait.png)'
  setTimeout(yellow, 1000)
}
function yellow() {
  color.value = '#FEF222'
  backgroundImage.value = 'url(/images/yellow.png)'
  setTimeout(red, 1000)
}
function red() {
  color.value = '#8D022B'
  backgroundImage.value = 'url(/images/red.png)'
  setTimeout(blue, 1000)
}
function blue() {
  color.value = '#3AEFFB'
  backgroundImage.value = 'url(/images/blue.png)'
  setTimeout(purple, 1000)
}
function purple() {
  color.value = '#CF78EB'
  backgroundImage.value = 'url(/images/purple.png)'
  setTimeout(yellow, 1000)
}
</script>

<template>
  <section class="lg:w-1/3 flex flex-wrap items-center" fixed left-0 bottom-10>
    <div
      ref="wrapperEl"
      class="astronaut-wrapper"
      :style="{
        color: 'red',
        filter: 'drop-shadow(2px 4px 6px ' + color + ')',
      }"
      @animationend="animationend"
    >
      <div ref="el" class="astronaut" :style="{ backgroundImage: backgroundImage }" />
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
    animation: flyaway 60s 0s ease-in 1 forwards;
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
