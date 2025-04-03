import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat.js'
import NProgress from 'nprogress'
import autoRoutes from 'pages-generated'
import { ViteSSG } from 'vite-ssg'

import { VividTyping } from 'vivid-typing'
import App from './App.vue'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import './styles/prose.css'
import './styles/markdown.css'
import 'uno.css'

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith('/')
      ? `${i.path}index.html`
      : `${i.path}.html`,
  }
})

function scrollBehavior(to: any, from: any, savedPosition: any) {
  if (to.path === '/')
    return { top: 0 }
  return savedPosition || { top: 0 }
}

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior },
  async ({ app, router, isClient }) => {
    app.component('VividTyping', VividTyping)
    dayjs.extend(LocalizedFormat)

    if (isClient) {
      router.beforeEach(() => {
        NProgress.start()
      })
      router.afterEach(() => {
        NProgress.done()
      })
    }
  },
)
