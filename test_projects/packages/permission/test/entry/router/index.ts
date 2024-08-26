/*
 * @name: 路由配置文件
 */
import { createRouter, createWebHashHistory } from 'vue-router';
import { setupRouter } from '@guolisec/routerable';
import { getStaticRoutes } from './routes';
import { createPermissionGuard } from '@/index';
import { isDev } from '@guolisec/utils';
import { beforeCreateRouter, afterCreateRouter } from '#/extension';

beforeCreateRouter();
// 创建一个可以被 Vue 应用程序使用的路由实例
export const router = createRouter({
  // 创建一个 hash 历史记录。
  history: createWebHashHistory('/'),
  // 应该添加到路由的初始路由列表。
  routes: getStaticRoutes(),
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});
afterCreateRouter();

// ! 初始化全局路由实例
setupRouter(router);
isDev() && console.log('after run setupRouter');

createPermissionGuard();
