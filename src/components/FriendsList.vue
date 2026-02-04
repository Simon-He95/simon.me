<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { isDark } from '~/logics'
import Avatars from './avatar'

interface Friend {
  name: string
  avatar: string
  blog: string
  description?: string
  tag?: string
}

const friends: Friend[] = [
  {
    name: 'Simon He',
    avatar: Avatars.simon,
    blog: 'https://www.simonhe.me/',
    description: 'core member of unocss and vue vine, webview-use author',
    tag: 'Front-end development, Open source',
  },
  {
    name: 'Anthony Fu',
    avatar: 'https://github.com/antfu.png',
    blog: 'https://antfu.me/',
    description: 'A ship in harbor is safe, but that is not what ships are built for.',
    tag: 'Front-end development, nuxt, unocss, vueuse, slidev, vitest, shikiji',
  },
  {
    name: 'Doctor Wu',
    avatar: 'https://github.com/Doctor-wu.png',
    blog: 'https://doctorwu.me/',
    description: 'An open source enthusiast',
    tag: 'Core team member of Vue Vapor and Vue Core',
  },
  {
    name: 'Innei',
    avatar: 'https://github.com/innei.png',
    blog: 'https://innei.in/friends',
    description: 'Future core members of Next',
    tag: 'Zolplay, Next master',
  },
  {
    name: '小孙同学',
    avatar: 'https://blog.guoqi.dev/favicon.ico',
    blog: 'https://blog.sunguoqi.com',
    description: 'Peace & Love',
    tag: 'Front-end development',
  },
  {
    name: 'wooc',
    avatar: 'https://wooc.top/favicon.ico',
    blog: 'http://wooc.top/',
    description: 'A developer who loves code.',
    tag: 'Developer',
  },
  {
    name: 'lijialiang',
    avatar: 'https://lijialiang.dev/favicon.svg',
    blog: 'https://lijialiang.dev/',
    description: 'Code Worker',
    tag: 'Full-Stack development',
  },
  {
    name: 'Opacity',
    avatar: 'https://avatars.githubusercontent.com/u/70315161?v=4',
    blog: 'http://opacity.ink',
    description: 'As bystanders, changing opacity is my sole recourse.',
    tag: 'Developer',
  },
  {
    name: 'Oliver',
    avatar: 'https://avatars.githubusercontent.com/u/31796988?v=4',
    blog: 'https://blog.aolifu.org/',
    description: '',
    tag: 'Developer',
  },
  {
    name: '_geekris1',
    avatar: 'https://raw.githubusercontent.com/geekris1/geekris1.me/master/public/icon.jpg',
    blog: 'https://www.thez.cc/',
    description: 'Excel at chatting more than coding.',
    tag: 'Developer',
  },
  {
    name: 'Cee cc',
    avatar: 'https://zqqcee.github.io/_astro/avatar.DE2TqBIA.jpeg',
    blog: 'https://zqqcee.github.io/',
    description: 'Everything comes in a big package "📦"',
    tag: 'FE dev',
  },
  {
    name: '前端之虎陈随易',
    avatar: 'https://me.yicode.tech/logo.jpg',
    blog: 'https://me.yicode.tech/',
    description: '前端顶级专家、农村程序员、车上码农、自由职业者、独立开发者、个人创业者、开源大师、前端之虎陈随易',
    tag: '独立开发者',
  },
  {
    name: 'WangDefou',
    avatar: 'https://static.gridea.dev/b5116d45-87d1-4dbf-9ebb-455bf29b865f/Q2OvwU5er.jpg',
    blog: 'https://wangpangzier.com/',
    description: 'Actions are far more important than answers.',
    tag: 'ESTJ, 10年老运营',
  },
  {
    name: 'Tian Yuhao',
    avatar: 'https://avatars.githubusercontent.com/u/73180970?v=4',
    blog: 'https://tianyuhao.cn/',
    description: '最怕你一生碌碌无为，还安慰自己平凡可贵。',
    tag: 'Developer',
  },
  {
    name: 'Kai',
    avatar: 'https://avatars.githubusercontent.com/u/44634134?v=4',
    blog: 'https://kaiyi.cool/',
    description: 'I love to experiment with new technologies and leverage them to solve real-life problems or just for fun.',
    tag: 'Front-end developer, Microsoft',
  },
  {
    name: 'Sugar',
    avatar: 'https://avatars.githubusercontent.com/u/42485491?s=48&v=4',
    blog: 'https://sugarat.top/',
    description: 'Your fingertips have the power to change the world.',
    tag: 'Front-end developer, Meituan',
  },
  {
    name: '于长野',
    avatar: 'https://avatars.githubusercontent.com/u/34543831',
    blog: 'https://t.co/MQH8nT5ono',
    description: '做一个自由自在的废物。',
    tag: 'Full-Stack development',
  },
  {
    name: 'Richard Zhang',
    avatar: 'https://avatars.githubusercontent.com/u/76982270?v=4',
    blog: 'https://richard-docs.netlify.app/',
    description: 'Don\'t just daydream, to do it',
    tag: 'Front-end developer',
  },
  {
    name: 'Kuizuo',
    avatar: 'https://kuizuo.cn/img/logo.png',
    blog: 'https://kuizuo.cn',
    description: 'The road is long, but keep going you will arrive.',
    tag: 'Typescripter',
  },
  {
    name: 'Licodeao',
    avatar: 'https://avatars.githubusercontent.com/u/81912331?v=4',
    blog: 'https://t.co/f0fH6gBQJC',
    description: 'The water flows incessantly, without vying for precedence.',
    tag: 'Full-stack Developer & Rustacean',
  },
  {
    name: 'Doiiars',
    avatar: 'https://pbs.twimg.com/profile_images/1715358170082926592/g8UJWqK6_400x400.jpg',
    blog: 'https://notion.doiiars.com/',
    description: '阅读、编程、生活',
    tag: '寻求自我实现的人',
  },
  {
    name: 'Wei Jun',
    avatar: 'https://github.com/weijunext.png',
    blog: 'https://weijunext.com/',
    description: '前端工程师，全栈实践者，AI降临派',
    tag: 'Developer',
  },
  {
    name: 'Sankyu',
    avatar: 'https://github.com/sankyutang.png',
    blog: 'https://sankyu.me/',
    description: '网名三桥，80后程序员，互联网第一批原住民，亲身经历过互联网任何一个阶段。从2000年开始接触编程，做过网络工程师，做过Java工程师，目前专注于前端技术领域的发展',
    tag: '正在实践线上课程和独立产品的全栈开发者',
  },
  {
    name: 'XiuerOld',
    avatar: 'https://hundren.github.io/head.png',
    blog: 'https://hundren.github.io/',
    description: 'Front-end Developer',
    tag: 'Just do IT!',
  },
  {
    name: 'Daydreamer-riri',
    avatar: 'https://github.com/Daydreamer-riri.png',
    blog: 'https://daydreamer-riri.me/',
    description: 'Stay gold, pony boy',
    tag: 'Front-end Developer',
  },
  {
    name: 'Berlin',
    avatar: 'https://github.com/childrentime.png',
    blog: 'https://lianwenwu.me/',
    description: 'Positive man🤪',
    tag: 'Full-stack Developer',
  },
  {
    name: 'JounQin',
    avatar: 'https://github.com/JounQin.png',
    blog: 'https://www.1stg.me/',
    description: 'Write Less, Think More.',
    tag: 'Full-stack Developer',
  },
  {
    name: 'auula',
    avatar: 'https://github.com/auula.png',
    blog: 'https://t.co/3fyqesKYVd',
    description: 'The best way to predict the future is to invent it！',
    tag: 'Full-stack Developer',
  },
  {
    name: 'ikkkp',
    avatar: 'https://github.com/ikkkp.png',
    blog: 'http://hzlssb.com/',
    description: 'Life is nothing but love and freedom.',
    tag: 'Front-end Developer',
  },
  {
    name: 'CaptainOfPhB',
    avatar: 'https://captainofphb.me/_astro/avatar.ke_icKou_Z23JjR9.webp',
    blog: 'https://captainofphb.me/',
    description: '船长の部落格，记录有趣的事，分享技术经验',
    tag: 'Front-end Developer',
  },
  {
    name: 'Tabing Wang',
    avatar: 'https://2.gravatar.com/avatar/e11ccb84abd9dd99a4f870836da25e193ce79e01edbf94bcc4bf2d4500439082?size=512',
    blog: 'https://abinea.top/',
    description: 'INTP，保持好奇心，持续前进。',
    tag: 'Front-end Developer',
  },
  {
    name: 'QER',
    avatar: 'https://www.qer.im/assets/xiaoxiang.jpeg',
    blog: 'https://www.qer.im/',
    description: '前端开发，并且会一些图像处理和音视频算法；全栈也能做，总要实现自己的天马行空',
    tag: 'Web Developer | Oler',
  },
  {
    name: 'Chris Kang',
    avatar: 'https://kangchainx.github.io/assets/avatar/x.jpeg',
    blog: 'https://kangchainx.com/zh',
    description: 'Code anywhere, seek everywhere.',
    tag: 'Full-stack developer. Coding with AI',
  },
]

