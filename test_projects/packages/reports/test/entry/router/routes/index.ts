/*
 * @name: 系统的路由能力
 * @description: 对package暴露
 * @date: 2023-04-04 14:46:20
 * @path: \reports\src\entry\router\routes\index.ts
 */
import { type Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { usePermissionStore } from '@guolisec/permission';
import { BigSur } from '@guolisec/permission';

const pageModules: Record<string, Component> =
  import.meta.glob('../../../pages/**/*.{vue,tsx}', {
    eager: true,
  }) || {};

/**
 * 获取 动态 路由配置
 * @returns
 */
function getAsyncRoutes(): RouteRecordRaw[] {
  return [
    {
      name: 'HomeRoot',
      path: '/',
      component: BigSur,
      redirect: '/home',
      meta: {
        title: '报表管理',
        icon: 'i-base-earth',
      },
      children: [
        {
          name: 'ReportConfig',
          path: 'config',
          component: () => import('#/pages/ReportConfigPage.vue'),
          meta: {
            title: '报表配置',
          },
        },
        {
          name: 'ReportsList',
          path: 'home',
          component: () => import('#/pages/ReportsListPage.vue'),
          meta: {
            title: '报表管理',
          },
        },
      ],
    },
  ];
}

/**
 * 获取 静态 路由配置
 * @returns
 */
function getStaticRoutes(): RouteRecordRaw[] {
  const permissionStore = usePermissionStore();
  return [
    {
      name: 'Root',
      path: '/',
      redirect: permissionStore.systemInfo?.homePageUrl || '/home',
      meta: {
        title: 'Root',
      },
    },
    {
      name: 'Login',
      path: '/login',
      component: () => import('#/pages/LoginPage.vue'),
      meta: {
        title: '登录',
      },
    },
    {
      name: 'Error',
      path: '/:path(.*)*',
      component: () => import('#/pages/ExceptionPage.vue'),
      meta: {
        title: '异常',
      },
    },
    {
      name: 'Permission',
      path: '/hidden/permission',
      component: () => import('#/pages/PermissionPage.vue'),
      meta: {
        hideMenu: true,
        title: '权限管理',
      },
    },
    {
      name: 'DynamicSystem',
      path: '/hidden/system',
      component: () => import('#/pages/SystemPage.vue'),
      meta: {
        hideMenu: true,
        title: '动态系统',
      },
    },
  ];
}

export { getAsyncRoutes, getStaticRoutes, pageModules };
