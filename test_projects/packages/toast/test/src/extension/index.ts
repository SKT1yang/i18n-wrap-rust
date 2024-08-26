/*
 * @name: 调度中心
 * @description: 系统-插件消息发布中心，方便其他package调用
 */
import { on } from '@guolisec/scheduler';
import { logout, refreshLoginState } from '@guolisec/permission';
import { createPermissionGuard } from '@guolisec/permission';
import {
  getAsyncRoutes,
  getLayoutMap,
  getStaticRoutes,
  pageModules,
} from '@/entry/interface';

// !
async function bootstrap() {
  // !创建权限路由守卫
  createPermissionGuard();

  await on('logout', {
    handler(nodify) {
      logout(nodify?.data);
    },
  });

  await on('refreshLoginState', {
    async handler() {
      return await refreshLoginState();
    },
  });

  await on('getAsyncRoutes', {
    handler() {
      return getAsyncRoutes();
    },
  });

  await on('getLayoutMap', {
    handler() {
      return getLayoutMap;
    },
  });

  await on('getStaticRoutes', {
    handler() {
      return getStaticRoutes();
    },
  });

  await on('pageModules', {
    handler() {
      return pageModules;
    },
  });
}

export { bootstrap };
