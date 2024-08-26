/*
 * @name: 路由
 * @description:
 * @date: 2023-02-03 10:26:21
 * @path: \routerable\src\index.ts
 */
import type { Router } from 'vue-router';
import type { GoConfig, RouteLocationRawEx } from './interface';
import { beforeHandler, handleError } from './helper';
import { message } from '@guolisec/toast';

declare global {
  export var __APP_GLOBAL_ROUTER_INSTANCE__: Router | undefined;
}

const __APP_GLOBAL_ROUTER_INSTANCE__ = '__APP_GLOBAL_ROUTER_INSTANCE__';

/**
 * 配置路由
 * @description 必须被调用， 否则路由实例是个空对象
 * @param options
 */
function setupRouter(routerInstance: Router) {
  if (!globalThis[__APP_GLOBAL_ROUTER_INSTANCE__]) {
    globalThis[__APP_GLOBAL_ROUTER_INSTANCE__] = routerInstance;
  } else {
    console.warn(`[Routerable Warning] 全局路由实例已存在！`);
  }
}

function go(opt: RouteLocationRawEx, config?: Partial<GoConfig>) {
  const router = globalThis[__APP_GLOBAL_ROUTER_INSTANCE__];
  if (!router) {
    console.warn(`[Routerable Warning] 全局路由实例未初始化！`);
    return;
  }
  if (!opt) {
    return;
  }

  config = Object.assign(
    {
      isReplace: false,
      isMsg: true,
      isGoPage: false,
    },
    config || {}
  );
  if (!beforeHandler(opt, router)) {
    config.isMsg && message.warning('该用户权限不足!');
    if (!config.isGoPage) {
      return;
    }
  }
  try {
    config.isReplace
      ? router.replace(opt).catch(handleError)
      : router.push(opt).catch(handleError);
  } catch (error) {
    console.warn('@guolisec/routerable go error', error);
    handleError(error as Error, config.isMsg);
  }
}

function useRouter() {
  return globalThis[__APP_GLOBAL_ROUTER_INSTANCE__] as Router;
}

function useRoute() {
  const router = useRouter();
  return router.currentRoute.value;
}

export { setupRouter, useRouter, useRoute, go };
