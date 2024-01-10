<script setup lang="ts">
import { isDark, toggleDark } from '~/logics'
</script>

<template>
  <a class="select-none" title="Toggle Color Scheme" @click="toggleDark">
    <svg v-show="!isDark" class="svg-dash" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
        <path
          stroke-dasharray="34" stroke-dashoffset="34"
          d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7"
        >
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="34;0" />
        </path>
        <g stroke-dasharray="2" stroke-dashoffset="2">
          <path d="M0 0">
            <animate
              fill="freeze" attributeName="d" begin="0.5s" dur="0.2s"
              values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"
            />
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="2;0" />
          </path>
          <path d="M0 0">
            <animate
              fill="freeze" attributeName="d" begin="0.7s" dur="0.2s"
              values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"
            />
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="2;0" />
          </path>
          <animateTransform
            attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate"
            values="0 12 12;360 12 12"
          />
        </g>
      </g>
    </svg>
    <svg v-show="isDark" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
        <g stroke-dasharray="2">
          <path d="M12 21v1M21 12h1M12 3v-1M3 12h-1">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="4;2" />
          </path>
          <path d="M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5">
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="4;2" />
          </path>
        </g>
        <path
          d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z"
          opacity="0"
        >
          <set attributeName="opacity" begin="0.5s" to="1" />
        </path>
      </g>
      <g
        fill="none" stroke="currentColor" stroke-dasharray="4" stroke-dashoffset="4" stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5">
          <animate
            id="lineMdSunnyOutlineToMoonAltLoopTransition0" fill="freeze" attributeName="stroke-dashoffset"
            begin="0.6s;lineMdSunnyOutlineToMoonAltLoopTransition0.begin+6s" dur="0.4s" values="4;0"
          />
          <animate
            fill="freeze" attributeName="stroke-dashoffset"
            begin="lineMdSunnyOutlineToMoonAltLoopTransition0.begin+2s;lineMdSunnyOutlineToMoonAltLoopTransition0.begin+4s"
            dur="0.4s" values="4;0"
          />
          <animate
            fill="freeze" attributeName="stroke-dashoffset"
            begin="lineMdSunnyOutlineToMoonAltLoopTransition0.begin+1.2s;lineMdSunnyOutlineToMoonAltLoopTransition0.begin+3.2s;lineMdSunnyOutlineToMoonAltLoopTransition0.begin+5.2s"
            dur="0.4s" values="0;4"
          />
          <set
            attributeName="d" begin="lineMdSunnyOutlineToMoonAltLoopTransition0.begin+1.8s"
            to="M12 5h1.5M12 5h-1.5M12 5v1.5M12 5v-1.5"
          />
          <set
            attributeName="d" begin="lineMdSunnyOutlineToMoonAltLoopTransition0.begin+3.8s"
            to="M12 4h1.5M12 4h-1.5M12 4v1.5M12 4v-1.5"
          />
          <set
            attributeName="d" begin="lineMdSunnyOutlineToMoonAltLoopTransition0.begin+5.8s"
            to="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5"
          />
        </path>
        <path d="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5">
          <animate
            id="lineMdSunnyOutlineToMoonAltLoopTransition1" fill="freeze" attributeName="stroke-dashoffset"
            begin="1s;lineMdSunnyOutlineToMoonAltLoopTransition1.begin+6s" dur="0.4s" values="4;0"
          />
          <animate
            fill="freeze" attributeName="stroke-dashoffset"
            begin="lineMdSunnyOutlineToMoonAltLoopTransition1.begin+2s;lineMdSunnyOutlineToMoonAltLoopTransition1.begin+4s"
            dur="0.4s" values="4;0"
          />
          <animate
            fill="freeze" attributeName="stroke-dashoffset"
            begin="lineMdSunnyOutlineToMoonAltLoopTransition1.begin+1.2s;lineMdSunnyOutlineToMoonAltLoopTransition1.begin+3.2s;lineMdSunnyOutlineToMoonAltLoopTransition1.begin+5.2s"
            dur="0.4s" values="0;4"
          />
          <set
            attributeName="d" begin="lineMdSunnyOutlineToMoonAltLoopTransition1.begin+1.8s"
            to="M17 11h1.5M17 11h-1.5M17 11v1.5M17 11v-1.5"
          />
          <set
            attributeName="d" begin="lineMdSunnyOutlineToMoonAltLoopTransition1.begin+3.8s"
            to="M18 12h1.5M18 12h-1.5M18 12v1.5M18 12v-1.5"
          />
          <set
            attributeName="d" begin="lineMdSunnyOutlineToMoonAltLoopTransition1.begin+5.8s"
            to="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5"
          />
        </path>
        <path d="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5">
          <animate
            id="lineMdSunnyOutlineToMoonAltLoopTransition2" fill="freeze" attributeName="stroke-dashoffset"
            begin="2.8s;lineMdSunnyOutlineToMoonAltLoopTransition2.begin+6s" dur="0.4s" values="4;0"
          />
          <animate
            fill="freeze" attributeName="stroke-dashoffset"
            begin="lineMdSunnyOutlineToMoonAltLoopTransition2.begin+2s" dur="0.4s" values="4;0"
          />
          <animate
            fill="freeze" attributeName="stroke-dashoffset"
            begin="lineMdSunnyOutlineToMoonAltLoopTransition2.begin+1.2s;lineMdSunnyOutlineToMoonAltLoopTransition2.begin+3.2s"
            dur="0.4s" values="0;4"
          />
          <set
            attributeName="d" begin="lineMdSunnyOutlineToMoonAltLoopTransition2.begin+1.8s"
            to="M20 5h1.5M20 5h-1.5M20 5v1.5M20 5v-1.5"
          />
          <set
            attributeName="d" begin="lineMdSunnyOutlineToMoonAltLoopTransition2.begin+5.8s"
            to="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5"
          />
        </path>
      </g>
      <mask id="lineMdSunnyOutlineToMoonAltLoopTransition3">
        <circle cx="12" cy="12" r="12" fill="#fff" />
        <circle cx="12" cy="12" r="4">
          <animate fill="freeze" attributeName="r" begin="0.1s" dur="0.4s" values="4;8" />
        </circle>
        <circle cx="22" cy="2" r="3" fill="#fff">
          <animate fill="freeze" attributeName="cx" begin="0.1s" dur="0.4s" values="22;18" />
          <animate fill="freeze" attributeName="cy" begin="0.1s" dur="0.4s" values="2;6" />
          <animate fill="freeze" attributeName="r" begin="0.1s" dur="0.4s" values="3;12" />
        </circle>
        <circle cx="22" cy="2" r="1">
          <animate fill="freeze" attributeName="cx" begin="0.1s" dur="0.4s" values="22;18" />
          <animate fill="freeze" attributeName="cy" begin="0.1s" dur="0.4s" values="2;6" />
          <animate fill="freeze" attributeName="r" begin="0.1s" dur="0.4s" values="1;10" />
        </circle>
      </mask>
      <circle cx="12" cy="12" r="6" fill="currentColor" mask="url(#lineMdSunnyOutlineToMoonAltLoopTransition3)">
        <set attributeName="opacity" begin="0.5s" to="0" />
        <animate fill="freeze" attributeName="r" begin="0.1s" dur="0.4s" values="6;10" />
      </circle>
    </svg>
  </a>
</template>

<style scoped>
:deep(.svg-dash) {
  animation: draw 20s linear forwards;
}

:deep(.svg-dash):active {
  animation: rotate 1s linear forwards;
}

@keyframes draw {
  from {
    stroke-dasharray: 1000;
    /* 设置初始的虚线样式，使图标不可见 */
    stroke-dashoffset: 1000;
    /* 设置初始的虚线偏移量，使图标不可见 */
  }

  to {
    stroke-dasharray: 1000;
    stroke-dashoffset: 0;
    /* 设置最终的虚线偏移量，完全描绘出图标 */
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
