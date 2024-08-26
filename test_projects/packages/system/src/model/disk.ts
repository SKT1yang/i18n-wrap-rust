/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \feature-vue\platform\front\system\src\model\disk.ts
 */
/* 类型文件 */

/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * @description: 查询告警阈值
 */
function getAssetThresholdsApi() {
  return http.get({ url: `/api/assetThresholds` });
}

/**
 * @description: 修改告警阈值
 */
function modifyAssetThresholdsApi(data) {
  return http.put({ url: `/api/assetThresholds/${data.id}`, data });
}

/**
 * @description: 查询数据清理配置
 */
function getEsCleanApi() {
  return http.get({ url: `/api/es/clean` });
}

/**
 * @description: 修改数据清理配置
 */
function modifyEsCleanApi(data) {
  return http.put({ url: `/api/es/clean`, data });
}

/**
 * @description: 查询系统参数(设备状态监测频率等)
 */
function getStatusMonitoringFrequencyApi(id: number) {
  return http.get<{
    id: number;
    baselineMonitoringFrequency: number;
    scanInterval: string
    statusMonitoringFrequency: number;
    userTimeout: number
  }>({ url: `/api/settings/${id}` });
}

/**
 * @description: 更新系统参数(设备状态监测频率等)
 */
function updateStatusMonitoringFrequencyApi(data: {
  id?: number;
  statusMonitoringFrequency?: number;
}) {
  return http.put({ url: `/api/settings/${data.id}`, data });
}

/**
 * @description: 修改设备状态监测频率
 */
function setScanIntervalApi(data: {
  id?: number;
  interval?: number;
  enabled?: 0 | 1;
}) {
  return http.put({ url: `/api/settings/scanInterval/${data.id}`, data });
}

export {
  getAssetThresholdsApi,
  modifyAssetThresholdsApi,
  getEsCleanApi,
  modifyEsCleanApi,
  getStatusMonitoringFrequencyApi,
  updateStatusMonitoringFrequencyApi,
  setScanIntervalApi
};
