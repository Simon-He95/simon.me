<!-- ---
title: Friends
--- -->

  <TextExpansionAnimation
    :font-size="55"
    :color="isDark ? '#fff' : '#000'"
    background-color="rgba(0,0,0,0)"
    p4
    rounded-4
    style="--contrast: 2"
    text="Friend's"></TextExpansionAnimation>
<FriendsList></FriendsList>

<script setup>
  import { TextExpansionAnimation } from 'text-expansion-animation'
  import 'text-expansion-animation/style.css'
  import { ref } from 'vue'
  import { isDark } from '~/logics'

</script>

<style scoped>

</style>
