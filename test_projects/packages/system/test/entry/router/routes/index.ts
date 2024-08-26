/*
 * @name: 系统的路由能力
 * @description: 对package暴露
 * @date: 2023-04-04 14:46:20
 * @path: \system\test\entry\router\routes\index.ts
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
      name: 'System',
      path: '/system',
      component: BigSur,
      redirect: '/system/account',
      meta: {
        title: '系统管理',
        icon: 'i-base-setting',
      },
      children: [
        {
          name: 'Account',
          path: 'account',
          component: () => import('#/pages/AccountPage.vue'),
          meta: {
            title: '用户管理',
          },
        },
        {
          name: 'SystemInfo',
          path: 'system-info',
          component: () => import('#/pages/SystemInfoPage.vue'),
          meta: {
            title: '系统信息',
          },
        },
        {
          name: 'SystemLog',
          path: 'system-log',
          component: () => import('#/pages/SystemLogPage.vue'),
          meta: {
            title: '系统日志',
          },
        },
        {
          name: 'SystemSetting',
          path: 'system-setting',
          component: () => import('#/pages/SystemConfigPage.vue'),
          meta: {
            title: '系统设置',
          },
        },
        {
          name: 'SystemParamPage',
          path: 'param',
          component: () => import('#/pages/SystemParamPage.vue'),
          meta: {
            title: '系统参数',
          },
        },
        {
          name: 'SystemUpgrade',
          path: 'upgrade',
          component: () => import('#/pages/UpgradePage.vue'),
          meta: {
            title: '升级管理',
          },
        },
        {
          name: 'SystemBackup',
          path: 'backup',
          component: () => import('#/pages/DataBackupPage.vue'),
          meta: {
            title: '数据备份',
          },
        },
        {
          name: 'RemoteManage',
          path: 'remote',
          component: () => import('#/pages/RemoteManagePage.vue'),
          meta: {
            title: '远程管理',
          },
        },
        {
          name: 'Ntp',
          path: 'ntp',
          component: () => import('#/pages/NtpPage.vue'),
          meta: {
            title: 'Ntp',
          },
        },
        {
          name: 'TrustedPort',
          path: 'Trusted-Port',
          component: () => import('#/pages/TrustedPortPage.vue'),
          meta: {
            title: '端口开放规则',
          },
        },
        {
          name: 'DeviceThreshold',
          path: 'DeviceThreshold',
          component: () => import('#/pages/DeviceThresholdPage.vue'),
          meta: {
            title: '系统资源阈值',
          },
        },
      ],
    },

    {
      name: 'Interface',
      path: '/interface',
      component: () => import('#/pages/InterfacePage.vue'),
      meta: {
        title: '接口管理',
      },
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
