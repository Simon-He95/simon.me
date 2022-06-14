<script setup lang="ts">
import { isDark } from '~/logics'
function preload() {
  const Image = document.createElement('img')
  Image.src = '/black.png'
}
onMounted(() => {
  preload()
})
</script>

<template>
  <header class="header z-40">
    <router-link
      w-30
      absolute
      lg:fixed
      m-6
      select-none
      outline-none
      to="/"
      focusable="false"
    >
      <img
        border-rd-full
        src="/signature.png"
        :class="isDark ? 'brightness' : ''"
        alt="logo"
      >
    </router-link>

    <nav class="nav">
      <div class="spacer" />
      <div class="right">
        <router-link to="/posts" title="Blog">
          <span class="lt-md:hidden BlogMove">
            Blog
            <div class="white" />
          </span>
          <div i-simple-icons:bloglovin md:hidden />
        </router-link>
        <router-link to="/projects" title="Projects">
          <span class="lt-md:hidden projectMove"><span style="--delay: 0s">P</span><span style="--delay: 0.1s">r</span><span style="--delay: 0.2s">o</span><span style="--delay: 0.3s">j</span><span style="--delay: 0.4s">e</span><span style="--delay: 0.5s">c</span><span style="--delay: 0.6s">t</span><span style="--delay: 0.7s">s</span></span>
          <div i-bi:display class="md:hidden iconMove" />
        </router-link>
        <a
          href="https://twitter.com/simon_he1995"
          target="_blank"
          title="Twitter"
          class="lt-md:hidden"
        >
          <feather-twitter />
        </a>
        <a
          href="https://github.com/Simon-He95"
          target="_blank"
          title="GitHub"
          class="lt-md:hidden"
        >
          <div i-uil-github-alt />
        </a>
        <toggle-theme />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.brightness {
  filter: brightness(1500%);
}
.boxshadow {
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
    rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
    rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
    rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
    rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
}
.header h1 {
  margin-bottom: 0;
}

.logo {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
}

.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav > * {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}

.projectMove > span {
  position: relative;
  animation: bounce 0.5s ease infinite alternate;
}
.projectMove > span:nth-child(1n + 0) {
  animation-delay: var(--delay);
}
@keyframes bounce {
  100% {
    top: -2px;
    font-weight: bold;
  }
}
.iconMove {
  animation: iconMove 1s ease-in-out infinite alternate;
}
@keyframes iconMove {
  100% {
    transform: rotate(360deg);
  }
}

.BlogMove {
  position: relative;
}
.white {
  position: absolute;
  left: 0;
  width: 80%;
  height: 3px;
  z-index: 4;
  animation: whiteMove 3s ease-out infinite;
}

.BlogMove::before {
  content: "Blog";
  position: absolute;
  top: 0;
  left: 0.5px;
  height: 0px;
  color: v-bind(color);
  overflow: hidden;
  z-index: 2;
  animation: redShadow 2s ease-in infinite;
  filter: contrast(200%);
  text-shadow: 1px 0 0 #eee;
}

@keyframes redShadow {
  20% {
    height: 32px;
  }
  60% {
    height: 6px;
  }
  100% {
    height: 42px;
  }
}

@keyframes whiteMove {
  8% {
    top: 38px;
  }
  14% {
    top: 8px;
  }
  20% {
    top: 42px;
  }
  32% {
    top: 2px;
  }
  99% {
    top: 30px;
  }
}
</style>
