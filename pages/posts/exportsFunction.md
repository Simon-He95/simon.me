---
title: Exports Function
description: Wish this is the end.
date: 2022-06-15T22:00:00.000+00:00
lang: en
duration: 2day
subtitle: 'Author: Simon'
---

<script setup lang="ts">
const directoryList = {
  jsonExportZip:"Json is exported as a zip file",
  tableExportExcel:"HTMLTableElement Convert to Excel export",
  jsonExportExcel:"Json is exported to excel",
  exportPdf:"Export the pdf file",
}
</script>

> [中文 Chinese Version](/posts/exportsFunction-zh)

## This article is documentation that describes the encapsulated utility functions [exports functions](https://www.npmjs.com/package/exports-function)
<div flex="~" ><strong>peculiarity</strong><span>: High scalability, flexible and convenient calling <span i-fluent:flash-28-filled bg-amber  /></span></div>

## More
- Common functions [simon-js-tool](/posts/ToolsFunction)
- Threejs simplistic [s-three](/posts/threejs)
- Echarts simplistic [s-charts](/posts/charts)
- numsWheel component [s-nums-wheel](/posts/numsWheel)

## Instructions for use
```bash
npm i exports-function # install

import { 
  jsonExportZip,
  ...
 } from 'exports-function' # Ingestion on demand

```

## Directory structure
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
- params:
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
[Welcome to PR](https://github.com/SimonHe1995/exportsFunction)
