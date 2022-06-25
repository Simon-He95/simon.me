<script setup lang="ts"></script>

<template>
  <section class="lg:w-1/3 flex flex-wrap items-center" fixed left-0 bottom-10>
    <div class="astronaut-wrapper">
      <div class="astronaut" />
    </div>
  </section>
</template>

<style scoped>
@media (min-width: 1024px) {
  @keyframes flyaway {
    0% {
      transform: translateX(0) rotate(0) scale(1);
    }
    50% {
      transform: translateX(-500px) rotate(-1turn) scale(0);
    }
    50.001% {
      transform: translate(100vw, 0vh) rotate(1turn) scale(0.2);
      transform-origin: center -100%;
    }
    70% {
      transform: translate(50vw, -100vh) rotate(-20turn) scale(0.2);
    }
    100% {
      transform: translate(50vw, -100vh) rotate(-20turn) scale(0.2);
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
