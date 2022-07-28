---
title: Blog - Simon He
display: ''
---
<SubNav/>

<ClientOnly>
  <Plum/>
</ClientOnly>
<vivid-typing  spilt-tag="span" :style="{color:isDark?'#339933':'#009966'}" text-sm content="<%><span i-ic:outline-tips-and-updates></span></%> 如果我的blog对你有帮助，请在GitHub关注我，持续更新，记得点一下<%><span i-mdi:star-face></span></%>star哦~\n 当然也欢迎踊跃的PR<%><span i-ph:smiley-wink-bold/></%>"></vivid-typing>
<ListPosts />

<script setup lang="ts">
  import {isDark} from '~/logics'
</script>
