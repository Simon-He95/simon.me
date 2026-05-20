<script setup lang="ts">
import { useRouter } from 'vue-router'
import { englishOnly, formatDate } from '~/logics'

const props = defineProps<{
  type?: string
  posts?: Post[]
}>()

export interface Post {
  path: string
  title: string
  date: string
  lang?: string
  duration?: string
}

interface RouteFrontmatter {
  title?: string
  date?: string
  lang?: string
  duration?: string
  type?: string
}

const router = useRouter()
const routes: Post[] = router
  .getRoutes()
  .filter(i => i.path.startsWith('/posts') && !i.path.endsWith('.html'))
  .map((i) => {
    const frontmatter = i.meta.frontmatter as RouteFrontmatter | undefined

    if (!frontmatter?.date || frontmatter.type !== props.type)
      return null

    return {
      path: i.path,
      title: frontmatter.title || i.path,
      date: frontmatter.date,
      lang: frontmatter.lang,
      duration: frontmatter.duration,
    }
  })
  .filter((i): i is Post => !!i)
  .sort((a, b) => +new Date(b.date) - +new Date(a.date))
const posts = computed(() =>
  (props.posts || routes).filter(i => !englishOnly.value || i.lang !== 'zh'),
)
</script>

<template>
  <ul>
    <template v-if="!posts.length">
      <div py2 op50>
        { nothing here yet }
      </div>
    </template>
    <app-link
      v-for="route in posts"
      :key="route.path"
      class="item block font-normal mb-6 mt-2 no-underline"
      :to="route.path"
      :title="route.title"
    >
      <li class="no-underline">
        <div class="title text-lg">
          {{ route.title }}
          <sup
            v-if="route.lang === 'zh'"
            class="text-xs border border-current rounded px-1 pb-0.2"
          >中文</sup>
        </div>
        <div class="time opacity-50 text-sm -mt-1">
          {{ formatDate(route.date) }}
          <span v-if="route.duration" class="opacity-50">· {{ route.duration }}</span>
        </div>
      </li>
    </app-link>
  </ul>
</template>

<style scoped>
.item {
  content-visibility: auto;
  contain-intrinsic-size: 88px;
}
</style>
