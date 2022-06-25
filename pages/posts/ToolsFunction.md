---
title: Tools Function
description: Wish this is the end.
date: 2022-06-12T22:00:00.000+00:00
lang: zh
duration: 2day
subtitle: 'Author: Simon'
---

## 此文是介绍封装的工具函数的文档[simon-js-tool](https://www.npmjs.com/package/simon-js-tool)
整理了<strong>70+</strong>常用函数,持续更新中<vivid-typing content="......" inline-block :infinity="true"></vivid-typing>
<div flex="~" items-center><strong>特点</strong>: 扩展性高,调用灵活便洁 <svg t="1656097148236" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1337" w-7 m-l-1><path d="M838.485333 589.653333a65.194667 65.194667 0 0 1-65.194666-65.365333 64.682667 64.682667 0 0 1-19.285334 46.250667 63.829333 63.829333 0 0 1-46.08 19.114666 65.194667 65.194667 0 0 1-65.365333-65.365333 65.194667 65.194667 0 0 1-19.114667 46.250667 64.170667 64.170667 0 0 1-46.08 19.114666A65.194667 65.194667 0 0 1 512 524.288a65.194667 65.194667 0 0 1-19.114667 46.250667 64.512 64.512 0 0 1-46.250666 19.114666 65.194667 65.194667 0 0 1-65.194667-65.365333 65.194667 65.194667 0 0 1-19.114667 46.250667 64.512 64.512 0 0 1-46.250666 19.114666 65.365333 65.365333 0 0 1-65.365334-65.365333A65.365333 65.365333 0 0 1 187.733333 589.653333a58.538667 58.538667 0 0 1-21.162666-3.242666V899.413333h690.517333V586.752a67.242667 67.242667 0 0 1-18.602667 2.901333z" fill="#EDF4FF" p-id="1338"></path><path d="M512 833.024a3334.826667 3334.826667 0 0 1-345.088-17.066667v83.456h690.176v-84.138666A3334.826667 3334.826667 0 0 1 512 833.024z" fill="#D8E3F0" p-id="1339"></path><path d="M331.264 240.298667h60.074667v81.066666h-60.074667zM692.906667 321.365333h-60.074667v-81.066666h60.074667z" fill="#FCFEFF" p-id="1340"></path><path d="M280.234667 657.237333H489.813333v130.218667H280.234667z" fill="#96DDFF" p-id="1341"></path><path d="M395.434667 657.237333l-41.130667 130.218667H307.2l41.130667-130.218667h47.104zM500.565333 657.237333l-6.997333 130.218667h-81.237333l41.130666-130.218667h47.104z" fill="#69BAF9" p-id="1342"></path><path d="M599.04 657.237333h144.725333V899.413333H599.04z" fill="#96DDFF" p-id="1343"></path><path d="M599.04 848.896v51.2h144.725333v-58.197333c-47.616 3.242667-95.232 5.802667-144.725333 6.997333z" fill="#69BAF9" p-id="1344"></path><path d="M274.090667 124.586667h475.989333v115.712H274.090667z" fill="#FFC670" p-id="1345"></path><path d="M749.909333 124.586667v115.712H496.469333l31.061334-115.712h222.378666z" fill="#FFA742" p-id="1346"></path><path d="M904.533333 524.288a65.365333 65.365333 0 1 1-130.56 0z" fill="#D8E3F0" p-id="1347"></path><path d="M903.850667 524.288h-130.56l-37.376-202.922667h111.957333l55.978667 202.922667z" fill="#FCFEFF" p-id="1348"></path><path d="M773.290667 524.288a65.365333 65.365333 0 0 1-130.730667 0z" fill="#F0504D" p-id="1349"></path><path d="M773.290667 524.288h-130.730667l-18.602667-202.922667h111.957334l37.376 202.922667z" fill="#F6716F" p-id="1350"></path><path d="M642.56 524.288a65.365333 65.365333 0 1 1-130.56 0z" fill="#D8E3F0" p-id="1351"></path><path d="M642.56 524.288H512V321.365333h111.957333l18.602667 202.922667z" fill="#FCFEFF" p-id="1352"></path><path d="M512 524.288a65.365333 65.365333 0 1 1-130.56 0z" fill="#F0504D" p-id="1353"></path><path d="M512 321.365333v202.922667h-130.56l18.602667-202.922667H512z" fill="#F6716F" p-id="1354"></path><path d="M381.44 524.288a65.365333 65.365333 0 0 1-130.730667 0z" fill="#D8E3F0" p-id="1355"></path><path d="M400.042667 321.365333l-18.602667 202.922667h-130.730667l37.376-202.922667h111.957334z" fill="#FCFEFF" p-id="1356"></path><path d="M250.709333 524.288A65.365333 65.365333 0 0 1 187.733333 589.653333a68.266667 68.266667 0 0 1-68.266666-65.365333z" fill="#F0504D" p-id="1357"></path><path d="M288.085333 321.365333l-37.376 202.922667H120.32a18.602667 18.602667 0 0 1 0-3.072l55.978667-199.850667z" fill="#F6716F" p-id="1358"></path><path d="M506.88 771.072v-113.834667a17.066667 17.066667 0 0 0-17.066667-17.066666H280.234667a17.066667 17.066667 0 0 0-17.066667 17.066666v113.834667a17.066667 17.066667 0 0 0-13.824 17.066667 17.066667 17.066667 0 0 0 17.066667 17.066666h237.397333a17.066667 17.066667 0 0 0 17.066667-17.066666 17.066667 17.066667 0 0 0-13.994667-17.066667z m-138.922667 0h-70.656v-96.768h70.656z m104.789334 0h-70.656v-96.768h70.656zM657.408 787.456a20.992 20.992 0 1 0-20.992-20.992 20.992 20.992 0 0 0 20.992 20.992z" fill="#3D3D63" p-id="1359"></path><path d="M921.6 882.346667h-47.445333V598.357333A81.408 81.408 0 0 0 921.6 524.288a18.602667 18.602667 0 0 0 0-4.437333l-55.978667-203.093334a17.066667 17.066667 0 0 0-17.066666-12.458666h-138.752v-46.933334h40.106666a17.066667 17.066667 0 0 0 17.066667-17.066666V124.586667a17.066667 17.066667 0 0 0-17.066667-17.066667H274.090667a17.066667 17.066667 0 0 0-17.066667 17.066667v115.712a17.066667 17.066667 0 0 0 17.066667 17.066666h40.106666v46.933334h-138.069333a17.066667 17.066667 0 0 0-17.066667 12.458666L103.765333 516.778667a18.602667 18.602667 0 0 0 0 4.437333 87.04 87.04 0 0 0 26.794667 62.634667 79.018667 79.018667 0 0 0 19.285333 13.482666v285.013334H102.4a17.066667 17.066667 0 0 0 0 34.133333h819.2a17.066667 17.066667 0 0 0 0-34.133333zM649.728 300.885333v-40.106666h25.941333v40.106666z m-358.4-159.232h441.514667v81.578667H291.157333z m83.114667 119.466667v40.106667h-26.112v-40.448z m34.133333-3.413333h207.018667v46.933333H408.405333z m318.122667 624.64H616.106667V674.304h110.592z m113.322666 0h-79.189333V657.237333a17.066667 17.066667 0 0 0-17.066667-17.066666H599.04a17.066667 17.066667 0 0 0-17.066667 17.066666V882.346667H183.978667V606.378667h4.778666a81.066667 81.066667 0 0 0 54.784-24.064 64.853333 64.853333 0 0 0 7.168-8.192 82.432 82.432 0 0 0 65.365334 32.256 80.896 80.896 0 0 0 58.197333-24.064 104.789333 104.789333 0 0 0 7.168-8.021334 82.432 82.432 0 0 0 65.194667 32.085334 81.066667 81.066667 0 0 0 58.197333-24.064 82.090667 82.090667 0 0 0 7.168-8.192 82.432 82.432 0 0 0 65.365333 32.256 81.066667 81.066667 0 0 0 58.026667-24.064 82.090667 82.090667 0 0 0 7.168-8.192 82.432 82.432 0 0 0 65.365333 32.256 81.066667 81.066667 0 0 0 58.197334-24.064 104.789333 104.789333 0 0 0 7.168-8.021334 82.090667 82.090667 0 0 0 65.194666 32.085334h1.536z m-1.536-309.76a48.298667 48.298667 0 0 1-48.128-48.298667 17.066667 17.066667 0 0 0-34.133333 0 48.128 48.128 0 0 1-14.336 34.133333 47.104 47.104 0 0 1-34.133333 13.994667 48.298667 48.298667 0 0 1-48.298667-48.298667 17.066667 17.066667 0 0 0-34.133333 0 48.298667 48.298667 0 0 1-48.128 48.298667A48.298667 48.298667 0 0 1 529.066667 524.288a17.066667 17.066667 0 0 0-34.133334 0 48.298667 48.298667 0 1 1-96.426666 0 17.066667 17.066667 0 0 0-34.133334 0 48.298667 48.298667 0 1 1-96.597333 0 17.066667 17.066667 0 0 0-34.133333 0A48.128 48.128 0 0 1 187.733333 572.586667a47.104 47.104 0 0 1-34.133333-13.312 52.565333 52.565333 0 0 1-16.213333-35.84l51.2-185.002667h78.506666l-20.309333 110.762667a17.066667 17.066667 0 0 0 13.653333 19.797333h3.072a17.066667 17.066667 0 0 0 17.066667-13.994667l21.504-116.906666h79.189333l-10.410666 112.128a17.066667 17.066667 0 0 0 15.530666 18.602666h1.536a17.066667 17.066667 0 0 0 17.066667-15.530666l10.581333-115.370667H494.933333v114.346667a17.066667 17.066667 0 0 0 34.133334 0v-113.834667h79.189333l10.581333 115.370667a17.066667 17.066667 0 0 0 17.066667 15.530666h1.536a17.066667 17.066667 0 0 0 15.530667-18.602666l-10.410667-112.128h79.189333l21.504 116.906666a17.066667 17.066667 0 0 0 17.066667 13.994667h3.072a17.066667 17.066667 0 0 0 13.653333-19.797333l-20.309333-110.762667h78.506667l51.2 187.733333a47.957333 47.957333 0 0 1-14.165334 32.085334 47.104 47.104 0 0 1-33.792 13.824z" fill="#3D3D63" p-id="1360"></path></svg></div>

