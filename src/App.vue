<script setup lang="ts">
useHead({
  meta: [
    { property: "og:title", content: "Simon He" },
    { property: "og:image", content: "/black.png" },
    { name: "description", content: "Simon He's Portfolio" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:creator", content: "@simon_he1995" },
  ],
});

import { ref, onMounted } from "vue";
import { DotTextCanvas } from "simon-js-tool";
const dotText = new DotTextCanvas("China", 20, "rgb(187, 187, 187)", 10);
const el = ref(null);
onMounted(() => {
  el.value?.appendChild(dotText.canvas);
});
</script>

<template>
  <span ref="el" fixed bottom-5 right-0></span>
  <NavBar />
  <main class="px-7 py-10" overflow-x-hidden>
    <router-view />
    <Footer />
    <Levitation />
  </main>
</template>
