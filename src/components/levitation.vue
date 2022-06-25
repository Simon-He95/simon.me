<script setup lang="ts">
import { preload } from 'simon-js-tool'
preload('/images/portrait.png')
const el = ref(null)
function animationend() {
  el.value.style.backgroundImage = 'url(/images/portrait.png)'
}
</script>

<template>
  <section class="lg:w-1/3 flex flex-wrap items-center" fixed left-0 bottom-10>
    <div class="astronaut-wrapper" @animationend="animationend">
      <div ref="el" class="astronaut" />
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
      filter: drop-shadow(2px 4px 6px red);
    }
    80% {
      transform: translate(50vw, -100vh) rotate(-20turn) scale(0.2);
    }
    95% {
      transform: translate(25vw, -50vh) rotate(-20turn) scale(0.2);
      filter: drop-shadow(2px 4px 6px gold);
    }
    100% {
      transform: translateX(0) rotate(0) scale(1);
      filter: drop-shadow(2px 4px 6px gold);
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
    background-image: url("/images/pic.svg");
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