## 使用说明
```bash
npm i simon-js-tool # 安装

import { 
  deepCompare
 } from 'simon-js-tool' # 按需引入

```

## timeCost
- 计算函数执行时间
- timeCost(fn: Function) : number
```javascript
timeCost(()=>{
  for(let i=0;i<1000;i++){
    console.log(i)
  }
}) // 输出: timeCost: 0.046s
```

## log
- 简化console.log的使用
- log(s: string,color: string,fontSize: number)
- color: 输出的颜色, fontSize: 字体大小
```javascript
log('hello world') # 打印日志
```

## copy
- js控制复制的内容
- copy(str: string): boolean # 成功返回true,失败返回false
```javascript
btn.onclick = () =>  {
  if(copy(textarea.value)){
    alert('复制成功')
  }
}
```

## getDateList
- 获取指定日期范围内正负多少天的日期列表
- getDateList(start: string, day: number = 0) start: 开始日期以/或-分割 1991/03/02 1001-03-02, day: 正负多少天

```javascript
getDateList('1991/3/02', 7)
// [ '1991-3-02', '1991-3-03', '1991-3-04', '1991-3-05', '1991-3-06', '1991-3-07', '1991-3-08' ]
```

## isType
- `isType(o:any, type:string)`: 判断obj是否是type类型
- 混合类型判断,type 如果是多种类型,用'|'分隔 如: 缩写 - 'O|S'  全写 - 'Object|String' 
```javascript
isType(1, 'Number') // true
isType('1', 'N') // false
isType({}, 'O | A') // true (Object | Array)
isType(new Promise(), 'P') // true (Promise)
isType(function(){}, 'P | F') // true (Promise | Function)
```

