/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-27 18:02:51
 * @path: \system\src\model\ntp.ts
 */
import { http } from "@guolisec/request";

/**
 * @description: 获取客户端时间
 */
function getSystemDateApi() {
  return http.get({ url: `/api/systemDate` });
}

/**
 * @description: 获取客户端时间
 */
function modifySystemDateApi(data) {
  return http.put({ url: `/api/systemDate`, data });
}

/**
 * @description: 获取IP时钟同步
 */
function getClockSyncIpApi() {
  return http.get({ url: `/api/timeSyncSetting` });
}

/**
 * @description: 设置IP时钟同步
 */
function modifyClockSyncIpApi(data) {
  return http.put({ url: `/api/timeSyncSetting`, data });
}

export {
  getSystemDateApi,
  modifySystemDateApi,
  getClockSyncIpApi,
  modifyClockSyncIpApi,
};
