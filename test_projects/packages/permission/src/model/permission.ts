/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 15:57:56
 * @path: \glsec\domains\permission\src\model\permission.ts
 */

/* 类型文件 */
import type { DataListResult, PermissionItem } from "@guolisec/types";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 查询路由
 * @description: 查询 路由-->前端页面 的映射表
 * @returns
 */
export async function getPermissionList(params: {
  page: number;
  size: number;
  name?: string;
  title?: string;
}) {
  return http.get<DataListResult<PermissionItem>>({
    url: "/api/route/getRouteTable",
    params,
  });
}
