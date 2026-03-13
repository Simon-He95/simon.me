<script setup lang="ts">
import { VividTyping as BaseVividTyping } from 'vivid-typing'
import { computed, onMounted, ref, useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()
const mounted = ref(false)

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

onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <component :is="BaseVividTyping" v-if="mounted" v-bind="attrs" />
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
