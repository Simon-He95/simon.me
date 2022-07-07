<script setup lang="ts">
import { uppercaseNum } from 'simon-js-tool'
const lists = {
  sliderValidation: '滑块验证功能',
  picInPic: 'video画中画模式',
  shareScreen: '浏览器屏幕分享',
  dbStorage: '浏览器大数据存储',
  waterfall: '图片瀑布流布局',
  numWheel: '数字滚轮控件',
  dragEvent: '点击拖拽松开事件封装函数',
  compressImage: '图片压缩函数',
  sThree: 'three封装函数',
  sCharts: 'echarts封装函数',
  addEventListener: '添加事件函数',
  createElement: '创建dom元素',
  sleep: '睡眠函数',
  htmlTransform: '强大的template模板ast渲染器',
  idleCallbackWrapper: '强大的requestIdleCallback',
  animationFrameWrapper: '强大的requestAnimationFrame',
  DotImageCanvas: '点图画',
  DotTextCanvas: '点阵字',
  CreateSignatureCanvas: '生成一个签名画布',
  fileSplice: '大文件切片',
  pwdLevel: '鉴定数字的强度',
  sort: '强大的数组排序',
  getLru: '获取最近使用的缓存',
  escapeHtml: '将html字符串转换为实体字符串',
  unescapeHtml: '将实体字符串转换为html字符串',
  timeCost: '计算函数执行时间',
  log: '简化console.log的使用',
  copy: '将内容复制到剪贴板',
  getDateList: '获取日期列表',
  isType: '类型判断函数',
  randomDate: '随机日期',
  uniqueArray: '强大的数组去重',
  deepCompare: '强大的对象比较函数',
  deepMerge: 'Object.assign的深拷贝',
  asyncPool: '并发执行函数',
  quickFind: 'O(1)的查找函数',
  quickFilter: '数组快速模糊查找',
  deepClone: '强大的对象深拷贝',
  curry: '柯里化',
  memorizeFn: '缓存函数',
  debounce: '防抖函数',
  throttle: '节流函数',
  traverse: '神奇的遍历对象函数',
  transformKey: '映射对象的key函数',
  once: '只执行一次的函数',
  vFetch: '强大fetch封装函数',
  stringify: '对象转字符串',
  parse: '字符串转对象',
  jsCookie: 'cookie封装函数',
  uuid: '生成uuid',
  formateDate: '日期格式化函数',
  monitorPef: '性能监控函数',
  getLocation: '获取当前位置函数',
  getDevice: '获取设备信息函数',
  preload: '预加载图片函数',
  lazyLoad: '图片懒加载函数',
  addScript: '动态添加script函数',
  addLink: '动态添加link函数',
  addStyle: '动态添加style函数',
  download: '文件下载函数',
  trim: '字符串去空格函数',
  compressCss: 'css压缩函数',
  scrollToTop: '滚动到顶部函数',
  createEventBus: '事件总线函数',
  randomHexColor: '随机生成十六进制颜色函数',
  randomRgb: '随机生成RGB函数',
  httpsRedirect: 'https重定向函数',
  scrollToView: '指定元素滚动到可视区域函数',
  getScrollPosition: '获取滚动位置函数',
  camelize: '驼峰化函数',
  hyphenate: '连字符化函数',
  getUrlParam: '获取url参数函数',
  fullScreen: '全屏函数',
  exitFullScreen: '退出全屏函数',
  toBase64: '转base64函数',
  base64ToFile: 'base64转文件函数',
  base64ToBlob: 'base64转blob函数',
  uppercaseNum: '数字转大写字母函数',
  formateNum: '数字格式化函数',
  interceptError: '错误拦截函数',
  isBottom: '判断是否到达底部函数',
  calNum: '计算数字函数',
  规则判断: 'isMobile isEmail isIdCard hasCn isFile isBlob',
}
</script>

<template>
  <a
    v-for="(value, key, i) in lists"
    :key="key"
    flex
    items-center
    justify-between
    p-x-5
    p-y-2
    :href="'#' + key.toLowerCase()"
    alt="22"
    style="-webkit-tap-highlight-color: rgba(255, 255, 255, 0)"
  >
    <div class="title" text-xl color="--fg-deep" font-bold flex items-center font-serif>
      <span m-r-10 text-3xl write-vertical-right font-mono>{{
        i < 10 ? "0" + i : i
      }}</span>{{ key }}
    </div>
    <div class="des" text-xs color="--fg" font-mono lt-md:hidden>
      {{ value }}
    </div>
  </a>
</template>

<style scoped></style>
