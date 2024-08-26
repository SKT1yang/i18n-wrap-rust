/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-06 14:28:42
 * @path: \permission\test\extension\index.ts
 */
import { on } from '@guolisec/scheduler';
import { logout, refreshLoginState } from '@/index';
import {
  getAsyncRoutes,
  getLayoutMap,
  getStaticRoutes,
  pageModules,
} from '#/entry/interface';
async function bootstrap() {
  await on('logout', {
    handler(nodify) {
      logout(nodify?.data);
    },
  });

  await on('refreshLoginState', {
    handler() {
      return refreshLoginState();
    },
  });

  await on('getAsyncRoutes', {
    handler() {
      return getAsyncRoutes();
    },
  });

  await on('getLayoutMap', {
    handler() {
      return getLayoutMap();
    },
  });

  await on('pageModules', {
    handler() {
      return pageModules;
    },
  });
}

async function beforeCreateRouter() {
  console.log('执行beforeCreateRouter钩子');
  await on('getStaticRoutes', {
    handler() {
      const result = getStaticRoutes();
      console.log(
        '成功获取到系统静态路由数据getStaticRoutes，消息结果是：',
        result
      );
      return result;
    },
  });
}

async function afterCreateRouter() {
  console.log('执行afterCreateRouter钩子');
}

async function beforeMountedApp() {
  console.log('执行afterbeforeMountedApp钩子');
}

export { bootstrap, beforeCreateRouter, afterCreateRouter, beforeMountedApp };
