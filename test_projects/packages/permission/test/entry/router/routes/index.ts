/*
 * @name: Do not edit
 * @description: 系统的路由能力，可以对外暴露
 */
import { type Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { usePermissionStore } from '@/index';
import { Sonoma, BigSur } from '@/index';
import CustomSonoma from '#/entry/layout/Layout.vue';

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
      name: 'HomeLayout',
      path: '/',
      component: CustomSonoma,
      redirect: '/home',
      meta: {
        title: '首页',
        icon: 'i-base-home-3-line',
        hideChildrenInMenu: true,
        monitorBehavior: true,
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
      name: 'SonomaLayout',
      path: '/sonoma-layout',
      component: Sonoma,
      props: {
        // hasBg: false,
        // hasMargin: false,
      },
      meta: {
        title: 'Sonoma布局测试',
        icon: 'i-base-earth',
      },
      children: [
        {
          name: 'Sonoma',
          path: 'sonoma',
          component: () => import('#/pages/LayoutPageSonoma.vue'),
          meta: {
            title: 'Sonoma-Content',
          },
        },
      ],
    },
    {
      name: 'BigSurLayout',
      path: '/bigsur-layout',
      component: BigSur,
      meta: {
        title: 'BigSur布局测试',
        icon: 'i-base-earth',
      },
      children: [
        {
          name: 'BigSur',
          path: 'bigsur',
          component: () => import('#/pages/LayoutPage.vue'),
          meta: {
            title: 'BigSur-Content',
          },
        },
      ],
    },
    {
      name: 'System',
      path: '/system',
      component: CustomSonoma,
      redirect: '/system/user',
      meta: {
        title: '系统管理',
        icon: 'i-base-earth',
      },
      children: [
        {
          name: 'User',
          path: 'user',
          component: () => import('#/pages/UserPage.vue'),
          meta: {
            title: '用户管理',
            monitorBehavior: true,
          },
        },
        {
          name: 'Role',
          path: 'role',
          component: () => import('#/pages/RolePage.vue'),
          meta: {
            title: '角色管理',
            monitorBehavior: true,
          },
          children: [],
        },
        {
          name: 'Account',
          path: 'account',
          component: () => import('#/pages/AccountPage.vue'),
          meta: {
            title: '账号管理',
          },
        },
        {
          name: 'ConfirmAsset',
          path: 'confirm',
          component: () => import('#/pages/AccountPage.vue'),
          meta: {
            title: '待确认资产',
          },
        },
        {
          name: 'ConfirmAsset',
          path: 'confirm',
          component: () => import('#/pages/AccountPage.vue'),
          meta: {
            title: '待确认资产',
          },
        },
      ],
    },
    {
      name: 'testTarget',
      path: '/test',
      component: Sonoma,
      redirect: '/test/home',
      meta: {
        title: '菜单测试',
        icon: 'i-base-earth',
      },
      children: [
        {
          name: 'TestHome',
          path: 'home',
          component: () => import('#/pages/test.vue'),
          meta: {
            title: '测试https 代理',
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
      name: 'LisenseLogin',
      path: '/lisense-login',
      component: () => import('#/pages/LisenseLoginPage.vue'),
      meta: {
        title: 'Lisense登录',
      },
    },
    {
      name: 'IframeError',
      path: '/iframe-error',
      component: () => import('#/pages/IframeErrorPage.vue'),
      meta: {
        title: '嵌套异常',
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
      name: 'RolePage',
      path: '/role',
      component: () => import('#/pages/RolePage.vue'),
      meta: {
        title: '角色',
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
