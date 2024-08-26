/*
 * @name: Do not edit
 * @description: Do not edit
 */

/* 类型文件 */
import type { RouteRecordRaw, RouteRecordName } from 'vue-router';
import type { PermissionItem, PermissionInfo } from '@guolisec/types';
/* 第三方模块 */
import { http } from '@guolisec/request';
import { isFunction, log, warn } from '@guolisec/utils';
import { emit } from '@guolisec/scheduler';
import { useSystemConfig } from '@guolisec/configable';
import { useRouter } from '@guolisec/routerable';
/* 本地共享模块 */
import { filter } from '../../utils/treeHelper';
import { transformRouteToMenu } from '../menu';
/* 业务模块 */
import { usePermissionStoreWithOut } from '../../model/store';
import { getSystemPermission } from '../../model/route';
import {
  flatMultiLevelRoutes,
  routeRemoveIgnoreFilter,
  transformObjToRoute,
  getRouteNames,
} from './helper';
import { getSystemDynamicRoutes } from '../../model/route';

/**
 * 设置系统权限 批量设置，需要平铺成一级结构
 * @param data
 * @returns
 */
async function setSystemPermission(data: {
  routes: PermissionItem[];
  systemId: number;
}) {
  return http.post<'success'>({
    url: '/api/system/setSystemPermission',
    data,
  });
}

/**
 * 修改单条系统权限
 * @param data
 * @returns
 */
async function modifySystemPermission(data: PermissionItem) {
  return http.post<'success'>({
    url: '/api/system/modifySystemPermission',
    data,
  });
}

/**
 * 批量删除指定系统权限
 * @param params id数组，批量删除
 * @returns
 */
async function deleteSystemPermission(ids: number[]) {
  return http.delete<'success'>({
    url: '/api/system/deleteSystemPermission',
    params: { ids: ids.join() },
  });
}

/**
 * 初次生成router实例的routes配置
 */
async function emitStaticRoutes() {
  log('[@guolisec/permission] 发布获取静态路由消息执行了 emitStaticRoutes');

  const maybeGetStaticRoutesDataList = await emit<
    RouteRecordRaw[] | (() => RouteRecordRaw[])
  >('getStaticRoutes');
  log(
    '[@guolisec/permission] 获取的系统静态路由为：maybeGetStaticRoutesDataList',
    maybeGetStaticRoutesDataList
  );
  if (
    Array.isArray(maybeGetStaticRoutesDataList) &&
    maybeGetStaticRoutesDataList.length > 0
  ) {
    let maybeGetStaticRoutes = maybeGetStaticRoutesDataList[0] as
      | RouteRecordRaw[]
      | (() => RouteRecordRaw[]);
    return isFunction(maybeGetStaticRoutes)
      ? maybeGetStaticRoutes()
      : maybeGetStaticRoutes;
  }
  return [];
}

/**
 * 获取用户配置的动态路由配置
 */
async function getAsyncRoutes() {
  const maybeGetAsyncRoutesDataList = await emit<
    RouteRecordRaw[] | (() => RouteRecordRaw[])
  >('getAsyncRoutes');
  if (
    Array.isArray(maybeGetAsyncRoutesDataList) &&
    maybeGetAsyncRoutesDataList.length > 0
  ) {
    let maybeGetAsyncRoutes = maybeGetAsyncRoutesDataList[0] as
      | RouteRecordRaw[]
      | (() => RouteRecordRaw[]);
    return isFunction(maybeGetAsyncRoutes)
      ? maybeGetAsyncRoutes()
      : maybeGetAsyncRoutes;
  }
  return [];
}

/**
 * 二次生成routes配置
 * @description 一般用于登陆后不同用户生成不同路由
 * @returns
 */
async function buildRoutes(permissionInfo?: PermissionInfo) {
  log('二次生成routes配置 buildRoutes');

  let routes: RouteRecordRaw[] = [];
  const permissionStore = usePermissionStoreWithOut();
  const staticRoutes = await emitStaticRoutes();
  const systemConfig = useSystemConfig();
  let permissionMode = systemConfig?.permissionMode;
  switch (permissionMode) {
    // 路由映射模式
    case 'ROUTE_MAPPING':
      // 获取用户配置的动态路由配置
      const asyncRoutes = await getAsyncRoutes();
      routes = asyncRoutes;
      // 将路由转换成菜单
      const frontMenuList = transformRouteToMenu(routes);
      // 对菜单进行排序
      frontMenuList.sort((a, b) => {
        return (a.meta?.orderNo || 999) - (b.meta?.orderNo || 999);
      });
      // 设置菜单列表
      permissionStore.setMenuList(frontMenuList);

      // 移除掉 ignoreRoute: true 的路由 非一级路由
      routes = filter(routes, routeRemoveIgnoreFilter, {
        excludeChildren: true,
      });
      // 移除掉 ignoreRoute: true 的路由 一级路由；
      routes = routes.filter(routeRemoveIgnoreFilter);

      // 将多级路由转换为 2 级路由
      routes = flatMultiLevelRoutes(routes);
      break;
    // 后端路由模式
    case 'BACK':
      let routeList: RouteRecordRaw[] = [];
      try {
        routeList = (await getSystemDynamicRoutes(
          permissionInfo
        )) as unknown as RouteRecordRaw[];
      } catch (error) {
        console.error(error, 'getSystemDynamicRoutes');
      }
      // 动态引入组件
      routeList = await transformObjToRoute(routeList);
      //  后台路由到菜单结构
      const backMenuList = transformRouteToMenu(routeList);
      // 对菜单进行排序
      backMenuList.sort((a, b) => {
        return (a.meta?.orderNo || 999) - (b.meta?.orderNo || 999);
      });
      permissionStore.setMenuList(backMenuList);

      // 删除 meta.ignoreRoute 项
      routeList = filter(routeList, routeRemoveIgnoreFilter);
      routeList = routeList.filter(routeRemoveIgnoreFilter);

      routeList = flatMultiLevelRoutes(routeList);
      routes = [...routeList, ...staticRoutes];
      break;
    default:
      console.warn('未匹配到权限模式');
  }
  duplicateRouteNameWarn(routes);
  return routes;
}

// reset router
async function resetRouter() {
  let whiteNameList: RouteRecordName[] = [];
  const staticRoutes = await emitStaticRoutes();
  if (staticRoutes.length > 0) {
    // 填充白名单名
    whiteNameList = getRouteNames(staticRoutes);
  }
  const router = useRouter();
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !whiteNameList.includes(name)) {
      warn(`执行重置路由，将要删除${String(name)}`, name, whiteNameList);
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

/**
 * 路由重名检测告警
 * @param routes
 */
function duplicateRouteNameWarn(routes: RouteRecordRaw[]) {
  let names = getRouteNames(routes);
  const uniqNames: RouteRecordName[] = [];
  const duplicateNames: RouteRecordName[] = [];
  for (let index = 0; index < names.length; index++) {
    const name = names[index];
    if (!uniqNames.includes(name)) {
      uniqNames.push(name);
    } else {
      duplicateNames.push(name);
    }
  }
  if (duplicateNames.length > 0) {
    warn(
      `route name字段存在重名，重复route name为：${String(
        duplicateNames.join()
      )}`
    );
  }
}

export {
  getSystemPermission,
  buildRoutes,
  getAsyncRoutes,
  resetRouter,
  emitStaticRoutes,
  deleteSystemPermission,
  modifySystemPermission,
  setSystemPermission,
};