## randomDate
- 随机生成日期
- 可指定随机范围 start:'1999/01/01' end:'2099/12/31'
```javascript
// end默认是当前日期
randomDate('1999/01/01') // Mon Jun 06 2011 15:11:37 GMT+0800 (中国标准时间) 可再通过formateDate转换为其他格式 如'yyyy-MM-dd'
```

## uniqueArray
- 去除数组中重复的元素
- 支持去除数组中的对象的重复元素
```javascript
const array = [
      {
        name: "simon",
        age: "19",
        hobby: ['1', '2', '3']
      },
      {
        name: "simon",
        age: "19",
        hobby: ['1', '2', '3']
      },
    ]
    uniqueArray(array) => [
      {
        name: "simon",
        age: "19",
        hobby: ['1', '2', '3']
      }
    ]
```

## deepCompare 
- ignoreKeys忽略指定的keys可以为数组或者正则表达式
- 比较2个对象的差异返回不同的属性和具体不同的值
- 返回{error:[],errorMsg:[]} 格式,error对应的是不同的属性，errorMsg对应的是不同的属性的不同的值和位置
- 如果两个对象相同，则返回{error:[],errorMsg:[]}，error为空，errorMsg为空
```javascript
// params: { obj1: any, obj2: any, ignoreKeys: string[] | RegExp }
const obj1 = {a:1,b:2,c:3}
const obj2 = {a:1,b:2,c:3}
const obj3 = {a:1,b:2,c:4}
deepCompare(obj1,obj2) // {error:[],errorMsg:[]}
deepCompare(obj1,obj3) // {error:['c'],errorMsg:['3','4']}
```
## deepMerge 
- Object.assign的深度拷贝版本
- 可以接受多个参数，存在相同层级的相同属性，后者覆盖前者
- 返回第一个对象
```javascript
// params:  params: { target: Record<any, any>, ...sources: Record<any, any>[] } => target
const target = { a: 1, b: 2, c: { d: 3, e: 4 } }
const source1 = { b: 4, c: { d: 5 } }
const source2 = { c: { e: 6 } }
const result = deepMerge(target, source1, source2)
console.log(result) // { a: 1, b: 4, c: { d: 5, e: 6 } }
```
## asyncPool 
- 控制异步并发执行的数量
- 参数： limit-控制异步并发执行的数量，tasks-异步任务数组
```js
// limit 并发数量 , tasks httpRequest[]
asyncPool(limit, tasks).then((results) => {
  // results is an array of results
})
```

