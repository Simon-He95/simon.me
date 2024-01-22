<script setup lang="ts">
import { useRoute } from 'vue-router'
import { englishOnly } from '../logics'

const inactiveStyle = 'opacity-20 hover:opacity-50'

const route = useRoute()
</script>

<template>
  <div class="prose m-auto mb-8 select-none">
    <button
      v-if="route.path === '/posts'"
      flex="~ gap1"
      items-center
      mb2
      op30
      text-xs
      @click="englishOnly = !englishOnly"
    >
      <div :i="englishOnly ? 'carbon-checkbox-checked' : 'carbon-checkbox'" />
      English Only
    </button>

    <div mb-0 flex="~ gap-3" text-3xl>
      <router-link
        to="/posts"
        class="!border-none !font-400"
        :class="route.path === '/posts' ? '' : inactiveStyle"
      >
        Blog
      </router-link>
      <router-link
        to="/talks"
        class="!border-none !font-400"
        :class="route.path === '/talks' ? '' : inactiveStyle"
      >
        Talks
      </router-link>
      <router-link
        to="/projects"
        class="!border-none !font-400"
        :class="route.path === '/projects' ? '' : inactiveStyle"
      >
        Projects
      </router-link>
      <router-link
        to="/friends"
        class="!border-none !font-400"
        :class="route.path === '/friends' ? '' : inactiveStyle"
      >
        Friends
      </router-link>
    </div>
  </div>
</template>
