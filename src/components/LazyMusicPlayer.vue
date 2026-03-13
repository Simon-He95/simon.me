<script setup lang="ts">
import MusicPlayer from 'vue3-music-player'
import 'vue3-music-player/index.css'
import 'vue3-music-player/tailwind.css'

defineProps<{
  playlist: unknown[]
}>()
</script>

<template>
  <MusicPlayer v-bind="$attrs" :playlist="playlist" />
</template>