const rootEl = ref<HTMLElement | null>(null)
const proseEl = ref<HTMLElement | null>(null)

const query = ref('')
const loadedImages = reactive(new Set<string>())
const sponsorLoaded = ref(false)

const filteredFriends = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q)
    return friends

  return friends.filter((f) => {
    const hay = `${f.name}\n${f.tag ?? ''}\n${f.description ?? ''}`.toLowerCase()
    return hay.includes(q)
  })
})

function markImageLoaded(src: string) {
  loadedImages.add(src)
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  }
  catch {
    return url
  }
}

onMounted(() => {
  proseEl.value = rootEl.value?.closest('.prose') as HTMLElement | null
  proseEl.value?.classList.add('friends-prose-wide')
})

onBeforeUnmount(() => {
  proseEl.value?.classList.remove('friends-prose-wide')
})
</script>

<template>
  <div ref="rootEl" class="friends-root">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div class="min-w-0">
        <div class="flex items-center gap-3">
          <div class="friends-badge" :class="isDark ? 'friends-badge--dark' : ''">
            <span class="i-carbon:connection-signal" aria-hidden="true" />
          </div>
          <div class="min-w-0">
            <div class="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Friends
            </div>
            <div class="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {{ filteredFriends.length }} / {{ friends.length }}
            </div>
          </div>
        </div>
        <p class="mt-3 max-w-160 text-sm text-slate-600 dark:text-slate-300">
          Some great people and their corners on the internet.
        </p>
      </div>

      <div class="w-full sm:w-92">
        <div class="friends-search" :class="isDark ? 'friends-search--dark' : ''">
          <span class="i-carbon:search text-lg opacity-70" aria-hidden="true" />
          <input
            v-model="query"
            class="friends-search__input"
            :class="isDark ? 'friends-search__input--dark' : ''"
            type="search"
            placeholder="Search name / tag / description"
            autocomplete="off"
          >
          <button
            v-if="query.trim()"
            type="button"
            class="friends-search__clear"
            :class="isDark ? 'friends-search__clear--dark' : ''"
            aria-label="Clear search"
            @click="query = ''"
          >
            <span class="i-carbon:close" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <div class="friends-masonry mt-6">
      <a
        v-for="friend in filteredFriends"
        :key="friend.name"
        class="friend-card group"
        :href="friend.blog"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="flex items-start gap-4">
          <div class="friend-avatar">
            <img
              :src="friend.avatar"
              :alt="friend.name"
              class="friend-avatar__img"
              :class="{ 'is-loaded': loadedImages.has(friend.avatar) }"
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
              @load="markImageLoaded(friend.avatar)"
              @error="markImageLoaded(friend.avatar)"
            >
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                  {{ friend.name }}
                </div>
                <div class="mt-1 flex flex-wrap items-center gap-2">
                  <span v-if="friend.tag" class="friend-pill">
                    {{ friend.tag }}
                  </span>
                  <span class="text-xs text-slate-400 dark:text-slate-500">
                    {{ hostOf(friend.blog) }}
                  </span>
                </div>
              </div>

              <span class="i-carbon:arrow-up-right text-lg opacity-40 transition-opacity group-hover:opacity-80" aria-hidden="true" />
            </div>

            <p class="friend-desc mt-3 text-sm text-slate-600 dark:text-slate-300">
              {{ friend.description?.trim() || '—' }}
            </p>
          </div>
        </div>
      </a>
    </div>

    <div class="mt-10 rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40">
      <div class="flex items-center justify-between gap-4">
        <div>
          <div class="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Sponsors
          </div>
          <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Thank you for keeping this site running.
          </div>
        </div>
        <span class="i-carbon:favorite-filled text-2xl text-rose-500/80" aria-hidden="true" />
      </div>

      <a
        class="mt-5 block overflow-hidden rounded-xl border border-slate-200/70 bg-white/70 dark:border-slate-700/60 dark:bg-slate-950/20"
        href="https://cdn.jsdelivr.net/gh/Simon-He95/sponsor/sponsors_circle.svg"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          class="mx-auto block max-w-full p-4 sponsor-img"
          :class="{ 'is-loaded': sponsorLoaded }"
          src="https://cdn.jsdelivr.net/gh/Simon-He95/sponsor/sponsors_circle.svg"
          alt="Sponsors"
          loading="lazy"
          decoding="async"
          referrerpolicy="no-referrer"
          @load="sponsorLoaded = true"
          @error="sponsorLoaded = true"
        >
      </a>
    </div>
  </div>
