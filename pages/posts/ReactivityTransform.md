---
title: Reactivity Transform
date: 2022-05-13T07:00:00.000+00:00
lang: en
duration: 5min
description: syntax sugar.
---


> [Discussions Details](https://github.com/vuejs/rfcs/discussions/369)

> 中文 [Chinese Version](/posts/reactivitytransform-zh)
  ## syntax sugar $()

   <p> Introduce a set of compiler transforms to improve ergonomics when using Vue's reactivity APIs, specifically to be able to use refs without .value.</p>

  #### Basic example
  ```js
  // declaring a reactive variable backed by an underlying ref
  let count = $ref(1)

  // log count, and automatically log again whenever it changes.
  // no need for .value anymore!
  watchEffect(() => console.log(count))

  function inc() {
    // assignments are reactive
   count++
  }
  ```
  #### Compiled Output
```js

  import { watchEffect, ref } from 'vue'

  const count = ref(1)

  watchEffect(() => console.log(count.value))

  function inc() {
    count.value++
  }
  ```

  This version behaves exactly the same as the original version, but notice that we no longer need to use .value. In fact, this makes our JS/TS code work the same way as in Vue templates where root-level refs are automatically unwrapped.

  The $ref() function is a compile-time macro that creates a reactive variable. It serves as a hint to the compiler: whenever the compiler encounters the count variable, it will automatically append .value for us! Under the hood, the reactive variable version is compiled into the normal ref version.

  Every reactivity API that returns refs will have a $-prefixed macro equivalent. These APIs include:
  ```markdown
  ref -> $ref
  computed -> $computed
  shallowRef -> $shallowRef
  customRef -> $customRef
  toRef -> $toRef
  ```

  ## How to use

  ### Vite
  - Requires @vitejs/plugin-vue@^2.0.0
  - Applies to SFCs and js(x)/ts(x) files. A fast usage check is performed on files before applying the transform so there should be no performance cost for files not using the macros.
  - Note refTransform is now a plugin root-level option instead of nested as script.refSugar, since it affects not just SFCs.
  ```js
  // vite.config.js
  export default {
    plugins: [
      vue({
        reactivityTransform: true
      })
    ]
  }
  ```

  ### vue-cli
  - Currently only affects SFCs
  - requires vue-loader@^17.0.0
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
          reactivityTransform: true
        }
      })
    }
  }
  ```

  ### Plain webpack + vue-loader
  - Currently only affects SFCs
  - requires vue-loader@^17.0.0
  ```js
  // webpack.config.js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            reactivityTransform: true
          }
        }
      ]
    }
  }
  ```

