/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-21 10:46:03
 * @path: \system\src\model\info.ts
 */
/* 类型文件 */

/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * @description: 获取SN
 */
function getSnApi() {
  return http.get<string>({ url: `/api/sn` });
}

/**
 * @description: 获取系统硬件信息
 */
function getHardwareInfoApi() {
  return http.get<{
    memUsedTotal: string;
    memTotal: string;
    cpuRate: string;
    sysDiskTotal: string;
    sysDiskUsedTotal: string;
    dataDiskUsedTotal: string;
    memUsedRate: string;
    dataDiskUsedRate: string;
    dataDiskTotal: string;
    sysDiskUsedRate: string;
  }>({ url: `/api/sn/getRealTimeInfo` });
}

/**
 * @description: 查询系统版本
 */
function getSystemVersionApi() {
  return http.get({ url: `/api/systemManager/version` });
}

function diskWarningApi() {
  return http.get({ url: `/api/alarm/diskLog` });
}

export { getSnApi, getHardwareInfoApi, getSystemVersionApi, diskWarningApi };
