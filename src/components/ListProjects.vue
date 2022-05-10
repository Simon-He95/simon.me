<script setup lang="ts">
defineProps<{ projects: Record<string, any[]> }>();
</script>

<template>
  <div class="prose m-auto mb-8">
    <h1 class="mb-0">Projects</h1>
    <p class="opacity-50 !-mt-6 italic">List of projects that I am proud of</p>
  </div>
  <template v-for="key in Object.keys(projects)" :key="key">
    <h4 class="mt-10 font-bold">
      {{ key }}
    </h4>
    <div class="project-grid py-2 -mx-3 gap-2">
      <a
        v-for="(item, idx) in projects[key]"
        :key="idx"
        class="item relative flex items-center"
        :href="item.link"
        target="_blank"
        :class="!item.link ? 'opacity-0 pointer-events-none h-0 -mt-8 -mb-4' : ''"
        :title="item.name"
      >
        <div v-if="item.icon" class="pt-2 pr-5">
          <div class="text-3xl opacity-50" :class="item.icon || 'i-carbon-unknown'" />
        </div>
        <div class="flex-auto">
          <div cla ss="text-normal">{{ item.name }}</div>
          <div class="desc text-sm opacity-50 font-normal" v-html="item.desc" />
        </div>
      </a>
    </div>
  </template>
  <div class="prose m-auto mt-8 mb-8">
    <a href="/" class="font-mono no-underline opacity-50 hover:opacity-75"> cd .. </a>
  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.project-grid a.item {
  padding: 0.8em 1em;
  background: transparent;
  font-size: 1.1rem;
}

.project-grid a.item:hover {
  background: #88888808;
}
</style>
