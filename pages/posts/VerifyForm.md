---
title: Verify Form
description: Wish this is the end.
date: 2022-06-03T22:00:00.000+00:00
lang: zh
duration: 2day
subtitle: 'Author: Simon'
---

  ## 表单验证组件

  [在线体验](https://verify-form.hejian.club/)

## API

- initial-regular :Boolean // 首次加载就对初始化值进行rules的规则校验
- inline :Boolean // 将regular-form-fields改为行内元素

## refElAPI

- $reset :Function // 清空form下所有的错误消息
- $clear :Function // 清空form下所有表单内容
- getStatus : Function // 获取form的状态,true表明当前所有rules配置都通过了，否则存在校验错误项
- getErrorMsg : Function // 获取form的错误消息
- autoFocus :Function // 自动聚焦第一个错误项

## FormData数据结构

```js
const formData = reactive({
  age: '',
  name: '',
  country: '',
  address: '',
  rules: {
    age: [
      /* required */ val => !!val || 'Required',
      /* number */ val => !Number.isNaN(Number(val)) || 'Expected number',
      /* length */ val =>
        val <= 18 ? 'You are too young' : val >= 100 ? 'You are too old' : '',
    ],
    name: [
      /* required */ val => !!val || 'Required',
      /* length */ val => val.length > 2 || 'Length needs to be more than 2',
    ],
  },
})
```

## 安装

```shell
npm install -D verify-form
```

## 注册

```
import { createApp } from 'vue'
import { RegularForm, RegularFormField } from 'verify-form'

const app = createApp(App)
app.component('RegularForm', RegularForm)
app.component('RegularFormField', RegularFormField)
app.mount('#app')
```
## 使用

![script](/images/script.jpg)
![template](/images/template.jpg)

## 依赖
vue

## GitHub地址
[欢迎PR](https://github.com/Simon-He95/verify-form)
