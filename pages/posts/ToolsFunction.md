---
title: Tools Function
description: Wish this is the end.
date: 2022-06-12T22:00:00.000+00:00
lang: zh
duration: 2day
---

## 此文是介绍封装的工具函数的文档[simon-js-tool](https://www.npmjs.com/package/simon-js-tool)
还在持续更新中，尽情期待...

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
traverse,
isFn,
isStr,
isNum,
isPlainObject,
isUndef,
isArray,
isPromise,
isNaN.
isSymbol,
isNull,
isReg,
VFetch,
interceptError } from 'simon-js-tool' # 按需引入

```


## deepCompare 
- params: { obj1: any, obj2: any, ignoreKeys: string[] | RegExp }
- ignoreKeys忽略指定的keys可以为数组或者正则表达式
- 比较2个对象的差异返回不同的属性和具体不同的值
- 返回{error:[],errorMsg:[]} 格式,error对应的是不同的属性，errorMsg对应的是不同的属性的不同的值和位置
- 如果两个对象相同，则返回{error:[],errorMsg:[]}，error为空，errorMsg为空

## deepMerge 
- params:  params: { target: Record<any, any>, ...sources: Record<any, any>[] } => target
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
- 参数：fn-需要缓存的函数

## debounce 
-  函数防抖
-  参数：fn-需要防抖的函数，delay-防抖的时间

## throttle 
- 函数节流
- 参数：fn-要节流的函数, delay-节流时间

## traverse 
- traverse(arr, { 'family.name'(target: any, index: number, item: any) { console.log(target, index,) } })
- 遍历对象或数组,快速从options中函数名获取arr中的值
- 函数接收target-当前遍历的值，index-当前遍历的索引, item-当前遍历的那一项
- 可以指定多个属性
- 使用类似与babel的traverse方法

## transformKey 
- transformKey(obj, { 'family.name': 'familyName', 'family.age': 'familyAge' })
- 支持多层级的key
- 将对象的key转换成需要的key

## vFetch
- 基于fetch的axios api 式promise请求封装
-  type VFetchConfig = {
  url: string // 请求地址
  baseURL?: string // 基础url
  body?: any // body参数 {},GET请求会合并到url后面
  method?: Method // 请求类型 默认GET 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' 支持vFetch.get | post | delete | put的形式
  headers?: Record<string, any> // 请求头 例如: {'Content-Type': 'application/json'} 支持在请求拦截器中设置追加
  credentials?: Credentials // 请求是否带上cookie 默认omit 'include' | 'same-origin' | 'omit' 
  params?: Record<string, string> // 请求参数 根据bodyType决定是否会被序列化
  timeout?: number // 超时时间 ms 默认为20000
  responseType?: ResponseType // 返回类型 默认json 'formData' | 'text' | 'blob' | 'arrayBuffer' | 'json'
  bodyType?: BodyType // 请求类型 默认json 'json' | 'form' | 'file' 
  cache?: Cache // 缓存类型 默认不缓存 'no-cache' | 'default' | 'force-cache' | 'only-if-cached' 
  redirect?: Redirect // 重定向 默认follow follow：跟随重定向，error：抛出错误，manual：手动处理
  mode?: Mode // cors, no-cors, same-origin 默认cors cors：跨域，no-cors：不跨域，same-origin：同源
  transformResponse?: (response: Response) => Response // 响应数据转换
}
- interceptors: {
    request: {
      use: (successCallback // 请求前拦截处理, errorCallback // 错误处理)
    }
    response: {
      use: (successCallback // 响应后成功处理), errorCallback // 响应后失败处理)
    }
  }
- vFetch(options:Record<string,string>).then(res =>{}, err =>{})
- 支持拦截前追加headers， config.headers.set('x-token', token)

## stringify
- stringify({ user: 'simon', age: '18' }) => 'user=simon&age=18'

## parse
- parse('user=simon&age=18') => { user: 'simon', age: '18' }

## jsCookie
- jsCookie.set('name', 'simon') jsCookie.get('name') => 'simon' jsCookie.remove('name')  jsCookie.get('name') => ''

## interceptError
- 异常拦截
- 参数：可能存在异常的函数，返回一个promise类型的错误处理函数
- 可以避免不断的try...catch

## 类型判断
- isArray(obj) - 判断是否是数组
- isPlainObject(obj)  - 判断是否是纯对象
- isFn(obj) - 判断是否是函数
- isStr(obj)  - 判断是否是字符串
- isNum(obj)  - 判断是否是数字
- isBool(obj) - 判断是否是布尔值
- isUndef(obj)  - 判断是否是undefined
- isNull(obj) - 判断是否是null
- isNaN(obj)  - 判断是否是NaN
- isReg(obj)  - 判断是否是正则
- isSymbol(obj)  - 判断是否是Symbol
- isPromise(obj)  - 判断是否是Promise

## GitHub地址
[欢迎PR](https://github.com/Simon-He95/simon-js-tool)
