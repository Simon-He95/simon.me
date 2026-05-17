<script setup lang="ts">
import type { Component } from 'vue'
import { computed, onMounted, shallowRef, useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()
const BaseVividTyping = shallowRef<Component | null>(null)

const fallbackAttrs = computed(() => ({
  class: attrs.class,
  style: attrs.style,
}))

const fallbackHtml = computed(() => {
  const raw = attrs.content
  if (typeof raw !== 'string')
    return ''

  return raw
    .replaceAll('<%', '')
    .replaceAll('%>', '')
    .replaceAll('\n', '<br>')
})

onMounted(async () => {
  BaseVividTyping.value = await import('vivid-typing').then(mod => mod.VividTyping)
})
</script>

<template>
  <component :is="BaseVividTyping" v-if="BaseVividTyping" v-bind="attrs" />
  <span
    v-else
    v-bind="fallbackAttrs"
    class="safe-vivid-typing"
    v-html="fallbackHtml"
  />
</template>

<style scoped>
.safe-vivid-typing {
  white-space: pre-wrap;
}
</style>
