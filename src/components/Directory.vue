<script setup lang="ts">
defineProps({
  lists: Object,
})
</script>

<template>
  <a
    v-for="(value, key, i) in lists"
    :key="key"
    flex
    items-center
    justify-between
    p-x-5
    p-y-2
    :href="`#${key.toLowerCase()}`"
    alt="22"
    style="-webkit-tap-highlight-color: rgba(255, 255, 255, 0)"
  >
    <div class="title" text-xl color="--fg-deep" font-bold flex items-center font-serif>
      <span m-r-10 text-3xl write-vertical-right font-mono>{{
        i < 10 ? `0${i}` : i
      }}</span>{{ key }}
    </div>
    <div class="des" text-xs color="--fg" font-mono lt-md:hidden>
      {{ value }}
    </div>
  </a>
</template>

<style scoped></style>
