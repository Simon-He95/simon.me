---
title: v-axios
description: Wish this is the end.
date: 2022-07-29T22:00:00.000+00:00
lang: en
duration: 2day
subtitle: 'Author: Simon'
---

<script setup lang="ts">
const directoryList = {
  "vAxios":"Axios encapsulates the function",
}
</script>

[[toc]]

> [中文 Chinese Version](/posts/vAxios-zh)

## This article is documentation that describes the encapsulated utility functions [@simon_he/v-axios](https://www.npmjs.com/package/@simon_he/v-axios)

<div flex="~" ><strong>peculiarity</strong><span>: High scalability, flexible and convenient calling <span i-fluent:flash-28-filled bg-amber  /></span></div>

## More
- Common functions [lazy-js-utils](/posts/ToolsFunction)
- Export functions [exports-functions](/posts/exportsfunction)
- Threejs simplistic [s-three](/posts/threejs)
- numsWheel component [s-nums-wheel](/posts/numsWheel)
- Echarts simplistic [s-charts](/posts/charts)

## Instructions for use
```bash
npm i @simon_he/v-axios # install

import { 
  vAxios,
  ...
 } from '@simon_he/v-axios' # Ingestion on demand

```

## Directory structure
<Directory type="zh" :lists="directoryList"></Directory>


## vAxios
- Axios-based packaging
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

axios.get('/api/get', { // The get request can be passed across like any other request
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
[Welcome to PR](https://github.com/Simon-He95/vAxios)
