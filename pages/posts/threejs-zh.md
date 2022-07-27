---
title: s-three
description: Wish this is the end.
date: 2022-07-25T22:00:00.000+00:00
lang: zh
duration: 2day
subtitle: 'Author: Simon'
---

<script setup lang="ts">
const directoryList = {
  "sThree":"threejs封装函数",
}
</script>

[[toc]]

> [英文 English Version](/posts/threejs)

## 此文是介绍封装的工具函数的文档[exportsFunction](https://www.npmjs.com/package/@simon_he/s-three)
<div flex="~" items-center><strong>特点</strong>: 扩展性高,调用灵活便捷 <span i-fluent:flash-28-filled bg-amber  /></div>

## 更多
- 通用函数[simon-js-tool](/posts/ToolsFunction-zh)
- 导出函数[exports-functions](/posts/exportsfunction-zh)
- Echarts简单化[s-three](/posts/charts-zh)
- numsWheel 组件 [s-nums-wheel](/posts/numsWheel)

## 使用说明
```bash
npm i @simon_he/s-three # 安装

import { 
  sThree,
  ...
 } from '@simon_he/s-three' # 按需引入

```

## 目录结构
<Directory type="zh" :lists="directoryList"></Directory>


## sThree
- 简单化three的使用
- 可以让你的代码更加简洁,更加美观
- 不需要在onMounted中执行,可以在任意时刻使用
- 自动监听resize事件,自动更新canvas的大小
- 内置了一下简单的创建函数和一些修改属性函数后自动化更新视图的功能比如texture的加载不必额外再调用.load,可以直接传图片地址,并且这个texture是会被cache的,内置了dat.gui的debugger功能,可开启debug:true,在createMesh中结构track函数使用，如果是geometry的color需要addColor和额外设置geometry.color.set,可直接通过track('color',geometry,'color')就会自动去setColor,追加了_add方法会导出一个销毁原mesh的方法,const unmount = scene._add(mesh) ,可在更新前调用unmount方法卸载mesh,更新后调用mount方法重新添加mesh 
- 参数:
  - container: string | HTMLElement, 父容器
  - options: {
    createMesh: () => void
    createCamera: (scene: Object3D) => PerspectiveCamera /* 创建camera, const camera = c("PC"); return camera, 返回的camera会被添加到scene中 */
    animate?: (animationOptions: AnimateOptions) => void | THREE.PerspectiveCamera /* 动画函数,每秒60帧,可以在这里添加修改camera或者mesh的属性,会被自动update,如果需要使用新的camera在这里返回一个新的camera即可 */
    middleware?: (middlewareOptions: MiddlewareOptions) => any /* 中间件函数,可以在这里额外做一下操作，比如添加axes,使用 OrbitControls等等，返回的内容会被传入到animation函数中的params中 */
    mousemove?: (e: Event) => void /* 自动监听画布的mousemove事件 */
    mousedown?: (e: Event) => void /* 自动监听画布的mousedown事件 */
    mouseup?: (e: Event) => void /* 自动监听画布的mouseup事件 */
    debug?: boolean /* 是否开启debug模式,默认false */
    alias?: Record<string, string> /* 配置别名,在c函数中作为映射使用例如 {m:"Mesh",pc:"PerspectiveCamera"}等等，根据自己的命名规则来配置别名 */
  }
