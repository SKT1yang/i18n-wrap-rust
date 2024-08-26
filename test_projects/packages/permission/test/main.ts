/*
 * @name: app入口文件
 * @description: Do not edit
 */

/* 第三方模块 */
import { createApp } from 'vue';
import 'uno.css';
import '@guolisec/reset.css';
// /* 本地共享模块 */
import '#/entry/config'; // 初始化SystemConfig配置
import '#/entry/theme';
/* 业务模块 */
import App from './app.vue';
import { store } from '#/entry/store';
import { router } from '#/entry/router';
import { bootstrap as pluginBootstrap, beforeMountedApp } from '#/extension';

async function bootstrap() {
  // 传入根组件，创建应用实例
  console.log('创建应用实例前：beforeCreateApp');
  const app = createApp(App);
  console.log('创建应用实例后：afterCreateApp');
  app.use(store);
  console.log('after use store');
  app.use(router);
  console.log('after use router');
  // // 初始化插件
  await pluginBootstrap();
  console.log('插件初始化后：afterPluginBootstrap');
  beforeMountedApp();
  // 应用实例挂载到容器元素
  app.mount('#app');
  console.log('应用实例挂载到容器元素后：afterMountApp');
}

bootstrap();
