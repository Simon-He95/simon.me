<script setup lang="ts">
import { isDark } from "~/logics";
import { ref, onMounted } from "vue";
import { DotTextCanvas } from "simon-js-tool";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
useHead({
  meta: [
    { property: "og:title", content: "Simon He" },
    { property: "og:image", content: "/black.png" },
    { name: "description", content: "Simon He's Portfolio" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:creator", content: "@simon_he1995" },
  ],
});
const text = ref("");
const dotText = new DotTextCanvas(text.value, 20, isDark.value ? "white" : "black", 10);
const el = ref(null);
onMounted(() => {
  el.value?.appendChild(dotText.canvas);
});
watch(isDark, update);
const router = useRouter();

const routerMap = {
  "/": "Simon",
  "/projects": "Projects",
  "/posts": "Blog",
};
watch(
  router.currentRoute,
  (val) => {
    text.value = routerMap[val.path] || "China";
    setTimeout(update);
  },
  {
    immediate: true,
  }
);

function update() {
  const newDotText = dotText.repaint(
    text.value,
    20,
    isDark.value ? "white" : "black",
    10
  );
  const child = el.value.childNodes[0];
  if (child) el.value?.replaceChild(newDotText.canvas, child);
}
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
