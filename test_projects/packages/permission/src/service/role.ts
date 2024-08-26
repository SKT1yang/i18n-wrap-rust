/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-21 19:49:15
 * @path: \permission\src\src\service\role.ts
 */
/* 类型文件 */
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */
import {
  getRoleList,
  getUserCountByRole,
  getPermissionList,
  getPermissionByRole,
} from "../model/role";

export async function deleteRole(params: { id: number }) {
  return http.delete<string>({
    url: "/api/user/deleteRole",
    params,
  });
}

/**
 * 角色信息修改
 * @param params
 * @returns
 */
export async function modifyRoleInfo(data: {
  acountNum?: number;
  id?: number;
  name: string;
  privilege: number;
  remark?: string;
}) {
  return http.post<string>({
    url: "/api/user/modifyRoleInform",
    data,
  });
}

/**
 * 角色信息新增
 * @param params
 * @returns
 */
export async function createRole(data: {
  acountNum?: number;
  id?: number;
  name: string;
  privilege: number;
  remark: string;
  systemId: number;
}) {
  return http.post<string>({
    url: "/api/user/addRole",
    data,
  });
}

/**
 * 给用户分配权限
 * @param params
 * @returns
 */
export async function setUserRole(data: {
  id: number;
  roleId: number;
  systemId: number;
}) {
  return http.post<string>({
    url: "/api/user/modifyUserRole",
    data,
  });
}

/**
 * 通用角色权限修改
 * @param data
 * @returns
 */
export async function setRolePermission(
  data: {
    permissionId?: number;
    roleId: number;
  }[]
) {
  return http.post({
    url: "/api/user/setRolePermission",
    data,
  });
}

export {
  getRoleList,
  getPermissionList,
  getUserCountByRole,
  getPermissionByRole,
};
