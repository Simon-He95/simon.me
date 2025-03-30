<script setup lang="ts">
import { type SpeechOptions, speech, useRaf } from 'lazy-js-utils'
import { lan, setLan } from '../../lang'

const isZh = computed(() => lan.value === 'zh')
const color = ref('black')
function preload() {
  const Image = document.createElement('img')
  Image.src = '/black.png'
}

const Blog = computed(() => isZh.value ? '博客' : 'Blog')
onMounted(preload)
const { speak, isSpeaking } = speech()
const getSpeechOptions = computed(() =>
  isZh.value
    ? {
        text: '大家好,我是Simon,一个狂热的程序员,兴趣爱好有追动漫、打篮球、看一些推理剧、狼人杀,居住在上海,中国',
        lang: 'zh-CN',
      }
    : {
        text: 'Hey, I am Simon, a fanatical programmers. My hobbies include watching animation, playing basketball, watching some mystery dramas, and werewolf, lived in Shanghai, China',
        lang: 'en-US',
      },
)
const pending = ref(false)
function say() {
  speak(getSpeechOptions.value as SpeechOptions)
  pending.value = true
  const stop = useRaf(() => {
    if (!isSpeaking()) {
      pending.value = false
      stop()
    }
  }, 500)
}
</script>

<template>
  <header class="header z-40">
    <router-link
      w-30 absolute lg:fixed my6 mx15 lt-md:mx4 select-none outline-none to="/" focusable="false"
      class="signature"
    >
      <Logo />
      <!-- <img border-rd-full src="/signature.png" :class="isDark ? 'brightness' : ''" title="Home" alt="logo"> -->
    </router-link>
    <nav class="nav">
      <div class="spacer" />
      <div class="right">
        <router-link to="/posts" title="Blog">
          <span class="lt-md:hidden BlogMove" :style="`--blog:'${Blog}'`"> {{ isZh ? '博客' : 'Blog' }}
            <div class="white" />
          </span>
          <div i-clarity:book-solid md:hidden />
        </router-link>
        <router-link to="/projects" title="Projects">
          <span v-if="isZh" class="lt-md:hidden projectMove"><span style="--delay: 0s">项</span><span
            style="--delay: 0.1s"
          >目</span></span>
          <span v-else class="lt-md:hidden projectMove"><span style="--delay: 0s">P</span><span
            style="--delay: 0.1s"
          >r</span><span style="--delay: 0.2s">o</span><span
            style="--delay: 0.3s"
          >j</span><span style="--delay: 0.4s">e</span><span
            style="--delay: 0.5s"
          >c</span><span style="--delay: 0.6s">t</span><span
            style="--delay: 0.7s"
          >s</span></span>
          <div i-iwwa:power class="md:hidden iconMove" />
          <span icon="fa" />
        </router-link>
        <router-link to="/ama" title="AMA">
          <span class="lt-md:hidden animate-keyframes-zoom-in  animate-count-infinite animate-duration-10s"> AMA
            <div class="white" />
          </span>
          <!-- <TextExpansionAnimation lt-md:hidden :font-size="20" :color="isDark ? '#fff' : '#000'" text="AMA" background-color="red"></TextExpansionAnimation> -->
          <svg class="svg-dash" xmlns="http://www.w3.org/2000/svg" md:hidden width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="m12 22l-.25-3h-.25q-3.55 0-6.025-2.475T3 10.5q0-3.55 2.475-6.025T11.5 2q1.775 0 3.313.662t2.7 1.825q1.162 1.163 1.824 2.7T20 10.5q0 3.8-2.275 6.813T12 22Zm-.525-6.025q.425 0 .725-.3t.3-.725q0-.425-.3-.725t-.725-.3q-.425 0-.725.3t-.3.725q0 .425.3.725t.725.3ZM11.5 12.8q.275 0 .5-.2t.3-.55q.05-.325.275-.588t.775-.812q.45-.45.75-.975t.3-1.125q0-1.275-.862-1.913T11.5 6q-.875 0-1.513.4t-1.037 1q-.175.275-.062.575t.462.425q.25.1.5 0t.45-.375q.2-.275.488-.45T11.5 7.4q.675 0 1.013.375t.337.825q0 .425-.25.763t-.6.687q-.7.6-.938.975t-.287 1.025q-.025.3.188.525t.537.225Z"
            />
          </svg>
        </router-link>
        <a href="https://twitter.com/simon_he1995" target="_blank" title="Twitter" class="lt-md:hidden">
          <svg class="svg-dash" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path
              fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M8.5 2h2.5L11 2h-2.5zM13 2h2.5L15.5 2h-2.5zM10.5 2h5v0h-5zM8.5 2h5v0h-5zM10 2h3.5L13.5 2h-3.5z"
            >
              <animate
                fill="freeze" attributeName="d" dur="0.8s" keyTimes="0;0.3;0.5;1"
                values="M8.5 2h2.5L11 2h-2.5zM13 2h2.5L15.5 2h-2.5zM10.5 2h5v0h-5zM8.5 2h5v0h-5zM10 2h3.5L13.5 2h-3.5z;M8.5 2h2.5L11 22h-2.5zM13 2h2.5L15.5 22h-2.5zM10.5 2h5v2h-5zM8.5 20h5v2h-5zM10 2h3.5L13.5 22h-3.5z;M8.5 2h2.5L11 22h-2.5zM13 2h2.5L15.5 22h-2.5zM10.5 2h5v2h-5zM8.5 20h5v2h-5zM10 2h3.5L13.5 22h-3.5z;M1 2h2.5L18.5 22h-2.5zM5.5 2h2.5L23 22h-2.5zM3 2h5v2h-5zM16 20h5v2h-5zM18.5 2h3.5L5 22h-3.5z"
              />
            </path>
          </svg>
        </a>
        <a href="https://github.com/Simon-He95" target="_blank" title="GitHub" class="lt-md:hidden">
          <svg class="svg-dash" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"
            />
          </svg>
        </a>
        <a href="https://github.com/Simon-He95/sponsor" target="_blank" title="Sponsor" class="lt-md:hidden">
          <svg class="svg-dash" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M5.624 4.424C3.965 5.182 2.75 6.986 2.75 9.137c0 2.197.9 3.891 2.188 5.343c1.063 1.196 2.349 2.188 3.603 3.154c.298.23.594.459.885.688c.526.415.995.778 1.448 1.043c.452.264.816.385 1.126.385c.31 0 .674-.12 1.126-.385c.453-.265.922-.628 1.448-1.043c.29-.23.587-.458.885-.687c1.254-.968 2.54-1.959 3.603-3.155c1.289-1.452 2.188-3.146 2.188-5.343c0-2.15-1.215-3.955-2.874-4.713c-1.474-.673-3.41-.568-5.304 1.088L14.53 6.97a.75.75 0 1 1-1.06 1.061l-2-1.999l-.01-.01c-2.058-2.14-4.224-2.335-5.836-1.598M12 4.46C9.688 2.39 7.099 2.1 5 3.059C2.786 4.074 1.25 6.426 1.25 9.138c0 2.665 1.11 4.699 2.567 6.339c1.166 1.313 2.593 2.412 3.854 3.382c.286.22.563.434.826.642c.513.404 1.063.834 1.62 1.16c.557.325 1.193.59 1.883.59s1.326-.265 1.883-.59c.558-.326 1.107-.756 1.62-1.16a78.6 78.6 0 0 1 .826-.642c1.26-.97 2.688-2.07 3.854-3.382c1.457-1.64 2.567-3.674 2.567-6.339c0-2.712-1.535-5.064-3.75-6.077c-2.099-.96-4.688-.67-7 1.399"
              clip-rule="evenodd"
            />
          </svg>
        </a>
        <svg
          class="svg-dash" :class="[lan === 'en' ? 'rotate-y-180' : 'rotate-y-0']" xmlns="http://www.w3.org/2000/svg"
          width="18" height="18" viewBox="0 0 32 32" @click="setLan"
        >
          <path
            fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M16 28h-3c-3.9 0-7-3.1-7-7v-4h2v4c0 2.8 2.2 5 5 5h3zm12 2h2.2l-4.6-11h-2.2l-4.6 11H21l.8-2h5.3zm-5.3-4l1.8-4.4l1.8 4.4zM28 15h-2v-4c0-2.8-2.2-5-5-5h-4V4h4c3.9 0 7 3.1 7 7zM14 5V3H9V1H7v2H2v2h8.2c-.2.9-.8 2.5-2.2 4c-.6-.7-1.1-1.4-1.4-2H4.3c.4 1 1.1 2.2 2.1 3.3c-.8.7-2 1.3-3.4 1.8l.7 1.9c1.8-.7 3.2-1.5 4.3-2.3c1.1.9 2.5 1.7 4.3 2.3l.7-1.9c-1.4-.5-2.6-1.2-3.5-1.8c1.9-2 2.5-4.1 2.7-5.3z"
          />
        </svg>
        <router-link to="/talks" class="lt-md:hidden" title="Talks">
          <svg class="svg-dash" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <g fill="none">
              <path
                d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
              />
              <path
                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
                d="M12 3c5.344 0 10 3.643 10 8.5S17.344 20 12 20c-.525 0-1.042-.034-1.546-.1l-2.9 1.932a1 1 0 0 1-1.535-1.028l.445-2.221C3.828 17.09 2 14.517 2 11.5C2 6.643 6.656 3 12 3m0 2c-4.597 0-8 3.073-8 6.5c0 2.335 1.544 4.475 4.017 5.635a1 1 0 0 1 .556 1.101l-.119.593l1.211-.808a1 1 0 0 1 .72-.154c.52.087 1.06.133 1.615.133c4.597 0 8-3.073 8-6.5S16.597 5 12 5m-2 2a1 1 0 0 1 1 1v4.485l.009-.117a.997.997 0 0 1 .21-.493l2-2.5a1 1 0 0 1 1.562 1.25l-1.5 1.875l1.5 1.875a1 1 0 1 1-1.562 1.25l-2-2.5a.998.998 0 0 1-.219-.61V15a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1"
              />
            </g>
          </svg>
        </router-link>
        <router-link to="/friends" title="Friends">
          <svg xmlns="http://www.w3.org/2000/svg" class="svg-dash" width="20" height="20" viewBox="0 0 48 48">
            <g fill="none">
              <path
                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20"
              />
              <path d="M31 7v17z" clip-rule="evenodd" />
              <path
                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M31 7v17"
              />
              <path d="m16.636 6.636l14.142 14.142z" clip-rule="evenodd" />
              <path
                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="m16.636 6.636l14.142 14.142"
              />
              <path d="M7 17h17z" clip-rule="evenodd" />
              <path
                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M7 17h17"
              />
              <path d="M20.364 17.636L6.222 31.778z" clip-rule="evenodd" />
              <path
                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M20.364 17.636L6.222 31.778"
              />
              <path d="M17 25v17z" clip-rule="evenodd" />
              <path
                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M17 25v17"
              />
              <path d="m17.636 27.636l14.142 14.142z" clip-rule="evenodd" />
              <path
                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="m17.636 27.636l14.142 14.142"
              />
              <path d="M24 31h18z" clip-rule="evenodd" />
              <path
                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M24 31h18"
              />
              <path d="M42.364 16.636L28.222 30.778z" clip-rule="evenodd" />
              <path
                stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M42.364 16.636L28.222 30.778M24 31a7 7 0 1 0 0-14a7 7 0 0 0 0 14"
              />
            </g>
          </svg>
        </router-link>
        <!-- <svg
          class="svg-dash lt-md:hidden" :class="[pending ? 'text-red' : 'xxx']" xmlns="http://www.w3.org/2000/svg"
          width="18" height="18" viewBox="0 0 24 24" @click="say()"
        >
          <path
            fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            fill-rule="evenodd"
            d="M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12v5.634c0 .913 0 1.526-.151 2.063a3.852 3.852 0 0 1-1.976 2.412c-.495.246-1.086.343-1.941.484l-.121.02l-.022.003c-.304.05-.565.094-.782.116a2.27 2.27 0 0 1-.698-.019a2.271 2.271 0 0 1-1.675-1.486a2.474 2.474 0 0 1-.121-.69c-.013-.225-.013-.5-.013-.823v-4.628c0-.477 0-.873.1-1.212a2.278 2.278 0 0 1 1.64-1.572c.344-.083.737-.05 1.185-.012l.102.008l.12.01c.84.07 1.421.117 1.914.308c.341.132.656.312.939.532V12a9.25 9.25 0 1 0-18.5 0v1.148c.283-.22.598-.4.939-.532c.493-.191 1.073-.239 1.913-.308l.12-.01l.103-.008c.448-.038.84-.07 1.186.012c.79.19 1.406.798 1.638 1.572c.102.338.102.735.101 1.212v4.628c0 .324 0 .598-.013.823a2.48 2.48 0 0 1-.12.69a2.271 2.271 0 0 1-1.676 1.486a2.27 2.27 0 0 1-.698.019a13.83 13.83 0 0 1-.782-.116l-.022-.003a45.79 45.79 0 0 0-.12-.02c-.856-.141-1.447-.238-1.942-.485a3.852 3.852 0 0 1-1.976-2.411c-.13-.462-.148-.98-.15-1.697v-.142l-.001-.225v-.642zm1.5 5.514c0 1.078.007 1.465.095 1.775a2.353 2.353 0 0 0 1.2 1.476c.267.133.615.199 1.639.368c.331.055.547.09.712.107c.162.016.22.009.243.004a.772.772 0 0 0 .562-.513c.012-.034.029-.105.039-.279c.01-.177.01-.409.01-.759v-4.506c0-.634-.008-.784-.037-.881a.78.78 0 0 0-.552-.545c-.078-.019-.203-.018-.815.032c-1.008.083-1.352.12-1.616.222A2.335 2.335 0 0 0 2.837 15.6c-.08.299-.087.677-.087 1.728zM12 5.75a.75.75 0 0 1 .75.75v5a.75.75 0 1 1-1.5 0v-5a.75.75 0 0 1 .75-.75m-3 1.5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0V8A.75.75 0 0 1 9 7.25m6 0a.75.75 0 0 1 .75.75v2a.75.75 0 1 1-1.5 0V8a.75.75 0 0 1 .75-.75m3.154 6.543c-.612-.05-.737-.051-.815-.032a.78.78 0 0 0-.552.545c-.029.097-.037.247-.037.881v4.506c0 .35 0 .582.01.76c.01.173.027.244.04.278a.772.772 0 0 0 .561.513a.863.863 0 0 0 .243-.004c.166-.017.38-.052.713-.107c1.023-.17 1.371-.235 1.638-.367a2.353 2.353 0 0 0 1.2-1.477c.088-.31.095-.697.095-1.775v-.186c0-1.05-.006-1.43-.087-1.728a2.337 2.337 0 0 0-1.393-1.585c-.264-.103-.608-.139-1.616-.222"
            clip-rule="evenodd"
          />
        </svg> -->
        <toggle-theme />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.brightness {
  filter: brightness(1500%);
}

