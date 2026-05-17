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