## quickFind 
-  quickFind(array: any[], key: any) ,返回一个新的实例
- 在实例中find方法可以根据key查找对应的项-O(1)
- set更新或新增项-O(1)
- delete删除项-O(1)
```javascript
const find = quickFind([{id:1,name:'simon'},{id:2,name:'simon'},'id'])
find.find(1)
find.set({id:1,name:'simon'})
find.delete(1)
```
## quickFilter 
- 快速模糊查找key名字的项和值 如: 'name=/h/'
```javascript
// quickFilter(array: any[], key: string | Array<string>)
    const arr = [
      {
        name: 'simon',
        age: 18,
        id: 0,
      },
      {
        name: 'simon5',
        age: 49,
        id: 3,
      },
      {
        name: "hi"
      },
      {
        name: "hi",
        age: "2",
        en: "0"
      }
    ]
 quickFilter(arr,['id=22', 'name=simon5']) // [{"age": 39,"id": 22,"name": "simon3"},{"age": 9,"id": 3,"name": "simon5"}]
 quickFilter(arr,['name=/h/']) // [{"age": "2","en": "0","name": "hi"},{"name": "hi"}]
```
## deepClone 
- 支持循环依赖
- 支持复杂类型
- 轻量级的深拷贝
```javascript
const obj = {
  a: 1,
  b: {
    c: 2,
    d: {
      e: 3
    }
  }
}
obj.self = obj
const obj2 = deepClone(obj)
```
## curry 
- 函数柯里化
```javascript
const add = (a, b) => a + b
const add1 = curry(add)
const add2 = add1(1)
const add3 = add2(2)
add3(3) // 6
```

## memorizeFn 
- 根据参数返回一个能缓存结果的函数
- 参数：fn-需要缓存的函数
```javascript
let count = 0
const fn = memorizeFn(()=> count++)
fn()
fn()
count => 1
```

## debounce 
-  函数防抖
-  参数：fn-需要防抖的函数，delay-防抖的时间
```javascript
const f = debounce(() => {
  console.log('debounce')
}, 1000)
```
## throttle 
- 函数节流
- 参数：fn-要节流的函数, delay-节流时间
``` javascript
  const f = throttle(() => {
    console.log('throttle')
  }, 1000)
```

## traverse 
- 遍历对象或数组,快速从options中函数名获取arr中的值
- 函数接收target-当前遍历的值，index-当前遍历的索引, item-当前遍历的那一项
- 可以指定多个属性
- 使用类似与babel的traverse方法
- 使用场景：快速提取数据中的某些属性,转换为新的数据结构
```javascript
// traverse(arr, { 'family.name'(target: any, index: number, item: any) { console.log(target, index) } })
const obj = {
  name: 'simon',
  age: 18,
  family: {
    name: 'simon',
    age: 18,
  },
}
traverse(obj, {
  'family.name'(target: any, index: number, item: any) {
    console.log(target, index)
  }
})
```

