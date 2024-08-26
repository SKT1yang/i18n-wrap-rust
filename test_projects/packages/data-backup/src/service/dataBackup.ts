/*
 * @name: api 接口
 * @description: 数据备份
 * @date: 2023-10-08 13:36:17
 * @path: \front\data-backup\src\service\dataBackup.ts
 */

/* 类型文件 */
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 导入数据备份
 */
async function importDataBackup(data) {
  return http.uploadMultipartFile({
    url: "/api/snapshots/inputIndex",
    data,
    timeout: 10 * 60 * 1000,
  });
}

/**
 * 删除备份文件
 */
async function deleteDataBackup(data: { idList: number[] }) {
  return http.post({
    url: "/api/fileRecord/deleteRecord",
    data,
  });
}

/**
 * 下载备份文件
 */
async function downloadDataBackup(params: { id: number }) {
  return http.get({
    url: "/api/fileRecord/download",
    params,
    responseType: "blob",
    timeout: 60 * 1000,
    headers: { "Content-Type": "application/json; application/octet-stream" },
  });
}

/**
 * 生成数据包
 */
async function outputBackup(params: { createTime: string[] }) {
  return http.get({
    url: "/api/snapshots/output",
    params,
  });
}

export * from "../model/dataBackup";
export { importDataBackup, deleteDataBackup, downloadDataBackup, outputBackup };
