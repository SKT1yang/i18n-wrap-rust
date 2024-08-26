/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-03-15 09:29:59
 * @path: \permission\src\model\route.ts
 */

/* 类型文件 */
import type { PermissionTreeItem, PermissionInfo } from '@guolisec/types';
/* 第三方模块 */
import { http } from '@guolisec/request';
/* 本地共享模块 */
import { treeDataTranslate } from '../utils';
/* 业务模块 */
import { usePermissionStoreWithOut } from '../model/store';
import { getLoginInfo } from './login';

/**
 * 获取指定系统权限
 * @description: 系统权限返回的是一级平铺的结构，需要自己转换成树形结构
 * @param {id} 系统id
 * @returns
 */

export async function getSystemPermission(
  id: number,
  fillObject?: Record<string, any>
) {
  let flattenRoutes = await http.get<PermissionTreeItem[]>({
    url: '/api/system/getSystemPermission',
    params: {
      id,
    },
  });
  if (fillObject) {
    flattenRoutes = flattenRoutes.map((route) => {
      return {
        ...fillObject,
        ...route,
      };
    });
  }
  return treeDataTranslate(flattenRoutes, 0) || [];
}

/**
 * 获取后端动态路由数据
 * @returns
 */
export async function getSystemDynamicRoutes(permissionInfo?: PermissionInfo) {
  const permissionStore = usePermissionStoreWithOut();
  // 未提供权限数据，从后台获取最新权限数据，减少一次接口请求
  if (!permissionInfo) {
    const loginInfo = await getLoginInfo('getSystemDynamicRoutes');
    permissionInfo = loginInfo.permissionInfo;
  }

  // 更新权限缓存
  permissionStore.setPermissionInfo(permissionInfo);
  // 所有返回的路由id
  const idList: number[] = [0];
  // 还原meta数据
  const permissionListWithMeta = permissionInfo.map((item) => {
    const { id, pid, component, name, path, props, redirect, ...meta } = item;
    id && idList.push(id);
    return {
      id,
      pid,
      props: props ? JSON.parse(props) : null,
      component,
      name,
      path,
      redirect,
      meta,
    };
  });
  /**
   * 1.找不到父id挂载的权限，也就是隔代中断权限
   * 2. 没有component
   */
  const interruptPermission = permissionListWithMeta
    .filter((item) => {
      return (
        item.pid !== undefined && !idList.includes(item.pid) && item.component
      );
    })
    .map((item) => {
      item.meta.hideMenu = true;
      return item;
    });
  const continousMenuTree = treeDataTranslate(permissionListWithMeta, 0) || [];
  return [...continousMenuTree, ...interruptPermission];
}
