<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { isDark } from '~/logics'
const friends = [
  {
    name: 'Simon He',
    avatar: 'https://avatars.githubusercontent.com/u/57086651?v=4',
    blog: 'https://simonme.netlify.app/',
    description: 'core member of unocss and vue vine, webview-use author',
    position: 'Front-end development, Open source',
  },
  {
    name: 'Innei',
    avatar: 'https://innei.ren/api/v2/objects/avatar/d5obusvl8ihmamw5qu.png',
    blog: 'https://innei.in/friends',
    description: 'Future core members of Next',
    position: 'Zolplay, Next master',
  },
  {
    name: '小孙同学',
    avatar: 'https://blog.sunguoqi.com/images/avatar.jpg',
    blog: 'https://blog.sunguoqi.com',
    description: 'Peace & Love',
    position: 'Front-end development',
  },
  {
    name: 'wooc',
    avatar: 'https://wooc.top/favicon.ico',
    blog: 'http://wooc.top/',
    description: 'A developer who loves code.',
    position: 'Developer',
  },
  {
    name: 'lijialiang',
    avatar: 'https://lijialiang.dev/favicon.svg',
    blog: 'https://lijialiang.dev/',
    description: 'Code Worker',
    position: 'Full-Stack development',
  },
  {
    name: 'Opacity',
    avatar: 'https://avatars.githubusercontent.com/u/70315161?v=4',
    blog: 'http://opacity.ink',
    description: 'As bystanders, changing opacity is my sole recourse.',
    position: 'Developer',
  },
  {
    name: 'Oliver',
    avatar: 'https://avatars.githubusercontent.com/u/31796988?v=4',
    blog: 'https://blog.aolifu.org/',
    description: '',
    position: 'Developer',
  },
  {
    name: '_geekris1',
    avatar: 'https://raw.githubusercontent.com/geekris1/geekris1.me/master/public/icon.jpg',
    blog: 'https://www.thez.cc/',
    description: 'Excel at chatting more than coding.',
    position: 'Developer',
  },
  {
    name: 'Cee cc',
    avatar: 'https://zqqcee.github.io/images/avatar.jpeg',
    blog: 'https://zqqcee.github.io/',
    description: 'Everything comes in a big package "📦"',
    position: 'FE dev',
  },
  {
    name: '前端之虎陈随易',
    avatar: 'https://chensuiyi.com/logo.jpg',
    blog: 'https://chensuiyi.com/',
    description: '前端顶级专家、农村程序员、车上码农、自由职业者、独立开发者、个人创业者、开源大师、前端之虎陈随易',
    position: '独立开发者',
  },
  {
    name: 'WangDefou',
    avatar: 'https://static.gridea.dev/b5116d45-87d1-4dbf-9ebb-455bf29b865f/Q2OvwU5er.jpg',
    blog: 'https://wangpangzier.com/',
    description: 'Actions are far more important than answers.',
    position: 'ESTJ, 10年老运营',
  },
  {
    name: 'Tian Yuhao',
    avatar: 'https://avatars.githubusercontent.com/u/73180970?v=4',
    blog: 'https://tianyuhao.cn/',
    description: '最怕你一生碌碌无为，还安慰自己平凡可贵。',
    position: 'Developer',
  },
  {
    name: 'Kai',
    avatar: 'https://avatars.githubusercontent.com/u/44634134?v=4',
    blog: 'https://kaiyi.cool/',
    description: 'I love to experiment with new technologies and leverage them to solve real-life problems or just for fun.',
    position: 'Front-end developer, Microsoft',
  },
  {
    name: 'Sugar',
    avatar: 'https://avatars.githubusercontent.com/u/42485491?s=48&v=4',
    blog: 'https://sugarat.top/',
    description: 'Your fingertips have the power to change the world.',
    position: 'Front-end developer, Meituan',
  },
  {
    name: '于长野',
    avatar: 'https://avatars.githubusercontent.com/u/34543831',
    blog: 'https://t.co/MQH8nT5ono',
    description: '做一个自由自在的废物。',
    position: 'Full-Stack development',
  },
  {
    name: 'Richard Zhang',
    avatar: 'https://avatars.githubusercontent.com/u/76982270?v=4',
    blog: 'https://richard-docs.netlify.app/',
    description: 'Don\'t just daydream，to do it',
    position: 'Front-end developer',
  },
  {
    name: 'Kuizuo',
    avatar: 'https://kuizuo.cn/img/logo.png',
    blog: 'https://kuizuo.cn',
    description: 'The road is long, but keep going you will arrive.',
    position: 'Typescripter',
  },
  {
    name: 'Licodeao',
    avatar: 'https://avatars.githubusercontent.com/u/81912331?v=4',
    blog: 'https://t.co/f0fH6gBQJC',
    description: 'The water flows incessantly, without vying for precedence.',
    position: 'Full-stack developer & Rustacean',
  },
]
onMounted(() => {
  const prose = document.querySelector('article > .prose')!
  prose.classList.add('whole-width')
  const figure = document.querySelectorAll('figure')
  figure?.forEach(f => f.style.setProperty('--border-color', isDark.value ? 'rgb(220 252 231 / 0.1)' : 'rgb(20 184 166 / 0.1)'))
})
onBeforeUnmount(() => {
  const prose = document.querySelector('article > .prose')!
  prose.classList.remove('whole-width')
})
</script>

<template>
  <div>
    <ul class="grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="friend in friends" :key="friend.name" class="text-sm leading-6">
        <figure
          :class="[isDark ? 'dark:bg-dark-800' : 'dark:bg-slate-800']"
          class="relative flex flex-col-reverse bg-slate-50 rounded-lg p-6  dark:highlight-white/5"
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
                {{ friend.position }}
              </div>
            </div>
          </figcaption>
        </figure>
      </li>
    </ul>
    <div class="prose m-auto mt-8">
      <h1>Sponsors</h1>
    </div>
    <a href="https://cdn.jsdelivr.net/gh/Simon-He95/sponsor@main/sponsors.svg">
      <img src="https://cdn.jsdelivr.net/gh/Simon-He95/sponsor@main/sponsors.svg" mlauto mrauto>
    </a>
  </div>
</template>

<style>
.whole-width{
  max-width: 100% !important;
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
  border: 2px solid var(--border-color);
}

figure::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.5rem;
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
