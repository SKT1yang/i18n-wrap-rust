/*
 * @name: app 入口文件
 * @description: Do not edit
 */
/* 第三方模块 */
import { createApp } from 'vue'
import 'uno.css'
// /* 本地共享模块 */
import '@/shared/styles/index.css'
import '@/entry/config'
import '@/entry/theme'
import { store } from '@/entry/store'
import { router } from '@/entry/router'
/* 业务模块 */
import App from './app.vue'
import { beforeCreateApp, afterCreateApp, beforeMountedApp, afterMountedApp } from '@/extension'

async function bootstrap() {
  // 1.应用实例创建前
  beforeCreateApp()
  // 2.创建应用实例，传入根组件
  const app = createApp(App)
  // 3.应用实例创建后
  afterCreateApp(app)

  app.use(store)
  app.use(router)

  // 4.应用实例挂载到容器元素前
  await beforeMountedApp()
  // 5.应用实例挂载到容器元素,开始页面渲染
  app.mount('#app')
  // 6.应用实例挂载到容器元素后
  afterMountedApp()
}

bootstrap()