## transformKey 
- 支持多层级的key
- 将对象的key转换成需要的key
- 使用场景: 前端定义字段有后端不一样的key，比如后端的key是id，前端的key是_id
```javascript
// transformKey(obj, { 'family.name': 'familyName', 'family.age': 'familyAge' })
const obj = {
  family: {
    name: 'simon',
    age: 18
  },
  name: 'simon'
}
const newObj = transformKey(obj, {
  'family.name': 'familyName',
  'family.age': 'familyAge'
})
console.log(newObj)
// { familyName: 'simon', familyAge: 18, name: 'simon' }
```


## once
- 只执行一次的函数
```javascript
document.addEventListener('click', once(() => {
  console.log('click')
}))
```

## vFetch
- 基于fetch的axios api 式promise请求封装
- 支持拦截前追加headers
```javascript
type VFetchConfig = {
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
interface Interceptors {
    request: {
      use: (successCallback /* 请求前拦截处理*/, errorCallback /* 错误处理*/)
    }
    response: {
      use: (successCallback /* 响应后成功处理*/, errorCallback /* 响应后失败处理*/)
    }
  }
  // useage
vFetch(options:Record<string,string>).then(res =>{}, err =>{})
```


## stringify
```javascript
stringify({ user: 'simon', age: '18' }) => 'user=simon&age=18'
```
## parse
```javascript
parse('user=simon&age=18') => { user: 'simon', age: '18' }
```
## jsCookie
```javascript
jsCookie.set('name', 'simon') 
jsCookie.get('name') => 'simon' 
jsCookie.remove('name')  
jsCookie.get('name') => ''
```
## uuid
- 生成uuid 
- 支持限制生成的uuid长度和类型 
```javascript
uuid() => '71A793A9-BBAE-49FC-B957-5BC71E5AD044'
uuid(16, 'hex') => 'a0b1c2d3e4f5' uuid(8, 2) => '11110011'
```
## formateDate
- 格式化日期
```javascript
formateDate(new Date(), 'yyyy-MM-dd') => '2019-01-01'
```
## monitorPef
- 数字化浏览器性能指标
- 重定向时间 重定向次数 首屏时间 上一页卸载时间 浏览器读取缓存时间 DNS解析时间 TCP完成握手时间 HTTP请求响应完成时间 DOM开始加载前所花费时间 DOM加载完成时间 脚本加载时间 onload事件时间 页面完全加载时间 
``` javascript
monitorPef() 
/*
重定向时间	0
重定向次数	0
首屏时间	414
上一页卸载时间	0
浏览器读取缓存时间	28.200000047683716
DNS解析时间	0
TCP完成握手时间	0.3097000000476837
HTTP请求响应完成时间	0.026600000143051146
DOM开始加载前所花费时间	0.36460000014305116
DOM加载完成时间	2.600299999952316
脚本加载时间	0.00040000009536743164
onload事件时间	0
页面完全加载时间	3.0144000000953675
*/
```
## getLocation
- 基于promise封装的获取地理位置信息
- params: 高精度 超时时间 缓存时间
```javascript
await getLocation() =>  { enableHighAccuracy: boolean = false, timeout: number = 5000, maximumAge: number = 0 }
```
## getDevice
- 获取系统信息
- os:系统 dev:浏览器
```javascript
getDevice() => { os: 'android', dev: 'chrome' }
```
## preload
- 预加载图片
```javascript
preload('https://img.yzcdn.cn/vant/cat.jpeg')
preload(['https://img.yzcdn.cn/vant/cat.jpeg', 'https://img.yzcdn.cn/vant/dog.jpeg'])
```

## lazyLoad
- 图片懒加载
- params-1: 图片的集合 Element | Element[] | NodeList[] | class | id | tagName 
- params-2: root 指定相对容器默认是body 
- params-3: rootMargin 指定相对容器的边距 默认距离容器底部200px时候加载(↑ → ↓ ←) '0px 0px 200px 0px' 
- params-4: threshold 指定图片加载的阈值
```javascript
// usage
  lazyLoad(document.querySelectorAll("img"));
  lazyLoad("img[data-src]");
  lazyLoad(".img-wrapper>img");
// template
  <img src="temp" data-src="../public/favicon.svg" alt="" h-10 bg-red />
```

