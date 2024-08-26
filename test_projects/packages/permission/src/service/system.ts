/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-03-15 09:35:02
 * @path: \glsec\domains\permission\src\service\system.ts
 */

/* 类型文件 */
import type { SystemInfo } from "@guolisec/types";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

import { getAllSystemList } from "../model/system";

/**
 * 新增系统
 * @param data
 * @returns
 */
export async function createDynamicSystem(data: SystemInfo) {
  return http.post({
    url: "/api/system/addSystem",
    data,
  });
}

/**
 * 修改系统信息
 * @param data
 * @returns
 */
export async function modifyDynamicSystem(data: SystemInfo) {
  return http.put({
    url: "/api/system/modifySystem",
    data,
  });
}

/**
 * 删除系统
 * @param params id数组，批量删除
 * @returns
 */
export async function deleteDynamicSystem(params: { ids: number[] }) {
  return http.delete({
    url: "/api/system/deleteSystem",
    params,
  });
}

export { getAllSystemList };
