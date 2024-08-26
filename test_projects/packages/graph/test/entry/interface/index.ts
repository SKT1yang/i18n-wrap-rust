/*
 * @name: 系统对插件开放的接口
 * @description: 接口必须是系统原生功能，不能包含插件模块，防止循环引用插件
 * @date: 2023-04-10 10:46:00
 * @path: \glsec\apps\rsmp\src\entry\interface\index.ts
 */
export {
  pageModules,
  getStaticRoutes,
  getAsyncRoutes,
} from '#/entry/router/routes'
export { getLayoutMap } from '#/entry/layout'
