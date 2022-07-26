---
title: s-charts
description: Wish this is the end.
date: 2022-07-25T22:00:00.000+00:00
lang: zh
duration: 2day
subtitle: 'Author: Simon'
---

<script setup lang="ts">
const directoryList = {
  "sCharts":"echarts封装函数",
}
</script>

[[toc]]

> [英文 English Version](/posts/charts)

## 此文是介绍封装的工具函数的文档[@simon_he/s-charts](https://www.npmjs.com/package/@simon_he/s-charts)
<div flex="~" items-center><strong>特点</strong>: 扩展性高,调用灵活便捷 <span i-fluent:flash-28-filled bg-amber  /></div>

## 更多
- 通用函数[simon-js-tool](/posts/ToolsFunction-zh)
- 导出函数[exports-functions](/posts/exportsfunction-zh)
- threejs简单化[s-three](/posts/threejs-zh)

## 使用说明
```bash
npm i @simon_he/s-charts # 安装

import { 
  sCharts,
  ...
 } from '@simon_he/s-charts' # 按需引入

```

## 目录结构
<Directory type="zh" :lists="directoryList"></Directory>


## sCharts
- 简单化echarts使用
- 可以让你的代码更加简洁,更加美观
- 不需要在onMounted中执行,可以在任意时刻使用
- 自动监听resize事件,自动更新canvas的大小
- 参数:
  - container: string | HTMLElement, 父容器
  - options: SChartsOption, echarts配置options,扩展了w: 初始化宽度, h: 初始化高度, theme: echarts主题, 所有的事件行为以on开头都会被调用
  - autoResize: boolean, 是否自动调整宽高
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
[欢迎PR](https://github.com/SimonHe1995/sCharts)
