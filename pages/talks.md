---
title: Talks - Simon He
display: ''
plum: true
---

<SubNav />

<h2 id="talks">{{ isZh ? '分享' : 'Talks' }}</h2>

<table>
  <thead>
    <tr>
      <th>{{ isZh ? '日期' : 'Date' }}</th>
      <th>{{ isZh ? '活动' : 'Conference' }}</th>
      <th>{{ isZh ? '地点' : 'Location' }}</th>
      <th>{{ isZh ? '主题' : 'Topic' }}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><TalkDate date="2026-07-18" /></td>
      <td><a href="https://vueconf.cn/" target="_blank" rel="noopener"><strong>Vue & ViteConf CN 2026</strong></a></td>
      <td>{{ isZh ? '上海' : 'Shanghai' }}</td>
      <td>
        <a href="https://markstream-vue-slidev.pages.dev/1" target="_blank" rel="noopener"><strong>{{ isZh ? '你的 Markdown 渲染器，扛得住 AI 输出吗？' : 'Can Your Markdown Renderer Handle AI Output?' }}</strong></a>
        · <a href="https://github.com/Simon-He95/markstream-vue-slidev" target="_blank" rel="noopener">{{ isZh ? '源码' : 'Source' }}</a>
      </td>
    </tr>
    <tr>
      <td><TalkDate date="2023-12-29" /></td>
      <td><a href="https://podcasts.apple.com/cn/podcast/web-worker-%E5%89%8D%E7%AB%AF%E7%A8%8B%E5%BA%8F%E5%91%98%E9%83%BD%E7%88%B1%E5%90%AC/id1586927144?i=1000639860553" target="_blank" rel="noopener"><strong>Web Worker</strong></a></td>
      <td>{{ isZh ? '上海' : 'Shanghai' }}</td>
      <td>{{ isZh ? 'VSCode、开源、经历' : 'VScode, Open source, Experience' }}</td>
    </tr>
  </tbody>
</table>

<script setup>
  import { isZh } from '../lang'
</script>
