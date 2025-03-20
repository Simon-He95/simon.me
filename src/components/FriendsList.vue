<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useResizeObserver } from 'lazy-js-utils'
import Avatars from './avatar'
import { isDark } from '~/logics'
const friends = [
  {
    name: 'Simon He',
    avatar: Avatars.simon,
    blog: 'https://simonhe.me/',
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
    blog: 'qer.im',
    description: '前端开发，并且会一些图像处理和音视频算法；全栈也能做，总要实现自己的天马行空',
    tag: 'Web Developer | Oler',
  },
]

const friends1 = ref<any>([])
const friends2 = ref<any>([])
const friends3 = ref<any>([])

onMounted(() => {
  const prose = document.querySelector('article > .prose')!
  useResizeObserver((width) => {
    updateFriends(width)
    nextTick(() => {
      const figure = document.querySelectorAll('figure')
      figure?.forEach(f => f.style.setProperty('--border-color', isDark.value ? 'rgb(220 252 231 / 0.5)' : 'rgb(20 184 166 / 0.5)'))
    })
  })
  const w = window.innerWidth
  updateFriends(w)
  prose.classList.add('whole-width')
  nextTick(() => {
    const figure = document.querySelectorAll('figure')
    figure?.forEach(f => f.style.setProperty('--border-color', isDark.value ? 'rgb(220 252 231 / 0.5)' : 'rgb(20 184 166 / 0.5)'))
  })
})

function updateFriends(width) {
  if (width >= 1024) {
    // 变成 3 列
    const i = Math.ceil(friends.length / 3)
    friends1.value = friends.slice(0, i)
    const ii = Math.ceil((friends.length - i) / 2)
    friends2.value = friends.slice(i, i + ii)
    friends3.value = friends.slice(i + ii)
  }
  else if (width >= 640) {
    // 变成 2 列
    const i = Math.ceil(friends.length / 2)
    friends1.value = friends.slice(0, i)
    friends2.value = friends.slice(i)
  }
  else {
    // 变成 1 列
    friends1.value = friends
  }
}
onBeforeUnmount(() => {
  const prose = document.querySelector('article > .prose')!
  prose.classList.remove('whole-width')
})
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <ul class="space-y-8">
        <li v-for="friend in friends1" :key="friend.name" class="text-sm leading-6 hover:scale-[103%]">
          <figure
            :class="[isDark ? 'dark:bg-dark-800' : 'dark:bg-slate-800']"
            class="relative flex flex-col-reverse bg-slate-50 hover:rounded-2xl p-6  dark:highlight-white/5"
          >
            <blockquote class="mt-6 text-slate-700 dark:text-slate-300">
              <p xt-marked="ok">
                {{ friend.description }}
              </p>
            </blockquote>
            <figcaption class="flex items-center space-x-4">
              <img
                :src="friend.avatar" alt="" class="flex-none w-14 h-14 rounded-full object-cover" loading="lazy"
                decoding="async"
              >
              <div class="flex-auto">
                <div class="text-base text-slate-900 font-semibold dark:text-slate-300">
                  <a :href="friend.blog" tabindex="0"><span class="absolute inset-0" />{{ friend.name }}</a>
                </div>
                <div class="mt-0.5">
                  {{ friend.tag }}
                </div>
              </div>
            </figcaption>
          </figure>
        </li>
      </ul>
      <ul class="space-y-8 hidden sm:block">
        <li v-for="friend in friends2" :key="friend.name" class="text-sm leading-6 hover:scale-[103%]">
          <figure
            :class="[isDark ? 'dark:bg-dark-800' : 'dark:bg-slate-800']"
            class="relative flex flex-col-reverse bg-slate-50 hover:rounded-2xl p-6 duration-10 dark:highlight-white/5"
          >
            <blockquote class="mt-6 text-slate-700 dark:text-slate-300">
              <p xt-marked="ok">
                {{ friend.description }}
              </p>
            </blockquote>
            <figcaption class="flex items-center space-x-4">
              <img
                :src="friend.avatar" alt="" class="flex-none w-14 h-14 rounded-full object-cover" loading="lazy"
                decoding="async"
              >
              <div class="flex-auto">
                <div class="text-base text-slate-900 font-semibold dark:text-slate-300">
                  <a :href="friend.blog" tabindex="0"><span class="absolute inset-0" />{{ friend.name }}</a>
                </div>
                <div class="mt-0.5">
                  {{ friend.tag }}
                </div>
              </div>
            </figcaption>
          </figure>
        </li>
      </ul>
      <ul class="space-y-8 hidden lg:block">
        <li v-for="friend in friends3" :key="friend.name" class="text-sm leading-6 hover:scale-[103%]">
          <figure
            :class="[isDark ? 'dark:bg-dark-800' : 'dark:bg-slate-800']"
            class="relative flex flex-col-reverse bg-slate-50 hover:rounded-2xl p-6  dark:highlight-white/5"
          >
            <blockquote class="mt-6 text-slate-700 dark:text-slate-300">
              <p xt-marked="ok">
                {{ friend.description }}
              </p>
            </blockquote>
            <figcaption class="flex items-center space-x-4">
              <img
                :src="friend.avatar" alt="" class="flex-none w-14 h-14 rounded-full object-cover" loading="lazy"
                decoding="async"
              >
              <div class="flex-auto">
                <div class="text-base text-slate-900 font-semibold dark:text-slate-300">
                  <a :href="friend.blog" tabindex="0"><span class="absolute inset-0" />{{ friend.name }}</a>
                </div>
                <div class="mt-0.5">
                  {{ friend.tag }}
                </div>
              </div>
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
    <div class="prose m-auto mt-8">
      <h1>Sponsors</h1>
    </div>
    <a href="https://cdn.jsdelivr.net/gh/Simon-He95/sponsor/sponsors_circle.svg">
      <img src="https://cdn.jsdelivr.net/gh/Simon-He95/sponsor/sponsors_circle.svg" mlauto mrauto>
    </a>
  </div>
</template>

<style>
.whole-width {
  max-width: 85% !important;
}

@media screen and (max-width: 1024px) {
  .whole-width {
    max-width: 100% !important;
  }
}
</style>

<style scoped>
:deep(article > .prose) {
  max-width: 100% !important;
}

.prose ul>li::before {
  display: none;
}

.prose ul {
  margin: 0;
}

.prose li {
  margin: 0
}

.prose figure {
  margin: 0;
}

.prose ul>li {
  padding: 0;
}

figure:hover img {
  transition: 0.4s ease-in-out;
  transform: scale(1.2) rotate3d(1, 0, 0, 360deg);
}

figure {
  transition: all .5s;
}

figure:hover::before {
  animation: clippath 3s infinite linear;
  border-radius: 1.1rem;
  border: 2px solid var(--border-color);
}

figure::before {
  content: "";
  tag: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;
}

@keyframes clippath {

  0%,
  100% {
    clip-path: inset(0 0 95% 0);
  }

  25% {
    clip-path: inset(0 95% 0 0);
  }

  50% {
    clip-path: inset(95% 0 0 0);
  }

  75% {
    clip-path: inset(0 0 0 95%);
  }
}
</style>
