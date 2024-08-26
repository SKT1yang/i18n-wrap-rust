/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-04-17 16:16:54
 * @path: \routerable\src\helper.ts
 */
/* 类型文件 */
import type { Router } from 'vue-router';
import type { RouteLocationRawEx } from './interface';
/* 第三方模块 */
import { flatten, uniq } from 'lodash-es';
import { message } from '@guolisec/toast';
/* 本地共享模块 */

/* 业务模块 */

const NO_MATCH_ROUTE = 'No match for';

export function handleError(e: Error, isMsg = true) {
  if (e.message.indexOf(NO_MATCH_ROUTE) !== -1 && isMsg) {
    message.warning('该用户权限不足!');
  }
  console.error(e);
}

/**
 * 自定义路由跳转的前置守卫
 * @param opt 用户跳转参数
 */
export function beforeHandler(
  opt: RouteLocationRawEx,
  router: Router
): boolean {
  const routeTree = router.getRoutes();
  const flattenedRoutes = flatten(routeTree);
  const allRoutePath = flattenedRoutes.map((route) => {
    return route.path;
  });
  const unitRoutesPath = uniq(allRoutePath);
  // 路径跳转判断
  if (typeof opt === 'string') {
    return unitRoutesPath.includes(opt);
  }
  // name路由跳转判断
  if (opt.name) {
    return router.hasRoute(opt.name);
  }
  return true;
}
