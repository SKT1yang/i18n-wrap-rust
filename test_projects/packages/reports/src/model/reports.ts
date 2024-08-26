/*
 * @name: 接口
 * @description: 报表管理
 * @date: 2023-09-14 13:08:28
 * @path: \front\reports\src\model\reports.ts
 */
/* 类型文件 */
import type { DataListResult } from "@guolisec/types";
import type { ReportsConfig, Report } from "../types/reports";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 查询报表定时任务
 * @returns
 */
async function queryReportTask() {
  return http.get<ReportsConfig[]>({
    url: "/api/commonReport/queryReportTask",
  });
}

/**
 * 查询报表
 * @returns
 */
async function queryReport(params: {
  page?: number;
  size?: number;
  sort?: string;
  types: 1 | 2 | 3;
}) {
  return http.get<DataListResult<Report>>({
    url: "/api/commonReport/queryReport",
    params,
  });
}

export { queryReportTask, queryReport };
