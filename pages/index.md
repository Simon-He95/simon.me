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
  import { onBeforeUnmount, onMounted } from 'vue'

  let observer = null
  onMounted(() => {
    const title = document.querySelector('main>div:first-child>h1')
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
    if (title && !title.dataset.splitReady) {
      title.dataset.splitReady = 'true'
      title.innerHTML = title.textContent.replace(/\S/g, "<span class='title-split'>$&</span>")
    }

    // Intersection Observer 触发动画
    const contents = Array.from(document.querySelectorAll('.v-content'))
    if (reduceMotion) {
      contents.forEach(el => el.classList.add('show'))
      return
    }

    observer = new window.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting)
          return

        entry.target.classList.add('show')
        observer?.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -12% 0px' })

    window.requestAnimationFrame(() => {
      contents.forEach(el => observer?.observe(el))
    })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
</script>
<style >
  .v-content {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.55s ease, transform 0.55s ease;
    content-visibility: auto;
    contain-intrinsic-size: 72px;
  }
  .v-content.show {
    opacity: 1;
    transform: translateY(0);
  }
  .title-split:nth-child(1) {
    display:inline-block;
  }

  @media (prefers-reduced-motion: no-preference) {
    .title-split:nth-child(1) {
      animation: title-split 1.4s 0.35s ease-out both;
      will-change: transform;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .v-content {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }

  @keyframes title-split{
    0%{
      transform: rotateY(0deg) scale(1);
    }
    45%{
      transform: rotateY(360deg) scale(1.04);
    }
    100%{
      transform: rotateY(0deg) scale(1);
    }
  }
</style>
