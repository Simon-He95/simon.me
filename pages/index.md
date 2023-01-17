---
title: Simon He
---

<ClientOnly>
  <Plum/>
</ClientOnly>

<vivid-typing spilt-tag="span" v-if="lan==='en'" :content="$t.title" />
<vivid-typing spilt-tag="span" v-else :content="$t.title" />

<p v-for="content in $t.contents" v-html="content"></p>


***
<p v-for="content in $t.findMe" v-html="content"></p>
<script setup>
  import {$t,lan} from '../lang'
</script>