## addScript
- 动态添加script标签放 => ead
```javascript
addScript('https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js')
```
## addStyle
- 动态添加style标签 => head
```javascript
addStyle(`
  .test {
    color: red;
  }
`)
```
## download
- 下载文件
```javascript
download('https://www.baidu.com/img/bd_logo1.png', 'baidu.png')
```

## trim
- 字符串去除空格
- type: '前空格' | '后空格' | '前后空格' | '所有空格'
```javascript
trim(str: string,type: 'pre' | 'post' | 'around' | 'all' = 'around') 
trim('  h e l l o  ') => 'h e l l o'
trim('  h e l l o  ', 'pre') => 'h e l l o  '
trim('  h e l l o  ', 'post') => '  h e l l o'
trim('  h e l l o  ', 'all') => 'hello'
```

## compressCss
- 压缩css
- 参数: css: string
```javascript
compressCss(css: string) => string
```

## scrollToTop
- 回到顶部
```javascript
scrollToTop()
```

## createEventBus
- createEventBus() 
- emit 事件发送
- on 事件监听
- off 事件取消
- 创建发布订阅模式的实例

## randomHexColor
- 随机生成十六进制颜色
```javascript
randomHexColor() => '#ff0000'
```

## randomRgb
- 随机生成RGB颜色
```javascript
randomRgb() => 'rgb(255,0,0)'
```

## httpsRedirect
- https重定向
```javascript
httpsRedirect()
```

## scrollToView
- 滚动到指定元素
```javascript
scrollToView(el: HTMLElement | string)
```

## getScrollPosition
- 获取滚动位置
```javascript
getScrollPosition() => { x: number, y: number }
```

## camelize
- 驼峰化
```javascript
// hello-world
camelize(str: string) => 'helloWorld'
```

## hyphenate
- 连字符化
```javascript
// helloWorld
hyphenate(str: string) => 'hello-world'
```

## getUrlParam
- 获取url参数
- 默认不传入url，获取当前页面url参数
```javascript
getUrlParam('?name=simon&age=18') => { name: 'simon', age: '18' }
```

## fullScreen
- fullScreen()
- 全屏

## exitFullScreen
- exitFullScreen()
- 退出全屏

## toBase64
- 将blob | file | url转换为base64
```javascript
toBase64(file: File, type: 'file' | 'blob' | 'url' = 'url') => string
```

## base64ToFile
- 将base64转换为file
```javascript
base64ToFile(s: string, name: string) => File
```

## base64ToBlob
- 将base64转换为blob
```javascript
base64ToBlob(s: string) => Blob
```

## uppercaseNum
- 将数字转换为大写字母
```javascript
// 1 => '一'
uppercaseNum(num: number | string) => string
```

## formateNum
- 将数字格式化
- integer: 'floor' | 'ceil' 小数截取方式 floor:向下取整 ceil:向上取整
```javascript
// 12253.123 => 12,253.12
formateNum(number: number | string, decimals = 2, integer: 'floor' | 'ceil' = 'ceil') => string
```

## interceptError
- 异常拦截
- 参数：可能存在异常的函数，返回一个promise类型的错误处理函数
- 可以避免不断的try...catch
```javascript
// interceptError(() => { throw new Error('error') }).catch(err=>{ console.log(err) })
interceptError(fn: Function) => Promise<any>
```
## isBottom
- 判断滚动是否触底
- distance: 距离底部的距离作为触底的判断标准 默认0
```javascript
isBottom(distance: string = 0) => boolean
```

## calNum
- 计算数字
- type: '加' | '减' | '乘' | '除'
```javascript
console.log(calNum.add(0.1, 0.2, 0.2)) => 0.5
console.log(calNum.div(0.1, 0.2, 0.2)) => 2.5
console.log(calNum.sub(0.1, 0.2, 0.2)) => -0.3
console.log(calNum.mul(0.1, 0.2, 0.2)) => 0.004
```

## 规则判断
- isMobile  - 判断是否是手机号
- isEmail - 判断是否是邮箱
- isIdCard  - 判断是否是身份证
- hasCn - 判断是否含有中文
- isFile - 判断是否是File类型
- isBlob - 判断是否是Blob类型

## GitHub地址
[欢迎PR](https://github.com/Simon-He95/simon-js-tool)
