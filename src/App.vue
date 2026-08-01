<script setup lang="ts">
import type { Song } from 'vue3-music-player'
import { useEventListener } from '@vueuse/core'
import { defineAsyncComponent, ref, shallowRef } from 'vue'

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

const LazyMusicPlayer = defineAsyncComponent({
  loader: () => import('./components/LazyMusicPlayer.vue'),
  suspensible: false,
})

const playlist = shallowRef<Song[]>([])
const playlistLoaded = ref(false)
const showMusicPlayer = ref(false)
const musicLoading = ref(false)
const showBackToTop = ref(false)
let playlistHydrationPromise: Promise<void> | undefined

async function ensureMusicPlayerVisible() {
  if (showMusicPlayer.value || musicLoading.value)
    return

  musicLoading.value = true

  try {
    const [, playlistMod] = await Promise.all([
      import('./components/LazyMusicPlayer.vue'),
      import('./data/playlist'),
    ])

    if (!playlistLoaded.value) {
      playlist.value = playlistMod.createBasePlaylist()
      playlistLoaded.value = true
    }

    showMusicPlayer.value = true
    playlistHydrationPromise ||= playlistMod.hydrateLyrics(playlist.value).then((next) => {
      playlist.value = [...next]
    })
  }
  finally {
    musicLoading.value = false
  }
}

function scrollToTop() {
  if (isClient)
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

if (isClient) {
  useEventListener(window, 'scroll', () => {
    showBackToTop.value = window.scrollY > 600
  }, { passive: true })
}
</script>

<template>
  <NavBar />
  <main :class="$route.path === '/' ? 'home-main' : 'site-content px-7 py-10'" overflow-x-hidden>
    <router-view v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" v-if="$route.path === '/'" />
      </KeepAlive>
      <component :is="Component" v-if="$route.path !== '/'" />
    </router-view>
  </main>
  <Footer v-if="$route.path !== '/'" />

  <button
    v-if="$route.path !== '/' && showBackToTop"
    type="button"
    class="back-to-top"
    aria-label="Back to top"
    title="Back to top"
    @click="scrollToTop"
  >
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m6 14 6-6 6 6" />
    </svg>
  </button>

  <button
    v-if="$route.path !== '/' && !showMusicPlayer"
    type="button"
    :disabled="musicLoading"
    class="music-toggle"
    aria-label="Music"
    title="Music"
    @click="ensureMusicPlayerVisible"
  >
    <span v-if="!musicLoading" class="i-carbon:music" aria-hidden="true" />
    <span v-else class="i-carbon:circle-dash" aria-hidden="true" />
  </button>

  <LazyMusicPlayer v-if="$route.path !== '/' && showMusicPlayer && playlistLoaded" :playlist="playlist" />
</template>

<style>
.home-main {
  min-height: 100dvh;
}

.site-content {
  min-height: calc(100dvh - 10rem);
}

.back-to-top,
.music-toggle {
  position: fixed;
  right: 1.25rem;
  z-index: 10;
  display: grid;
  width: 2.6rem;
  height: 2.6rem;
  place-items: center;
  border: 1px solid rgba(125, 125, 125, 0.24);
  border-radius: 0.7rem;
  background: color-mix(in srgb, var(--c-bg) 82%, transparent);
  color: currentColor;
  backdrop-filter: blur(14px);
  cursor: pointer;
  transition: border-color 180ms ease, transform 180ms ease;
}

.back-to-top {
  bottom: 5rem;
}

.music-toggle {
  bottom: 1.5rem;
}

.back-to-top:hover,
.music-toggle:hover {
  border-color: rgba(125, 125, 125, 0.5);
  transform: translateY(-2px);
}

.back-to-top:active,
.music-toggle:active {
  transform: translateY(0) scale(0.98);
}

.back-to-top:focus-visible,
.music-toggle:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}

.back-to-top svg {
  width: 1.1rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}
</style>
