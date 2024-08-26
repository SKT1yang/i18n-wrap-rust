/*
 * @name: 系统对插件开放的接口
 * @description: 接口必须是系统原生功能，不能包含插件、组件模块，防止循环引用插件
 */
export { pageModules, getStaticRoutes, getAsyncRoutes } from '../router/routes';
export { getLayoutMap } from '../layout';