.boxshadow {
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
    rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
    rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px,
    rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px,
    rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
}

.header h1 {
  margin-bottom: 0;
}

.logo {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
}

.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav>* {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right>* {
  margin: auto;
}

.projectMove>span {
  position: relative;
  animation: bounce 0.5s ease infinite alternate;
}

.projectMove>span:nth-child(1n + 0) {
  animation-delay: var(--delay);
}

@keyframes bounce {
  100% {
    top: -2px;
    font-weight: bold;
  }
}

.iconMove {
  animation: iconMove 1s ease-in-out infinite alternate;
}

@keyframes iconMove {
  100% {
    transform: rotate(360deg);
  }
}

.BlogMove {
  position: relative;
}

.white {
  position: absolute;
  left: 0;
  width: 80%;
  height: 3px;
  z-index: 4;
  animation: whiteMove 3s ease-out infinite;
}

.BlogMove::before {
  width: 100%;
  content: var(--blog);
  position: absolute;
  top: 0;
  left: 0.5px;
  height: 0px;
  color: v-bind(color);
  overflow: hidden;
  z-index: 2;
  animation: redShadow 2s ease-in infinite;
  filter: contrast(200%);
  text-shadow: 1px 0 0 #eee;
}

@keyframes redShadow {
  20% {
    height: 32px;
  }

  60% {
    height: 6px;
  }

  100% {
    height: 42px;
  }
}

@keyframes whiteMove {
  8% {
    top: 38px;
  }

  14% {
    top: 8px;
  }

  20% {
    top: 42px;
  }

  32% {
    top: 2px;
  }

  99% {
    top: 30px;
  }
}

:deep(.svg-dash) {
  animation: draw 10s linear infinite;
}

:deep(.svg-dash):active {
  animation: rotate 1s linear forwards;
}

@keyframes draw {
  from {
    stroke-dasharray: 1000;
    /* 设置初始的虚线样式,使图标不可见 */
    stroke-dashoffset: 1000;
    /* 设置初始的虚线偏移量,使图标不可见 */
  }

  to {
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
    /* 设置最终的虚线偏移量,完全描绘出图标 */
  }
}

@keyframes rotate {
  from {
    transform: rotate3d(0, 0, 0, 0deg);
  }

  to {
    transform: rotate3d(0, 0, 1, 45deg);
  }
}
</style>
