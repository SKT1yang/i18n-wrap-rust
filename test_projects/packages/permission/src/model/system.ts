/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-03-15 09:29:59
 * @path: \glsec\domains\permission\src\model\system.ts
 */

/* 类型文件 */
import type { SystemInfo } from '@guolisec/types';
/* 第三方模块 */
import { http } from '@guolisec/request';
/* 本地共享模块 */

/* 业务模块 */

/**
 * 获取所有系统信息
 * @description: 获取所有系统信息
 * @returns
 */
export async function getAllSystemList() {
  return http.get<SystemInfo[]>({
    url: '/api/system/getAllSystem',
  });
}

/**
 * 切换当前系统
 */

export const switchActiveSystemApi = (params: { id: number }) => {
  return http.get<SystemInfo[]>({ url: `/api/system/switchSystem`, params });
};
