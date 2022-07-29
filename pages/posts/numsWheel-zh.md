---
title: nums-wheel
description: Wish this is the end.
date: 2022-07-26T22:00:00.000+00:00
lang: zh
duration: 2day
subtitle: 'Author: Simon'
---

<script setup lang="ts">
const directoryList = {
  "numsWheel":"数字滚轮控件",
}
</script>

[[toc]]

> [英文 English Version](/posts/numsWheel)

## 此文是介绍封装的工具函数的文档[@simon_he/nums-wheel](https://www.npmjs.com/package/@simon_he/nums-wheel)
<div flex="~" items-center><strong>特点</strong>: 扩展性高,调用灵活便捷 <span i-fluent:flash-28-filled bg-amber  /></div>

## 更多
- 通用函数 [simon-js-tool](/posts/ToolsFunction-zh)
- 导出函数 [exports-functions](/posts/exportsfunction-zh)
- threejs简单化 [s-three](/posts/threejs-zh)
- vAxios 请求封装[v-axios](/posts/vAxios)

## 使用说明
```bash
npm i @simon_he/nums-wheel # 安装

import { 
  numsWheel,
  ...
 } from '@simon_he/nums-wheel' # 按需引入

```

## 目录结构
<Directory type="zh" :lists="directoryList"></Directory>


## numsWheel
- 数字滚轮控件
- 无需在onMounted中调用,可以在任意地方调用
- 基于odometer封装, 更简单的在业务中使用
- 参数:
  - container: string | HTMLElement 父容器
  - options: {  format: '(,ddd)' | '(,ddd).dd' | '(.ddd),dd' | '( ddd),dd' | 'd' 数字格式 startVal: number 起始数字 endVal: number 最终数字  duration: number 动画时长  animation: 'count' | 'countdown' 动画方式 }
```javascript
numWheel('#main', {  endVal: 9000.12 }) // 默认format: '(,ddd).dd' startVal: 0 duration: 500 animation: 'countdown', 可以自定义format, startVal, duration, animation
```

## GitHub
[欢迎PR](https://github.com/Simon-He95/numsWheel)
