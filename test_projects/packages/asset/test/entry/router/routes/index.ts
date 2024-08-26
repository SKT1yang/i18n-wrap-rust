/*
 * @name: 系统的路由能力
 * @description: 对package暴露
 */
import { type Component } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { usePermissionStore } from '@guolisec/permission';
import { BigSur } from '@guolisec/permission';
import { Sonoma } from '@guolisec/permission';

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
      name: 'AssetManage',
      path: '/asset',
      component: Sonoma,
      redirect: '/asset/list',
      meta: {
        title: '资产管理',
        icon: 'i-base-earth',
      },
      children: [
        {
          name: 'AssetList',
          path: 'list',
          component: () => import('#/pages/AssetListPage.vue'),
          meta: {
            title: '资产清单',
          },
        },
        {
          name: 'TabsAsset',
          path: 'tabs',
          component: () => import('#/pages/TabsAssetPage.vue'),
          meta: {
            title: 'Tabs资产清单',
          },
        },
        {
          name: 'AssetsStatusPage',
          path: '/asset/status',
          component: () => import('#/pages/AssetsStatusPage.vue'),
          meta: {
            title: '资产状态',
          },
        },
        {
          name: 'AssetsFieldPage',
          path: '/asset/field',
          component: () => import('#/pages/AssetsFieldPage.vue'),
          meta: {
            title: '资产域管理',
          },
        },
        {
          name: 'AssetsRelationPage',
          path: '/asset/relation',
          component: () => import('#/pages/AssetsRelationPage.vue'),
          meta: {
            title: '资产关系',
          },
        },
        {
          name: 'AssetsImportancePage',
          path: '/asset/importance',
          component: () => import('#/pages/AssetsImportancePage.vue'),
          meta: {
            title: '关键资产',
          },
        },
        {
          name: 'StockAsset',
          path: 'stock',
          component: () => import('#/pages/StockAssetPage.vue'),
          meta: {
            title: '待入库资产',
          },
        },
        {
          name: 'VerifyAsset',
          path: 'verify',
          component: () => import('#/pages/VerifyAssetPage.vue'),
          meta: {
            title: '待核查资产',
          },
        },
        {
          name: 'ConfirmAsset',
          path: 'confirm',
          component: () => import('#/pages/ConfirmScanAssetPage.vue'),
          meta: {
            title: '待确认资产',
          },
        },
        {
          name: 'StockAssetBatch',
          path: 'stock-batch',
          component: () => import('#/pages/StockAssetBatchPage.vue'),
          meta: {
            title: '资产批量入库',
          },
        },
        {
          name: 'AssetCompare',
          path: 'compare',
          component: () => import('#/pages/AssetComparePage.vue'),
          meta: {
            title: '资产核查',
          },
        },
      ],
    },
    {
      name: 'AssetDetail',
      path: '/asset/detail',
      component: () => import('#/pages/AssetDetailPage.vue'),
      meta: {
        hideMenu: true,
        title: '资产详情',
      },
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
