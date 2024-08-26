/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-21 19:49:15
 * @path: \glsec\domains\permission\src\service\permission.ts
 */
/* 类型文件 */
import type { PermissionItem } from "@guolisec/types";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

import { getPermissionList } from "../model/permission";

/**
 * 通用权限添加
 * @param data
 * @returns
 */
export async function createPermission(permissionList: PermissionItem[]) {
  return http.post<PermissionItem[]>({
    url: "/api/route/addRoute",
    data: {
      routes: permissionList,
    },
  });
}

/**
 * 通用权限修改
 * @param data
 * @returns
 */
export async function modifyPermission(data: PermissionItem) {
  return http.put<PermissionItem[]>({
    url: "/api/route/modifyRoute",
    data,
  });
}

/**
 * 通用权限删除
 * @param params
 * @returns
 */
export async function deletePermission(params: { ids: number[] }) {
  return http.delete({
    url: "/api/route/deleteRoute",
    params,
  });
}

export { getPermissionList };
