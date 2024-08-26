/*
 * @name: 接口
 * @description: 报表管理
 * @date: 2023-09-14 13:37:10
 * @path: \front\reports\src\service\reports.ts
 */

/* 类型文件 */
import { ReportsConfig } from "../types/reports";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 修改报表定时任务
 * @param data
 */
async function updateReportTask(data: ReportsConfig) {
  return http.post({
    url: "/api/commonReport/updateReportTask",
    data,
  });
}

/**
 * 修改报表
 * @param data
 */
async function modifyReport(data: {
  id: number;
  reportName: string;
  remarks?: string;
}) {
  return http.put({
    url: "/api/commonReport/modifyReport",
    data,
  });
}

/**
 * 删除报表
 */
async function deleteReport(params: { ids: number[] }) {
  return http.delete({
    url: "/api/commonReport/deleteReport",
    params,
  });
}

/**
 * 下载报表
 */
async function downloadReport(params: { id: number; typeId: number }) {
  return http.get({
    url: "/api/commonReport/download",
    params,
    responseType: "blob",
  });
}

export { updateReportTask, modifyReport, deleteReport, downloadReport };
export * from "../model/reports";
