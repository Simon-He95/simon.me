---
title: Tools Function
description: Wish this is the end.
date: 2022-06-12T22:00:00.000+00:00
lang: zh
duration: 2day
---

## 此文介绍的是封装的工具函数[simon-js-tool](https://www.npmjs.com/package/simon-js-tool)
持续更新中，请关注...

## 使用说明
```bash
npm i simon-js-tool # 安装

import { 
asyncPool, 
curry, 
debounce, 
deepClone, 
deepCompare, 
deepMerge, 
memorizeFn, 
quickFilter, 
quickFind, 
throttle, 
transformKey, 
traverse } from 'simon-js-tool' # 按需引入

```


## deepCompare 
- 比较2个对象的差异返回不同的属性和具体不同的值
- 返回{error:[],errorMsg:[]} 格式,error对应的是不同的属性，errorMsg对应的是不同的属性的不同的值和位置

## deepMerge 
- Object.assign的深度拷贝版本
- 可以接受多个参数，存在相同层级的相同属性，后者覆盖前者
- 返回第一个对象

## asyncPool 
- 控制异步并发执行的数量
- 参数： limit-控制异步并发执行的数量，tasks-异步任务数组

## quickFind 
-  quickFind(array: any[], key: any) ,返回一个新的实例
- 在实例中find方法可以根据key查找对应的项-O(1)
- set更新或新增项-O(1)
- delete删除项-O(1)

## quickFilter 
- quickFilter(array: any[], key: string | number | Array<string | number>, value: string | number | RegExp)
- 快速模糊查找key名字的项,value支持正则匹配

## deepClone 
- 支持循环依赖
- 支持复杂类型
- 轻量级的深拷贝

## curry 
- curry(fn)(1,2)(3)
- 函数柯里化

## memorizeFn 
- 根据参数返回一个能缓存结果的函数

## debounce 
-  函数防抖

## throttle 
- 函数节流

## traverse 
- traverse(arr, { 'family.name'(target: any, index: number, item: any) { console.log(target, index,) } })
- 遍历对象或数组,快速从options中函数名获取arr中的值
- 函数接收target-当前遍历的值，index-当前遍历的索引，item-当前遍历的那一项
- 可以指定多个属性
- 使用类似与babel的traverse方法

## transformKey 
- transformKey(obj, { 'family.name': 'familyName', 'family.age': 'familyAge' })
- 支持多层级的key
- 将对象的key转换成需要的key
  
## GitHub地址
[欢迎PR](https://github.com/Simon-He95/simon-js-tool)