</template>

<style>
.friends-prose-wide {
  max-width: min(1100px, 92%) !important;
}

@media screen and (max-width: 1024px) {
  .friends-prose-wide {
    max-width: 100% !important;
  }
}
</style>

<style scoped>
.friends-badge {
  display: inline-flex;
  height: 2.2rem;
  width: 2.2rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(180deg, rgba(20, 184, 166, 0.18), rgba(20, 184, 166, 0.06));
  color: rgba(13, 148, 136, 0.9);
}

.friends-badge--dark {
  border-color: rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, rgba(45, 212, 191, 0.2), rgba(45, 212, 191, 0.06));
  color: rgba(94, 234, 212, 0.9);
}

.friends-search {
  display: flex;
  height: 2.75rem;
  align-items: center;
  gap: 0.55rem;
  border-radius: 1rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.92);
  padding: 0 0.75rem;
}

.friends-search--dark {
  border-color: rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.72);
}

.friends-search__input {
  width: 100%;
  appearance: none;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: rgba(15, 23, 42, 0.92);
}

.friends-search__input::placeholder {
  color: rgba(100, 116, 139, 0.9);
}

.friends-search__input--dark {
  color: rgba(248, 250, 252, 0.92);
}

.friends-search__input--dark::placeholder {
  color: rgba(148, 163, 184, 0.85);
}

