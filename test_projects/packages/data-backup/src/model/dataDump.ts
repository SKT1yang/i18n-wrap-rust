/*
 * @name: api 接口
 * @description: 数据转储
 * @date: 2023-10-08 10:11:34
 * @path: \front\data-backup\src\model\dataDump.ts
 */

/* 类型文件 */
import type { FtpSettings } from "../types/dataDump";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 获取 FTP 参数
 * @returns
 */
async function getFtpSettingList() {
  return http.get<FtpSettings[]>({
    url: "/api/ftp/getFtpSettingList",
  });
}

/**
 * 获取 FTP 转储状态
 * @returns
 */
async function getFtpStatus() {
  return http.get<0 | 1 | null>({
    url: "/api/ftp/getFtpStatus",
  });
}

export { getFtpSettingList, getFtpStatus };
