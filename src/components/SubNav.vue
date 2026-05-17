<script setup lang="ts">
import { useRoute } from 'vue-router'
import { isZh } from '../../lang'
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
      {{ isZh ? '只看英文' : 'English Only' }}
    </button>

    <div mb-0 flex="~ gap-3" text-3xl>
      <router-link
        to="/posts"
        class="!border-none !font-400"
        :class="route.path === '/posts' ? '' : inactiveStyle"
      >
        {{ isZh ? '博客' : 'Blog' }}
      </router-link>
      <router-link
        to="/talks"
        class="!border-none !font-400"
        :class="route.path === '/talks' ? '' : inactiveStyle"
      >
        {{ isZh ? '分享' : 'Talks' }}
      </router-link>
      <router-link
        to="/projects"
        class="!border-none !font-400"
        :class="route.path === '/projects' ? '' : inactiveStyle"
      >
        {{ isZh ? '项目' : 'Projects' }}
      </router-link>
      <router-link
        to="/friends"
        class="!border-none !font-400"
        :class="route.path === '/friends' ? '' : inactiveStyle"
      >
        {{ isZh ? '朋友' : 'Friends' }}
      </router-link>
    </div>
  </div>
</template>
