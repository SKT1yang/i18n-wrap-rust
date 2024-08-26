/*
 * @name: app代码调度中心
 * @description: 【第三方库】（包括@guolisec系列【插件】）和【系统】相互调用（或注入）代码的地方
 */

/* 类型文件 */
import type { App } from 'vue'
/* 插件 */
import { on } from '@guolisec/scheduler'
import { setupStore } from '@guolisec/storable'
import { setupRouter } from '@guolisec/routerable'
import { setDocumentTitle, setDocumentIconLink } from '@guolisec/utils'
import { logout, refreshLoginState, createPermissionGuard } from '@guolisec/permission'
/* 系统接口 */
import { getAsyncRoutes, getLayoutMap, getStaticRoutes, pageModules } from '@/entry/interface'

/**
 * 全局状态实例创建前
 */
async function beforeCreateStore() {}

/**
 * 全局状态创建后
 * @param router
 */
async function afterCreateStore(store) {
  // !初始化storable
  setupStore(store)
}

/**
 * 路由实例创建前
 */
async function beforeCreateRouter() {
  await on('getStaticRoutes', {
    handler() {
      const result = getStaticRoutes()
      return result
    }
  })

  await on('getAsyncRoutes', {
    handler() {
      return getAsyncRoutes()
    }
  })
}

/**
 * 路由实例创建后
 * @param router
 */
async function afterCreateRouter(router) {
  // 初始化全局路由实例
  setupRouter(router)
  // 权限路由前置守卫
  createPermissionGuard()
}

/**
 * 应用实例创建前
 */
async function beforeCreateApp() {}

/**
 * 应用实例创建后
 */
async function afterCreateApp(app: App) {
  console.log('应用实例创建后', app)
}

/**
 * 应用实例挂载到容器元素前
 */
async function beforeMountedApp() {
  // 网页title
  setDocumentTitle()

  // 设置浏览器标签图标
  setDocumentIconLink()

  await on('logout', {
    handler(nodify) {
      logout(nodify?.data)
    }
  })

  await on('refreshLoginState', {
    handler() {
      return refreshLoginState()
    }
  })

  await on('getLayoutMap', {
    handler() {
      return getLayoutMap()
    }
  })

  await on('pageModules', {
    handler() {
      return pageModules
    }
  })
}

/**
 * 应用实例挂载到容器元素后
 */
async function afterMountedApp() {}

export {
  beforeCreateStore,
  afterCreateStore,
  beforeCreateRouter,
  afterCreateRouter,
  beforeCreateApp,
  afterCreateApp,
  beforeMountedApp,
  afterMountedApp
}
