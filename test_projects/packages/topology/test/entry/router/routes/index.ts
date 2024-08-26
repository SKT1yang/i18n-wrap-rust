/*
 * @name: Do not edit
 * @description: 系统的路由能力，可以对外暴露
 * @date: 2023-04-04 14:46:20
 * @path: \vue-package-quickstart\test\entry\router\routes\index.ts
 */
import { type Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { usePermissionStore } from '@guolisec/permission';
import { Sonoma } from '@guolisec/permission';

export const pageModules: Record<string, Component> =
  import.meta.glob('../../../pages/**/*.{vue,tsx}', {
    eager: true,
  }) || {};

/**
 * 获取 动态 路由配置
 * @returns
 */
export function getAsyncRoutes(): RouteRecordRaw[] {
  return [
    {
      name: 'Target',
      path: '/',
      component: Sonoma,
      redirect: '/home',
      meta: {
        title: '首页',
        icon: 'i-base-earth',
        hideChildrenInMenu: true,
      },
      children: [
        {
          name: 'Home',
          path: 'home',
          component: () => import('#/pages/HomePage.vue'),
          meta: {
            title: '首页',
          },
        },
      ],
    },
    {
      name: 'Topology',
      path: '/topology',
      component: Sonoma,
      redirect: '/topology/list',
      meta: {
        title: '网络拓扑',
        icon: 'i-base-organization-chart',
        hideChildrenInMenu: true,
      },
      children: [
        {
          name: 'TopologyList',
          path: 'list',
          component: () => import('#/pages/TopologyListPage.vue'),
          meta: {
            title: '拓扑清单',
            hideMenu: true,
          },
        },
        {
          name: 'TopologyView',
          path: 'view',
          component: () => import('#/pages/TopologyViewPage.vue'),
          meta: {
            title: '拓扑展示',
            hideMenu: true,
          },
        },
        {
          name: 'TopologyEditor',
          path: 'editor',
          component: () => import('#/pages/TopologyEditorPage.vue'),
          meta: {
            hideMenu: true,
            title: '拓扑编辑',
          },
        },
      ],
    },
    {
      name: 'TopologyViewCanvas',
      path: '/view-canvas',
      component: () => import('#/pages/TopologyViewCanvasPage.vue'),
      meta: {
        title: '拓扑画布',
      },
    },
  ];
}

/**
 * 获取 静态 路由配置
 * @returns
 */
export function getStaticRoutes(): RouteRecordRaw[] {
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
    {
      name: 'SystemRoute',
      path: '/system-route',
      component: () => import('#/pages/RoutePage.vue'),
      meta: {
        hideMenu: true,
        title: '系统路由',
      },
    },
  ];
}