.friends-search__clear {
  display: inline-flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  border: 1px solid transparent;
  background: rgba(15, 23, 42, 0.04);
  color: rgba(15, 23, 42, 0.75);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.friends-search__clear:hover {
  background: rgba(15, 23, 42, 0.06);
}

.friends-search__clear--dark {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(226, 232, 240, 0.9);
}

.friends-search__clear--dark:hover {
  background: rgba(255, 255, 255, 0.12);
}

.friends-masonry {
  column-gap: 1.25rem;
  column-count: 1;
}

@media (min-width: 640px) {
  .friends-masonry {
    column-count: 2;
  }
}

@media (min-width: 1024px) {
  .friends-masonry {
    column-count: 3;
  }
}

.friend-card {
  position: relative;
  display: inline-block;
  width: 100%;
  margin: 0 0 1.25rem;
  contain: layout paint;
  font-weight: 400;
  color: inherit;
  border-radius: 1.25rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.9));
  padding: 1.25rem;
  text-decoration: none;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  box-shadow: 0 10px 24px -18px rgba(2, 6, 23, 0.3);
  break-inside: avoid;
}

.friend-card:hover {
  transform: translateY(-3px);
  border-color: rgba(20, 184, 166, 0.45);
  box-shadow: 0 22px 40px -22px rgba(13, 148, 136, 0.45);
}

:global(.dark) .friend-card {
  border-color: rgba(51, 65, 85, 0.6);
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.82), rgba(2, 6, 23, 0.6));
  box-shadow: 0 14px 30px -18px rgba(0, 0, 0, 0.65);
}

:global(.dark) .friend-card:hover {
  border-color: rgba(45, 212, 191, 0.35);
  box-shadow: 0 24px 48px -24px rgba(45, 212, 191, 0.28);
}

.friend-avatar {
  flex: none;
  height: 3.25rem;
  width: 3.25rem;
  border-radius: 1.15rem;
  padding: 2px;
  background: linear-gradient(135deg, rgba(20, 184, 166, 0.45), rgba(59, 130, 246, 0.35));
}

.friend-avatar__img {
  height: 100%;
  width: 100%;
  margin-top:10px;
  margin-left:10px;
  border-radius: 1.05rem;
  object-fit: cover;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
}

:global(.dark) .friend-avatar__img {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.friend-pill {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
  font-size: 0.72rem;
  line-height: 1.1rem;
  background: rgba(15, 23, 42, 0.05);
  color: rgba(71, 85, 105, 0.95);
}

:global(.dark) .friend-pill {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(226, 232, 240, 0.9);
}

.friend-desc {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.friend-avatar__img,
.sponsor-img {
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.12), rgba(148, 163, 184, 0.22), rgba(148, 163, 184, 0.12));
  background-size: 240% 100%;
  animation: shimmer 1.1s linear infinite;
}

.sponsor-img {
  will-change: transform;
  transform: translateZ(0);
}

.friend-avatar__img.is-loaded,
.sponsor-img.is-loaded {
  animation: none;
  background: rgba(148, 163, 184, 0.12);
}

:global(.dark) .friend-avatar__img,
:global(.dark) .sponsor-img {
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.08), rgba(148, 163, 184, 0.16), rgba(148, 163, 184, 0.08));
}

@keyframes shimmer {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .friend-avatar__img,
  .sponsor-img {
    animation: none;
  }
  .friend-card {
    transition: none;
  }
}

@supports ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
  @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
    .friends-search {
      background: rgba(255, 255, 255, 0.72);
    }

    .friends-search--dark {
      background: rgba(2, 6, 23, 0.36);
    }

    .friend-card {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(255, 255, 255, 0.6));
    }

    :global(.dark) .friend-card {
      background: linear-gradient(180deg, rgba(2, 6, 23, 0.45), rgba(2, 6, 23, 0.28));
    }
  }
}
</style>
