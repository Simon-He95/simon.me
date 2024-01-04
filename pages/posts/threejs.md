---
title: s-three
description: Wish this is the end.
date: 2022-07-25T22:00:00.000+00:00
lang: en
duration: 2day
subtitle: 'Author: Simon'
---

<script setup lang="ts">
const directoryList = {
  "sThree":"threejs封装函数",
}
</script>

[[toc]]

> [中文 Chinese Version](/posts/three-zh)

## This article is documentation that describes the encapsulated utility functions [@simon_he/s-charts](https://www.npmjs.com/package/@simon_he/s-three)
Compiled <strong>90+</strong> commonly used functions, constantly updated<vivid-typing content="......" inline-block :infinity="true"></vivid-typing>
<div flex="~" ><strong>peculiarity</strong><span>: High scalability, flexible and convenient calling <span i-fluent:flash-28-filled bg-amber  /></span></div>

## More
- Common functions [lazy-js-utils](/posts/ToolsFunction)
- Export functions [exports-functions](/posts/exportsfunction)
- Echarts simplistic [s-charts](/posts/charts)
- numsWheel component [s-nums-wheel](/posts/numsWheel)
- vAxios Request encapsulation[v-axios](/posts/vAxios)

## Instructions for use
```bash
npm i @simon_he/s-three # install

import { 
  sThree,
  ...
 } from '@simon_he/s-three' # Ingestion on demand

```

## Directory structure
<Directory type="zh" :lists="directoryList"></Directory>


## sThree
- Simplify the use of three
- It can make your code more concise and beautiful
- Automatically listens for resize events and automatically updates the size of the canvas
- Built-in a simple creation function and some modify the property function after the automatic update of the view function such as the loading of the text does not have to call additional .load, you can directly pass the picture address, and this text is cached, built-in dat.gui debug function, can open debug:true, in the creationMesh structure trace function to use, If you need addColor and additional geotopry.color.set, you can automatically set Colon directly through track ('color', geometry, 'color').Appended _add method will export a method to destroy the original mesh, const unmount = scene._add (mesh), you can call the uninstall method before the update to uninstall the mesh, after the update call the mount method to re-add mesh 
- params:
  - container: string | HTMLElement /* Parent container */
  - options: {
    createMesh: () => void
    createCamera: (scene: Object3D) = > PerspectiveCamera /* Create camera, const camera = c("PC"); Return camera, the returned camera will be added to the scene */
    animate?: (animationOptions: AnimateOptions) => void | THREE. The PerspectiveCamera /* animation function, 60 frames per second, can be added here to modify the camera or mesh property, will be automatically updated, if you need to use the new camera here to return a new camera */
    middleware?: (middlewareOptions: MiddlewareOptions) = > any /* middleware function, you can do an extra operation here, such as adding axes, using OrbitControls, etc., the returned content will be passed into the params in the organization function */
    mousemove?: (e: Event) = > void /* Automatically listens to the mousemove event of the canvas */
    mousedown?: (e: Event) = > void /* Automatically listens for mousedown events on the canvas */
    mouseup?: (e: Event) = > void /* Automatically listens for mouseup events on the canvas */
    debug?: Boolean /* Does debug mode be turned on, with false by default */
    alias?: Record<tring, string> /* configuration aliases, using for example {m:"Mesh", pc: PerspectiveCamera"} in the c function as a mapping, etc., to configure the alias according to its own naming conventions */
  }
- Return:
  - ReturnType {
    c: (fnName: keyof FnNameMap | keyof T, ...args: any[]) => any /* Using c can be used to more concisely create some geometry, material, texture, etc., such as c ("m", c('bg', 1, 1, 1), c('msm') is equivalent to creating a mesh, bg is a 1x1x1 boxGeometry, msm is a MeshStandardMaterial */
    cf: (url: string, text: string, options: TextGeometryParameters) => Promise /* Create a text geometry, you can pass in the text content and text configuration parameters, return the Promise */
    track: (...args: [target: Object, propName: string, min?: number, max?: number, step?: number]) => dat.GUIController /* Open the debug in the upper right corner, you can track the properties of mesh, you can add and modify the properties of mesh here, will be automatically updated, such astrack ('color', mesh, 'color') will automatically go to setColor, appended _add method will export a method to destroy the original mesh, const unmount = scene._add (mesh), You can call the uninstall method to uninstall mesh before the update, and call the mount method to re-add mesh after the update */
    setUV: (target: Mesh, size?: number) => void /* Quickly set the UV of the geometry, you can pass in the size parameter, the default is 2 */
    glTFLoader: (url: string, dracoLoader?: DRACOLoader, callback?: (gltf: GLTFLoader) => void) => Promise /* Create a gltf loader, you can pass in the dracoLoader parameter, if you need to use the draco loader, you need to introduce the draco-loader, and set the dracoLoader parameter in the callback to return the Promise , you can directly get the result after the load, such as const gltf = await glTFLoader('/model.gltf'), gltf.scene is the scene object of gltf, and gltf is capable of being used by cache with the same gltfLoader */
    draCOLoader: (decoderPath: string) = > DRACOLoader /* Creates a draco loader that can pass in the decoderPath parameter and return the DRACOLoader */
    animationArray: Mesh[] /* Animation array, used to record all animation mesh, can be in the organization function to batch update mesh properties, such as organizationArray.forEach(mesh = > mesh.rotation.x += 0.01) */
    THREE: T /* Three objects */
    scene: Scene /* Scene object */
    renderer: WebGLRenderer /* renderer object */
    dom: HTMLCanvasElement /* dom instance */
    setRendererAttributes: (options: Record<K, any>) = > void /* Batch add the properties of the renderer, you can add modified properties here, will be automatically update, such as setRendererAttributes({antialias:true}) will automatically set antiialias to true */
  }
```javascript
 const cursor = {
    x: 0,
    y: 0,
  };
  SThree("#main", {
    createMesh(c, animationArray, track, THREE) {
      const texture = c("tl", "../public/door.png");
      const material = c("mmm", {
        matcap: texture,
      });

      const sphere = c("m", c("sg", 0.5, 16, 16), material);
      sphere.position.x = -1.5;
      const plane = c("m", c("planeg", 1, 1), material);
      const torus = c("m", c("torusg", 0.3, 0.2, 16, 32), material);
      torus.position.x = 1.5;
      return [sphere, plane, torus];
    },
    createCamera(c, meshes) {
      const camera = c("PC");
      camera.position.z = 5;
      return camera;
    },
    middleware({ c, meshes, camera, scene, OrbitControls, dom }) {
      const controls = new OrbitControls(camera, dom);
      controls.enableDamping = true;
      return controls;
    },
    animate({ c, meshes, camera, elapsedTime, params }) {
      // console.log(params);
      // meshes.forEach((mesh) => {
      //   mesh.rotation.y = time * Math.PI;
      // });
      // meshes[0].rotation.x += 0.01;
      // meshes[0].rotation.y += 0.01;
      params.update();
    },
    debug: true,
  });
```


## GitHub
[Welcome to PR](https://github.com/Simon-He95/sThree)
