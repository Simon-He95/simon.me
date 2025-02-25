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
    // anime({
    //     targets: '.signature',
    //     translateY: 0,
    //     rotateZ: 1440,
    //     duration:5000,
    //     delay: function(el, i) { 
    //       return i * 200;
    //     },
    // })
    anime({
        targets: 'main>div:first-child>h1',
        translateY: 0,
        rotateZ: 360,
        delay: 10000,
    })
     anime({
        targets: '.v-content',
        translateX: 0,
        duration: 1000,
        delay: function(el, i) { 
          if(el)
           el.style.transform = `translateX(${i%2===0?'-':''}100vw)`
          return i * 500;
        },
    })
  })
</script>
<style >
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
