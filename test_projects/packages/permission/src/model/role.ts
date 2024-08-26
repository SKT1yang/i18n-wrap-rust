/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 15:57:56
 * @path: \glsec\domains\permission\src\model\role.ts
 */

/* 类型文件 */
import type { PermissionItem } from "@guolisec/types";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 权限树状列表查询
 * @param data 查询条件
 * @returns
 */
export async function getPermissionList(params: {
  id: number; // 系统id
}) {
  return http.get<PermissionItem[]>({
    url: "/api/user/getPermissionList",
    params,
  });
}

/**
 * 统计角色下的账号数量
 * @param data 查询条件
 * @returns
 */
export async function getUserCountByRole() {
  return http.get({
    url: "/api/user/countByRole",
  });
}

/**
 * 全部角色查询
 * @param data 查询条件
 * @returns
 */
export async function getRoleList(params: { name?: string } = {}) {
  return http.get({
    url: "/api/user/getRoleList",
    params,
  });
}

/**
 * 查询角色权限
 * @param data 查询条件
 * @returns
 */
export async function getPermissionByRole(params: { id: number }) {
  return http.get<{
    [key: number]: string;
  }>({
    url: "/api/user/queryPermissionByRole",
    params,
  });
}
