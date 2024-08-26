/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-06 14:28:42
 * @path: \vue-package-quickstart\test\extension\index.ts
 */
import { on } from "@guolisec/scheduler";
import {
  logout,
  refreshLoginState,
  createPermissionGuard,
} from "@guolisec/permission";
import {
  getAsyncRoutes,
  getLayoutMap,
  getStaticRoutes,
  pageModules,
} from "#/entry/interface";
async function bootstrap() {
  // 创建权限路由守卫
  createPermissionGuard();

  await on("logout", {
    handler(nodify) {
      logout(nodify?.data);
    },
  });

  await on("refreshLoginState", {
    handler() {
      return refreshLoginState();
    },
  });

  await on("getAsyncRoutes", {
    handler() {
      return getAsyncRoutes();
    },
  });

  await on("getLayoutMap", {
    handler() {
      return getLayoutMap();
    },
  });

  await on("getStaticRoutes", {
    handler() {
      return getStaticRoutes();
    },
  });

  await on("pageModules", {
    handler() {
      return pageModules;
    },
  });
}

export { bootstrap };
