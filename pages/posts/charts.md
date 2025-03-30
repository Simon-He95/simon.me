---
title: s-charts
description: Wish this is the end.
date: 2022-07-25T22:00:00.000+00:00
lang: en
duration: 2day
subtitle: 'Author: Simon'
---

<script setup lang="ts">
const directoryList = {
  "sCharts":"Simplify the use of echarts",
}
</script>

[[toc]]

> [中文 Chinese Version](/posts/charts-zh)

## This article is documentation that describes the encapsulated utility functions [@simon_he/s-charts](https://www.npmjs.com/package/@simon_he/s-charts)

<div flex="~" ><strong>peculiarity</strong><span>: High scalability, flexible and convenient calling <span i-fluent:flash-28-filled bg-amber  /></span></div>

## More
- Common functions [lazy-js-utils](/posts/ToolsFunction)
- Export functions [exports-functions](/posts/exportsfunction)
- Threejs simplistic [s-three](/posts/threejs)
- numsWheel component [s-nums-wheel](/posts/numsWheel)
- vAxios Request encapsulation[v-axios](/posts/vAxios)

## Instructions for use
```bash
npm i @simon_he/s-charts # install

import {
  sCharts,
  ...
 } from '@simon_he/s-charts' # Ingestion on demand

```

## Directory structure
<Directory type="zh" :lists="directoryList"></Directory>

## sCharts
- Simplify the use of echarts
- It can make your code more concise and beautiful
- Automatically listens for resize events and automatically updates the size of the canvas
- params:
  - container: string | HTMLElement  /* Parent container */
  - options: SChartsOption  /* With echarts options, w: initialization width, h: initialization height, theme: echarts subject, all event behaviors starting with on are called */
  - autoResize: boolean  /* Whether to adjust the width and height automatically */
```javascript
const charts = sCharts('#main', {
  w: 500,
  h: 300,
  theme: 'dark',
  xAxis: {
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: [23, 24, 18, 25, 27, 28, 25],
    },
  ],
})
```

## GitHub
[Welcome to PR](https://github.com/Simon-He95/sCharts)