- 返回值:
  - ReturnType {
    c: (fnName: keyof FnNameMap | keyof T, ...args: any[]) => any /* 使用c可以更简洁的创建一些geometry、material、texture等,如c("m",c('bg',1,1,1),c('msm'))等同于创建一个Mesh,bg是一个1x1x1的boxGeometry,msm是一个MeshStandardMaterial */
    cf: (url: string, text: string, options: TextGeometryParameters) => Promise /* 创建文字geometry,可以传入文字内容和文字配置参数,返回Promise
    track: (...args: [target: Object, propName: string, min?: number, max?: number, step?: number]) => dat.GUIController // 开启右上角的debugger,可以追踪mesh的属性,可以在这里添加修改mesh的属性,会被自动update,如track('color',mesh,'color')就会自动去setColor,追加了_add方法会导出一个销毁原mesh的方法,const unmount = scene._add(mesh) ,可在更新前调用unmount方法卸载mesh,更新后调用mount方法重新添加mesh */
    setUV: (target: Mesh, size?: number) => void // 快速设置geometry的uv,可以传入size参数,默认为2
    glTFLoader: (url: string, dracoLoader?: DRACOLoader, callback?: (gltf: GLTFLoader) => void) => Promise /* 创建gltf加载器,可以传入dracoLoader参数,如果需要使用draco加载器,需要引入draco-loader,并且在callback中设置dracoLoader参数,返回Promise,可直接获取load后的结果,如const gltf = await glTFLoader('/model.gltf') ,gltf.scene就是gltf的scene对象，并且gltf是能够被cache使用同一个gltfLoader */
    draCOLoader: (decoderPath: string) => DRACOLoader /* 创建draco加载器,可以传入decoderPath参数,返回DRACOLoader */
    animationArray: Mesh[] /* 动画数组,用于记录所有的动画mesh,可在animation函数中去批量更新mesh的属性,如animationArray.forEach(mesh => mesh.rotation.x += 0.01) */
    THREE: T /* THREE对象 */
    scene: Scene /* 场景对象 */
    renderer: WebGLRenderer /* 渲染器对象 */
    dom: HTMLCanvasElement /* dom实例 */
    setRendererAttributes: (options: Record<K, any>) => void /* 批量添加renderer的属性,可以在这里添加修改renderer的属性,会被自动update,如setRendererAttributes({antialias:true})就会自动设置antialias为true */
  }
```javascript

const {
  c,
  track,
  cf,
  animationArray,
  glTFLoader,
  draCOLoader,
  setUV,
  THREE,
  scene,
  dom,
  renderer,
} = sThree("#galaxy", {
  createMesh() {
    // Galaxy
    const params = {
      count: 30000,
      size: 0.02,
      radius: 4.5,
      branch: 8,
      spin: 1,
      randomness: 0.35,
      randomnessPower: 3,
      insideColor: "#b77863",
      outsideColor: "#2755e2",
    };
    let geometry;
    let material;
    let points;
    let unmount;
    const generateGalaxy = () => {
      if (points) unmount();
      geometry = c("bufferg");
      const positions = new Float32Array(params.count * 3);
      const colors = new Float32Array(params.count * 3);
      const colorInside = new THREE.Color(params.insideColor);
      const colorOutside = new THREE.Color(params.outsideColor);
      for (let i = 0; i < params.count; i++) {
        const i3 = i * 3;
        // Position
        const radius = Math.random() * params.radius;
        const spinAngle = radius * params.spin;
        const randomX =
          Math.pow(Math.random(), params.randomnessPower) *
          (Math.random() < 0.5 ? -1 : 1) *
          params.randomness;
        const randomY =
          Math.pow(Math.random(), params.randomnessPower) *
          (Math.random() < 0.5 ? -1 : 1) *
          params.randomness;
        const randomZ =
          Math.pow(Math.random(), params.randomnessPower) *
          (Math.random() < 0.5 ? -1 : 1) *
          params.randomness;
        const branchAngle = ((i % params.branch) / params.branch) * Math.PI * 2 + randomX;
        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius;
        positions[i3 + 1] = 0 + randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        // Color
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / params.radius);
        colors[i3 + 0] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }
      geometry.setAttribute("position", c("ba", positions, 3));
      geometry.setAttribute("color", c("ba", colors, 3));
      console.log(geometry);
      // Material
      material = c("pm", {
        size: params.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });
      points = c("p", geometry, material);
      unmount = scene._add(points);
      animationArray.push(points);
    };
    track(params, "count").min(100).max(100000).step(100).onFinishChange(generateGalaxy);
    track(params, "size").min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);

    track(params, "radius").min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
    track(params, "branch").min(2).max(20).step(1).onFinishChange(generateGalaxy);
    track(params, "spin").min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
    track(params, "randomness").min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
    track(params, "randomnessPower")
      .min(1)
      .max(10)
      .step(0.001)
      .onFinishChange(generateGalaxy);
    track("color", params, "insideColor").onFinishChange(generateGalaxy);
    track("color", params, "outsideColor").onFinishChange(generateGalaxy);
    generateGalaxy();
  },
  createCamera(scene) {
    const camera = c("PC");
    camera.position.z = 1;
    camera.position.y = 4;
    return camera;
  },
  middleware({ camera, OrbitControls }) {
    const controls = new OrbitControls(camera, dom);
  },
  animate({ camera, elapsedTime, params }) {
    animationArray[0].rotation.y = elapsedTime * 0.1;
  },
  debug: true,
});
```


## GitHub
[欢迎PR](https://github.com/Simon-He95/sThree)
