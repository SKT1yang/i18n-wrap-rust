/*
 * @name: 全局权限路由守卫
 * @description: 影响范围： 1.next进入页面或被重定向；2.执行副作用函数 afterLoginAction
 */
/* 类型文件 */
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
/* 第三方模块 */
import { useRouter } from '@guolisec/routerable';
import { isDev, ls, isInIframe } from '@guolisec/utils';
/* 本地模块 */
import { usePermissionStoreWithOut } from '../../model/store';
import { emitStaticRoutes } from '.';
import { afterLoginAction, clearLoginState } from '../login';
import { TOKEN_KEY } from '../../types/enum';

function createPermissionGuard() {
  isDev() &&
    console.log('开始加载权限路由守卫：start run createPermissionGuard');
  const router = useRouter();
  router.beforeEach(async (to, _from, next) => {
    const permissionStore = usePermissionStoreWithOut();
    const token = ls.get(TOKEN_KEY);

    /********************** 1.白名单跳转逻辑 **********************/

    const whitePathList = await getWhiteRoutesPath();
    if (to.path && whitePathList.includes(to.path)) {
      isDev() &&
        console.log(
          '执行权限路由前置守卫，进入【白名单】跳转逻辑',
          whitePathList,
          to
        );
      // 跳转登录页时，清除登录数据
      if (to.path === '/login') {
        clearLoginState();
      }
      next();
      return;
    }

    /********************** 2.已登录跳转逻辑 **********************/

    if (token) {
      isDev() &&
        console.log(
          '执行权限路由前置守卫，进入【已登录】跳转逻辑',
          permissionStore.getIsDynamicAddedRoute
        );
      // 保证已生成动态路由
      if (!permissionStore.getIsDynamicAddedRoute) {
        try {
          await afterLoginAction(false, false, 'createPermissionGuard');
          /* 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容 */
          next({ path: to.fullPath, replace: true, query: to.query });
        } catch (error) {
          console.warn('添加动态路由失败，路由跳转失败，不做跳转:', error);
          redirectToLogout(to, next);
        }
        return;
      }
      next();
      return;
    }

    /********************** 3. 未登录跳转逻辑 **********************/

    if (!token) {
      isDev() &&
        console.log('执行权限路由前置守卫，进入【未登录】跳转逻辑', to);
      // 处理 route.meta.ignoreAuth 字段逻辑;
      // route.meta.ignoreAuth设为true，可直接进入页面
      if (to.meta.ignoreAuth) {
        next();
        return;
      }
      redirectToLogout(to, next);
      return;
    }
  });
}

/**
 * 路由重定向
 * @param to
 * @param next
 */
function redirectToLogout(
  to: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // 被嵌套时，不进行页面跳转
  if (isInIframe()) {
    console.warn('进入redirectToLogout, 并且被嵌套时，不进行页面跳转');
    next(false);
    return;
  }
  const redirectRoute: {
    path: string;
    replace: boolean;
    query?: Record<string, string>;
  } = {
    // 被嵌套重定向到嵌套异常页面，否则重定向到登录页
    path: '/login',
    replace: true,
  };
  if (to.path) {
    redirectRoute.query = {
      ...redirectRoute.query,
      redirect: to.path,
    };
  }
  next(redirectRoute);
}

// 白名单（目前只有静态路由）
async function getWhiteRoutesPath() {
  const paths: string[] = [];
  const staticRoutes = await emitStaticRoutes();
  staticRoutes.forEach((primaryRoute) => {
    const primaryPurePath = primaryRoute.path
      .replace(/^\//, '')
      .replace(/\/$/, '');
    paths.push(`/${primaryPurePath}`);
    primaryRoute.children?.forEach((secondaryRoute) => {
      const secondaryPurePath = secondaryRoute.path
        .replace(/^\//, '')
        .replace(/\/$/, '');
      paths.push(`/${primaryPurePath}/${secondaryPurePath}`);
    });
  });
  return ['/login', '/iframe-error', ...paths].filter(
    (path) => !['/', ''].includes(path)
  );
}

export { createPermissionGuard, getWhiteRoutesPath };
