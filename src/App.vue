<template>
  <NavBar />
  <main class="px-7 py-10" overflow-x-hidden>
    <router-view />
    <Footer />
  </main>
</template>

<script setup lang="ts">
const props = defineProps(["foo", "bar"]);
useHead({
  meta: [
    { property: "og:title", content: "Simon He" },
    { property: "og:image", content: "/black.png" },
    { name: "description", content: "Simon He's Portfolio" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:creator", content: "@simon_he1995" },
  ],
});
</script>
