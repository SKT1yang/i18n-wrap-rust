/*
 * @name: api 接口
 * @description: Do not edit
 * @date: 2023-10-10 09:09:42
 * @path: \front\data-backup\src\service\dataDump.ts
 */
/* 类型文件 */
import type { FtpSettings } from "../types/dataDump";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 导入数据备份
 */
async function setFtp(data: FtpSettings) {
  return http.post({
    url: "/api/ftp/setFtp",
    data,
    timeout: 1000 * 60,
  });
}

/**
 * 设置 Ftp 转储状态
 */
async function setFtpStatus(data: { status: 0 | 1 }) {
  return http.post({
    url: "/api/ftp/setFtpStatus",
    data,
  });
}

export * from "../model/dataDump";
export { setFtp, setFtpStatus };
