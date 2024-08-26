/*
 * @name: 路由配置文件
 * @description:
 * @date: 2023-02-03 10:26:21
 * @path: \knowledge\src\entry\router\index.ts
 */
/* 第三方模块 */
import { createRouter, createWebHashHistory } from "vue-router";
import { setupRouter } from "@guolisec/routerable";

/* 业务模块 */
import { getStaticRoutes } from "./routes";

// 创建一个可以被 Vue 应用程序使用的路由实例
export const router = createRouter({
  // 创建一个 hash 历史记录。
  history: createWebHashHistory("/"),
  // 应该添加到路由的初始路由列表。
  routes: getStaticRoutes(),
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// ! 初始化全局路由实例
setupRouter(router);
