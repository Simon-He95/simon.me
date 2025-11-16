---
title: Simon He
---

<ClientOnly>
  <Plum/>
</ClientOnly>

<vivid-typing spilt-tag="span" v-if="lan==='en'" :content="$t.title" />
<vivid-typing spilt-tag="span" v-else :content="$t.title" />

<p v-for="content in $t.contents" class="v-content"  v-html="content"></p>

***
<p v-for="content in $t.findMe" v-html="content"></p>
<script setup>
  import { $t, lan } from '../lang'
  import { onMounted } from 'vue'
  onMounted(() => {
    const title = document.querySelector('main>div:first-child>h1')
    title.innerHTML = title.textContent.replace(/\S/g, "<span class='title-split'>$&</span>")
    const s = document.querySelector('.title-split:nth-child(1)')
    anime({
        targets: 'main>div:first-child>h1',
        translateY: 0,
        rotateZ: 360,
        delay: 10000,
    })
    // Intersection Observer 触发动画
    const contents = document.querySelectorAll('.v-content')
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.2 })
    contents.forEach(el => observer.observe(el))
  })
</script>
<style >
  .v-content {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s, transform 0.8s;
  }
  .v-content.show {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.8s, transform 0.8s;
  }
  .title-split:nth-child(1) {
    display:inline-block;
    animation: title-split 8s 20s ease-in-out infinite;
    animation-delay: 3s;
  }
  @keyframes title-split{
    0%{
      transform: translate3d(0,0,0) ;
    }
    20%{
      transform: translate3d(0,0,0) rotateY(720deg);
      animation-play-state: paused;
    }
    50%{
      transform: translate3d(0,0,0) rotateY(720deg);
      animation-play-state: paused;
    }
    80%{
      transform: translate3d(0,0,0) rotateY(0deg);
      animation-play-state: paused;
    }
    100%{
      transform: translate3d(0,0,0) rotateY(0deg);
    }
  }
</style>
