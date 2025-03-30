---
title: Matching Game
description: Wish this is the end.
date: 2022-05-19T22:00:00.000+00:00
lang: zh
duration: 3day
subtitle: 'Author: Simon'
---

  ## [在线体验](http://matching-game.hejian.club/)

  ## 分享一下Matching Game的设计理念

  既然之前写了借助canvas拆分图片写了N Puzzle，那么这个拆分图片同样可以实现一个连连看的图片配对

  ## 分享一下Matching Game的实现
  - 将一个图片转成base64放到创建的canvas上
  - canvas拆分成N*N的小图片，并且去除多余的空白
  - 创建一个二位数组，按照n x 2n生成2份图片，竖着方便手机上同样可以体验
  - 创建时给相同图片标记一个id，并且把图片的id放到一个数组中
  - 点中2个图片时对比pre和cur的url如果不同直接返回，如果相同并且坐标（x,y）不同说明时我们的目标图片，否则返回
  - 如果是我们的目标图片，通过一个BFS查找，并且每次查找规定了移动的方向，如果这个方向数组，前后2项方向不同count++，如果count>2说明到达目标元素曲折过多，不可达
  - 我们会再N x 2N外面包裹一层空白的item用来作为BFS可达的边界，这样就可以避免溢出

  ## GitHub地址
  [欢迎PR](https://github.com/Simon-He95/matching-game)
