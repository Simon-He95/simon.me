---
title: v-axios
description: Wish this is the end.
date: 2022-07-29T22:00:00.000+00:00
lang: zh
duration: 2day
subtitle: 'Author: Simon'
---

<script setup lang="ts">
const directoryList = {
  "vAxios":"axios封装函数",
}
</script>

[[toc]]

> [英文 English Version](/posts/vAxios)

## 此文是介绍封装的工具函数的文档[@simon_he/v-axios](https://www.npmjs.com/package/@simon_he/s-charts)

<div flex="~" items-center><strong>特点</strong>: 扩展性高,调用灵活便捷 <span i-fluent:flash-28-filled bg-amber  /></div>

## 更多
- 通用函数 [simon-js-tool](/posts/ToolsFunction-zh)
- 导出函数 [exports-functions](/posts/exportsfunction-zh)
- threejs简单化 [s-three](/posts/threejs-zh)
- numsWheel 组件 [s-nums-wheel](/posts/numsWheel)
- Echarts简单化 [s-charts](/posts/charts-zh)

## 使用说明
```bash
npm i @simon_he/v-axios # 安装

import { 
  vAxios,
  ...
 } from '@simon_he/v-axios' # 按需引入

```

## 目录结构
<Directory type="zh" :lists="directoryList"></Directory>


## vAxios
- 基于axios的封装
```js
const axios = vAxios({
  baseURL: 'http://localhost:3000',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
  interceptor: {
    request(config) {
      console.log(config)
      return config
    },
    response(response) {
      console.log(response)
      return response
    },
    requestError(error) {
      console.log(error)
      return Promise.reject(error)
    },
    responseError(error) {
      console.log(error)
      return Promise.reject(error)
    },
  },
})

axios.get('/api/get', { // get请求可以像其他请求一样传参
  id: 1,
  name: '22',
}, {
  headers: {
    'Content-Type': 'application/json',
  },
}).then((res) => {
  console.log(res)
}).catch((err) => {
  console.log(err)
}).finally(() => {
  console.log('finally')
})

axios.post('/api/get', {
  id: 1,
  name: '22',
}, {
  headers: {
    'Content-Type': 'application/json',
  },
}).then((res) => {
  console.log(res)
}).catch((err) => {
  console.log(err)
}).finally(() => {
  console.log('finally')
})
```

## GitHub
[欢迎PR](https://github.com/Simon-He95/vAxios)
