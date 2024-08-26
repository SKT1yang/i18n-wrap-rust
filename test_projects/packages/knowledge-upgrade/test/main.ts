/*
 * @name: app入口文件
 * @description: Do not edit
 * @date: 2023-01-31 13:24:35
 * @path: \knowledge-upgrade\test\main.ts
 */

/* 类型文件 */

/* 第三方模块 */
import { createApp } from "vue";
import "uno.css";
import "@guolisec/reset.css";
/* 本地共享模块 */
import "#/entry/config"; // 初始化SystemConfig配置
import "#/entry/theme";
/* 业务模块 */
import App from "./app.vue";
import { store } from "#/entry/store";
import { router } from "#/entry/router";
import { bootstrap as pluginBootstrap } from "#/extension";

async function bootstrap() {
  // 传入根组件，创建应用实例
  const app = createApp(App);
  app.use(store);
  app.use(router);
  // 初始化插件
  await pluginBootstrap();
  // 应用实例挂载到容器元素
  app.mount("#app");
}

bootstrap();
