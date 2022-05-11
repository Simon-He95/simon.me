<script setup lang="ts">
import { isDark } from "~/logics";
function preload() {
  const Image = document.createElement("img");
  Image.src = "/black.png";
}
onMounted(() => {
  preload();
});
</script>

<template>
  <header class="header z-40">
    <router-link
      w-15
      h-15
      absolute
      lg:fixed
      m-6
      select-none
      outline-none
      to="/"
      focusable="false"
    >
      <img border-rd-full src="/black.png" alt="logo" />
    </router-link>
    <nav class="nav">
      <div class="spacer" />
      <div class="right">
        <router-link to="/projects" title="Projects">
          <span class="lt-md:hidden projectMove"
            ><span style="--delay: 0s">P</span><span style="--delay: 0.1s">r</span
            ><span style="--delay: 0.2s">o</span><span style="--delay: 0.3s">j</span
            ><span style="--delay: 0.4s">e</span><span style="--delay: 0.5s">c</span
            ><span style="--delay: 0.6s">t</span
            ><span style="--delay: 0.7s">s</span></span
          >
          <div i-bi:display class="md:hidden iconMove" />
        </router-link>
        <a
          href="https://github.com/Simon-He95/directory-configuration"
          target="_blank"
          title="Config"
          class="lt-md:hidden"
        >
          <div i-ri-sticky-note-line />
        </a>
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
  color: var(--color);
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
</style>
