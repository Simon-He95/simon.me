<script setup lang="ts">
const slots = useSlots();
let content = slots.default()[0].children;
const types = ref("");
const { interval = 20 } = useAttrs();
function updateContext(t) {
  return dfs();
  function dfs() {
    if (content[0] === "\\" && content[1] === "n") {
      types.value += " \n ";
      content = content.slice(2);
      return dfs();
    }
    types.value += content[0];
    content = content.slice(1);
    if (content.length !== 0) {
      setTimeout(() => dfs(), t);
    }
  }
}
updateContext(interval);
</script>

<template>
  <div whitespace-pre-line>{{ types }}</div>
</template>

<style scoped></style>
