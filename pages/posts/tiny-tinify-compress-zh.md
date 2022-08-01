---
title: tiny-tinify-compress
description: Wish this is the end.
date: 2022-08-01T22:00:00.000+00:00
lang: zh
duration: 1day
subtitle: 'Author: Simon'
---


## 介绍tiny-tinify-compress的实现
tiny-tinify-compress是一个自动监听文件变化的工具,并自动高效、高质量的压缩图片,实现原理：借助[tinify](https://tinypng.com/)提供的api实现一个简单的压缩工具

## 安装
```shell
npm i -g tiny-tinify-compress
```

## 配置
```shell
# package.json 配置你自己key, 申请地址 https://tinypng.com/developers
# includes: "压缩目录下的图片" 只支持 'image/webp', 'image/jpeg', 'image/png', 'image/jpg', 'image/jfif'
{
  "tinifyCompress": {
    "key": "your-key",
    "includes": [
      "./assets/**"
    ]
  }
}
```

## 使用
```shell
# 全局安装后即可直接使用compress
  compress
```
<img src="../../public/images/kv.jpg" />

## GitHub
[欢迎PR](https://github.com/Simon-He95/tiny-tinify-compress)
