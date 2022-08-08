---
title: 响应式转化
date: 2022-05-13T07:00:00.000+00:00
lang: zh
duration: 5min
description: 语法糖.
---


> [讨论详情](https://github.com/vuejs/rfcs/discussions/369)

> 英文: [English Version](/posts/reactivitytransform)
  ## 语法糖 $()

   <p> 介绍一个编译转换来改善在vue中reactivity API的，为了更加人性化的使用ref而不再通过.value来获取值.</p>

  #### 语法糖示例
  ```js
  // 申明一个语法糖变量
  let count = $ref(1)

  // 当count变化时，自动输出
  // 而不在需要使用.value
  watchEffect(() => console.log(count))

  function inc() {
    // 任然是响应式的
    count++
  }
  ```
  #### 原本使用
```js
import { ref, watchEffect } from 'vue'

const count = ref(1)

watchEffect(() => console.log(count.value))

function inc() {
  count.value++
}
  ```

  此版本的行为与原始版本完全相同，但请注意，我们不再需要使用 .value。事实上，这使得我们的JS / TS代码的工作方式与Vue模板中的工作方式相同，其中根级引用会自动解包。

  `$ref（）` 函数是一个编译时宏，用于创建反应变量。它作为对编译器的提示：每当编译器遇到count变量时，它都会自动为我们附加.value！在引擎盖下，反应变量版本被编译成正常的ref版本。

  每个返回 refs 的反应性 API 都将具有一个以 $为前缀的宏等效项。这些 API 包括:
  ```markdown
  ref -> $ref
  computed -> $computed
  shallowRef -> $shallowRef
  customRef -> $customRef
  toRef -> $toRef
  ```

  ## 如何使用

  ### Vite
  - 需要 @vitejs/plugin-vue@^2.0.0
  - 适用于 SFC 和 js（x）/ts（x） 文件。在应用转换之前，会对文件执行快速使用情况检查，因此对于不使用宏的文件，应该不会产生性能开销.
  - 注意 refTransform 现在是一个插件根级选项，而不是嵌套为 script中的ref语法糖，因为它不仅影响 SFC.
  ```js
  // vite.config.js
  export default {
    plugins: [
      vue({
        reactivityTransform: true,
      }),
    ],
  }
  ```

  ### vue-cli
  - 目前仅影响 SFC
  - 需要 vue-loader@^17.0.0
  ```js
  // vite.config.js
  module.exports = {
    chainWebpack: (config) => {
      config.module
        .rule('vue')
        .use('vue-loader')
        .tap((options) => {
          return {
            ...options,
            reactivityTransform: true,
          }
        })
    },
  }
  ```

  ### Plain webpack + vue-loader
  - 目前仅影响 SFC
  - 需要 vue-loader@^17.0.0
  ```js
  // webpack.config.js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            reactivityTransform: true,
          },
        },
      ],
    },
  }
  ```

