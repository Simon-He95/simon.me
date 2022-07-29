---
title: Exports Function
description: Wish this is the end.
date: 2022-06-15T22:00:00.000+00:00
lang: zh
duration: 2day
subtitle: 'Author: Simon'
---

<script setup lang="ts">
const directoryList = {
  jsonExportZip:"json导出为zip文件",
  tableExportExcel:"HTMLTableElement 转换为 Excel 导出",
  jsonExportExcel:"json导出成excel",
  exportPdf:"导出pdf",
}
</script>

[[toc]]

> [英文 English Version](/posts/exportsFunction)

## 此文是介绍封装的工具函数的文档[exportsFunction](https://www.npmjs.com/package/exports-function)
<div flex="~" items-center><strong>特点</strong>: 扩展性高,调用灵活便捷 <span i-fluent:flash-28-filled bg-amber  /></div>

## 更多
- 通用函数 [simon-js-tool](/posts/ToolsFunction-zh)
- threejs简单化 [s-three](/posts/threejs-zh)
- Echarts简单化 [s-charts](/posts/charts-zh)
- numsWheel 组件 [s-nums-wheel](/posts/numsWheel)
- vAxios 请求封装[v-axios](/posts/vAxios)

## 使用说明
```bash
npm i exports-function # 安装

import { 
  jsonExportZip,
  ...
 } from 'exports-function' # 按需引入

```

## 目录结构
<Directory type="zh" :lists="directoryList"></Directory>


## jsonExportZip
- jJson is exported as a zip file
- params:
  - header: string[]
  - data: any[][]
  - fileName: string
```js
jsonExportZip({
  header: ['colums1', 'colums2', 'colums3'],
  data: [
    ['data1', 'data2', 'data3'],
    ['data4', 'data5', 'data6'],
    ['data7', 'data8', 'data9'],
  ],
  fileName: 'test',
})
```

## tableExportExcel
- HTMLTableElement Convert to Excel export
- params:
  - table: HTMLTableElement | string
  - filename: string = 'test.xlsx
  - sheetname: string = 'sheet1'
```js
tableExportExcel('.my-table', 'table表格.xlsx') // Export the table .xlsx of the .my-table element
```

## jsonExportExcel
- Json is exported to excel
- 参数:
  - exportExcelOptions： {
    multiHeader?: [],
    header: [],
    data: any[][],
    filename?: string = 'excel-list',
    merges?: string[] = [],
    autoWidth: Boolean = false,
    bookType?: string = 'xlsx',
    sheetName?:string = 'sheet1',
  }
```js
jsonExportExcel({
  header: ['Name', 'Age', 'Gender'],
  data: [
    ['Little King', '18', 'Male'],
    ['Little Lee', '20', 'Male'],
    ['Xiao Zhao', '21', 'male'],
    ['Xiao Zhang', '22', 'male'],
    ['Xiao Liu', '23', 'male'],
  ],
  fileName: 'Information on students in the second class of the third year',
  bookType: 'xlsx',
  sheetName: 'Student Information Form',
}) // Export information .xlsx for students in the second class of the third year
```

## exportPdf
- Export the pdf file
- params:
  - src: Picture address
  - filename: filename
```js
exportPdf('./a.jpg', 'xxx') // Export xxx .pdf
```

## GitHub
[欢迎PR](https://github.com/SimonHe1995/exportsFunction)
