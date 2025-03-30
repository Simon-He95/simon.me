---
title: vite-ssg
description: Wish this is the end.
date: 2022-06-02T22:00:00.000+00:00
lang: zh
duration: 1day
---

 ## Issues[#254](https://github.com/antfu/vite-ssg/issues/254)

 在使用vite-ssg中，我引入了一个npm组件，组件中有依赖document等api，dev环境都是ok的，但是build环境会报错，报错信息如下：

 ```document is not defined```
 我就搜了一下GitHub的issues发现不少类似的情况，但是他们是在当前项目中存在的，给出的解决办法是使用onBeforeMount或者onMount包裹一下，确保他是在client环境中执行，这样就不会报错了,但这并不是我想要的，我需要去修改npm包，如果我加上了onBeforeMount我同一个组件可能会实例化多次，那么我只走一遍的逻辑就需要额外的加条件控制来return，会很麻烦。

 blwtxc 也给出了一个建议，通过try...catch去包裹有问题的document/window,因为在node/ webworker 是识别不了他们，确实加上了try...catch解决了这个问题，但是也不是最理想的形式，我建议在build环境下去创建一个window/document环境，然后在这个环境中执行，这样就不会报错了。

 其实blwtxc在options提供了一个mock参数，开启mock后，就会加载jsdom，去给我们模拟一个node环境下的document/window，我们就可以在build环境下执行了，这样就不会报错了，但是似乎没生效，因为他的动态加载的时机过晚了，在打包render page前去加载的，而我们的代码时在打包server时。

 userquin 提供了这个PR，将jsdom的载入挪到了server build之前，现在我们执行build时候加上mock就不会有问题了（ "build": "cross-env DEBUG=vite-ssg:* vite-ssg build --mock"）

 正常来说我们的代码应该是在client执行的，但是vite-ssg，他会有服务端渲染，首先将我们的项目打包成一个.vite-ssg-temp/entry.mjs文件，再被await import（'xxx/.vite-ssg-temp/entry.mjs'）,这一步如果没有jsdom提供这个环境的话，node就识别不了document/window

 分享就到这里，希望能对你有帮助，谢谢！
