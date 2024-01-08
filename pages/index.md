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
  // const anime = require('animejs');
  onMounted(() => {
    anime({
        targets: '.signature',
        translateY: 0,
        rotateZ: 1440,
        duration:5000,
        delay: function(el, i) { 
          return i * 200;
        },
    })
    anime({
        targets: 'main>div:first-child>h1',
        translateY: 0,
        rotateZ: 360,
        delay: function(el, i) { 
          return i * 200;
        },
    })
     anime({
        targets: '.v-content',
        translateX: 0,
        duration: 1000,
        delay: function(el, i) { 
          el.style.transform = `translateX(${i%2===0?'-':''}100vw)`
          return i * 500;
        },
    })
  })
</script>
