/*
 * @name: 路由配置
 * @description: 系统的路由能力，需要对外暴露
 */

import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { usePermissionStore, Sonoma } from '@guolisec/permission'

const pageModules: Record<string, Component> =
  import.meta.glob('../../../pages/**/*.{vue,tsx}', {
    eager: true
  }) || {}

/**
 * 获取 动态 路由配置
 * @returns
 */
function getAsyncRoutes(): RouteRecordRaw[] {
  return [
    {
      name: 'HomeParent',
      path: '/',
      component: Sonoma,
      redirect: '/home',
      meta: {
        title: '首页',
        icon: 'i-base-earth',
        hideChildrenInMenu: true
      },
      children: [
        {
          name: 'Home',
          path: 'home',
          component: () => import('@/pages/HomePage.vue'),
          meta: {
            title: '首页'
          }
        }
      ]
    }
  ]
}

/**
 * 获取 静态 路由配置
 * @returns
 */
function getStaticRoutes(): RouteRecordRaw[] {
  const permissionStore = usePermissionStore()
  return [
    {
      name: 'Root',
      path: '/',
      redirect: permissionStore.systemInfo?.homePageUrl || '/home',
      meta: {
        title: 'Root'
      }
    },
    {
      name: 'Login',
      path: '/login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      name: 'Permission',
      path: '/hidden/permission',
      component: () => import('@/pages/PermissionPage.vue'),
      meta: {
        hideMenu: true,
        title: '权限管理'
      }
    },
    {
      name: 'DynamicSystem',
      path: '/hidden/system',
      component: () => import('@/pages/SystemPage.vue'),
      meta: {
        hideMenu: true,
        title: '动态系统'
      }
    },
    {
      name: 'SystemRoute',
      path: '/system-route',
      component: () => import('@/pages/RoutePage.vue'),
      meta: {
        hideMenu: true,
        title: '系统路由'
      }
    },
    {
      name: 'IframeError',
      path: '/iframe-error',
      component: () => import('@/pages/IframeErrorPage.vue'),
      meta: {
        title: '嵌套异常'
      }
    },
    {
      name: 'Error',
      path: '/:path(.*)*',
      component: () => import('@/pages/ExceptionPage.vue'),
      meta: {
        title: '异常'
      }
    }
  ]
}

export { getAsyncRoutes, getStaticRoutes, pageModules }
