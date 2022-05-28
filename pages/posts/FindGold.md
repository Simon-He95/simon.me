---
title:Find Gold
description: Wish this is the end.
date: 2022-05-26T22:00:00.000+00:00
lang: zh
duration: 2day
---

  ## [在线体验](https://find-gold.hejian.club/)

  ## 分享一下Find Gold的设计理念

  一个迷宫小游戏，生成一个迷宫，然后在迷宫中埋下金子，在一个火把的条件下，可视范围受限去找金子

  ## 分享一下Find Gold的实现
  - 创建一个二维数组，按照x，y对应四个方向，canvas stroke出n x n的小方块
  - 通过控制walls四个方向的值来控制上下左右是否有墙
  - 通过一个BFS从起点0，0到终点n-1，n-1绘制一条通路，中间会有很多死路，通过回溯的方式来排除死路，然后打通所有走过的路
  - 为了生成比较好看的迷宫，会让奇数的方块都往中心点找路来打通，这样就可以让迷宫更加曲折
  - 在所有走过的路中埋下金子，判断金子的位置和火把的位置来消除金子
  - 每一关金子的数量和迷宫的行列都会递增，并且可视区域也会变小，这样就可以让迷宫更加难以找到金子，增加游戏难度
  - 遮罩的canvas是一个迷宫的canvas的2倍，在canvas中挖走一块圆，并且通过移动canvas来控制可视区域

  
  ## GitHub地址
  [欢迎PR](https://github.com/Simon-He95/find-gold)
