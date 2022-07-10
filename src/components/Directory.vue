<script setup lang="ts">
import { uppercaseNum } from 'simon-js-tool'
defineProps({
  type: String,
})
const lists = {
  insertElement: '插入dom元素;Insert a dom element',
  removeElement: '删除dom元素;Delete dom element',
  findElement: '查找dom元素;Look for the dom element',
  useWebp:
    '判断当前浏览器是否支持webp;Determine whether the current environment supports webp',
  calFps: '计算FPS;Calculate the FPS',
  useResizeObserver: '监听浏览器窗口变化;useResizeObserver',
  useWindowScroll: '监听浏览器滚动;useWindowScroll',
  useElementBounding: '监听元素变化;getBoundingClientRect encapsulation',
  useMutationObserver: '监听元素变化;MutationObserver encapsulation',
  sliderValidation: '滑块验证功能;Slider verification function',
  picInPic: 'video画中画模式;Switch video-in-picture mode',
  shareScreen: '浏览器屏幕分享;Browser screen sharing',
  dbStorage: '浏览器大数据存储;Browser big data storage',
  waterfall: '图片瀑布流布局;Waterfall layout of pictures',
  numWheel: '数字滚轮控件;Digital wheel control',
  dragEvent:
    '点击拖拽松开事件封装函数;Click to drag and drop to release the event encapsulation',
  compressImage: '图片压缩函数;Picture compression function',
  sThree: 'three封装函数;Simplify the use of three',
  sCharts: 'echarts封装函数;Simplify the use of echarts',
  addEventListener: '添加事件函数;Add an event function to the element',
  createElement: '创建dom元素;Create the dom function',
  sleep: '睡眠函数;Sleep function',
  htmlTransform: '强大的template模板ast渲染器;Powerful template ast renderer',
  idleCallbackWrapper: '强大的requestIdleCallback;Powerful requestIdleCallback',
  animationFrameWrapper: '强大的requestAnimationFrame;Powerful requestAnimationFrame',
  DotImageCanvas: '点图画;Dot image drawing',
  DotTextCanvas: '点阵字;Dot matrix text',
  CreateSignatureCanvas: '生成一个签名画布;Create a signature canvas',
  fileSplice: '大文件切片;Big file splitting',
  pwdLevel: '鉴定数字的强度;Identify the strength of the number',
  sort: '强大的数组排序;Powerful array sorting',
  getLru: '获取最近使用的缓存;Get the most recently used cache',
  escapeHtml: '将html字符串转换为实体字符串;Convert html string to entity string',
  unescapeHtml: '将实体字符串转换为html字符串;Convert entity string to html string',
  timeCost: '计算函数执行时间;Calculate the time it takes to execute the function',
  log: '简化console.log的使用;Simplify the use of console.log',
  copy: '将内容复制到剪贴板;Copy the content to the clipboard',
  getDateList: '获取日期列表;Get the date list',
  isType: '类型判断函数;Type judgment function',
  randomDate: '随机日期;Random date',
  uniqueArray: '强大的数组去重;Powerful array de-duplication',
  deepCompare: '强大的对象比较函数;Powerful object comparison function',
  deepMerge: 'Object.assign的深拷贝;Deep copy of Object.assign',
  asyncPool: '并发执行函数;Concurrent execution function',
  quickFind: 'O(1)的查找函数;O(1) search function',
  quickFilter: '数组快速模糊查找;Fuzzy search for array',
  deepClone: '强大的对象深拷贝;Powerful object deep copy',
  curry: '柯里化;Currying',
  memorizeFn: '缓存函数;Cache function',
  debounce: '防抖函数;Debounce function',
  throttle: '节流函数;Throttle function',
  traverse: '神奇的遍历对象函数;Magical traversal of object function',
  transformKey: '映射对象的key函数;Map the key function of an object',
  once: '只执行一次的函数;Only execute once function',
  vFetch: '强大fetch封装函数;Powerful fetch function',
  stringify: '对象转字符串;Object to string',
  parse: '字符串转对象;String to object',
  jsCookie: 'cookie封装函数;Cookie function',
  uuid: '生成uuid;Generate uuid',
  formateDate: '日期格式化函数;Date formatting function',
  monitorPef: '性能监控函数;Performance monitoring function',
  getLocation: '获取当前位置函数;Get the current location function',
  getDevice: '获取设备信息函数;Get the device information function',
  preload: '预加载图片函数;Preload image function',
  lazyLoad: '图片懒加载函数;Image lazy load function',
  addScript: '动态添加script函数;Add script function',
  addLink: '动态添加link函数;Add link function',
  addStyle: '动态添加style函数;Add style function',
  download: '文件下载函数;File download function',
  trim: '字符串去空格函数;String trim function',
  compressCss: 'css压缩函数;Css compression function',
  scrollToTop: '滚动到顶部函数;Scroll to the top function',
  createEventBus: '事件总线函数;Event bus function',
  randomHexColor: '随机生成十六进制颜色函数;Random generate hex color function',
  randomRgb: '随机生成RGB函数;Random generate RGB function',
  httpsRedirect: 'https重定向函数;Https redirect function',
  scrollToView: '指定元素滚动到可视区域函数;Scroll to the view function',
  getScrollPosition: '获取滚动位置函数;Get the scroll position function',
  camelize: '驼峰化函数;Camelize function',
  hyphenate: '连字符化函数;Hyphenate function',
  getUrlParam: '获取url参数函数;Get the url parameter function',
  fullScreen: '全屏函数;Full screen function',
  exitFullScreen: '退出全屏函数;Exit full screen function',
  toBase64: '转base64函数;To base64 function',
  base64ToFile: 'base64转文件函数;Base64 to file function',
  base64ToBlob: 'base64转blob函数;Base64 to blob function',
  uppercaseNum: '数字转大写字母函数;Number to uppercase function',
  formateNum: '数字格式化函数;Number formatting function',
  interceptError: '错误拦截函数;Error interception function',
  isBottom: '判断是否到达底部函数;Judge whether to reach the bottom function',
  calNum: '计算数字函数;Calculate number function',
  ruleJudgment:
    'isMobile isEmail isIdCard hasCn isFile isBlob;isMobile isEmail isIdCard hasCn isFile isBlob',
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
      {{ type === "zh" ? value.split(";")[0] : value.split(";")[1] }}
    </div>
  </a>
</template>

<style scoped></style>
