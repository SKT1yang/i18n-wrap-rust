/*
 * @name: 漏洞库 - api 接口
 * @description: Do not edit
 * @date: 2023-09-22 16:14:36
 * @path: \front\knowledge\src\model\vulStore.ts
 */
/* 类型文件 */
import type { DataListResult } from "@guolisec/types";
import type { Vulnerability } from "../types/vulStore";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 获取漏洞库
 */
async function findVulListByPage(params: {
  page: number;
  size: number;
  createTime?: string[];
  level?: number;
  sort?: string;
}) {
  return http.get<DataListResult<Vulnerability>>({
    url: "/api/vul/findVulListByPage",
    params,
  });
}

export { findVulListByPage };
