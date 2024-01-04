---
title: nums-wheel
description: Wish this is the end.
date: 2022-07-26T22:00:00.000+00:00
lang: en
duration: 2day
subtitle: 'Author: Simon'
---

<script setup lang="ts">
const directoryList = {
    "numsWheel":"Digital wheel control",
}
</script>

[[toc]]

> [中文 Chinese Version](/posts/numsWheel-zh)

## This article is documentation that describes the encapsulated utility functions [@simon_he/nums-wheel](https://www.npmjs.com/package/@simon_he/nums-wheel)
<div flex="~" ><strong>peculiarity</strong><span>: High scalability, flexible and convenient calling <span i-fluent:flash-28-filled bg-amber  /></span></div>

## More
- Common functions [lazy-js-utils](/posts/ToolsFunction)
- Export functions [exports-functions](/posts/exportsfunction)
- Threejs simplistic [s-three](/posts/threejs)
- Echarts simplistic [s-charts](/posts/charts-zh)
- vAxios Request encapsulation[v-axios](/posts/vAxios)

## Instructions for use
```bash
npm i @simon_he/s-charts # install

import { 
  numsWheel,
  ...
 } from '@simon_he/nums-wheel' # Ingestion on demand

```

## Directory structure
<Directory type="zh" :lists="directoryList"></Directory>


## numsWheel
- Digital wheel control
- Based on the odometer package, it is simpler to use in the business
- params:
  - container: string | HTMLElement /* Parent container */
  - options: {  format: '(,ddd)' | '(,ddd).dd' | '(.ddd),dd' | '( ddd),dd' | 'd' /* Number format */ startVal: number /* The starting number */ endVal: number /* Final number */  duration: number /* The duration of the animation */  animation: 'count' | 'countdown' /* Animation mode */ }
```javascript
numWheel('#main', {  endVal: 9000.12 }) // Default format: '(,ddd).dd' startVal: 0 duration: 500 animation: 'countdown', Can be customized format, startVal, duration, animation
```

## GitHub
[Welcome to PR](https://github.com/Simon-He95/numsWheel)
