/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \system\src\model\cascade.ts
 */
import { http } from "@guolisec/request";

/**
 * @description: 获取级联管理平台ip
 */
function getRegisterIpApi() {
  return http.get({ url: `/api/analysis/getRegisterIp` });
}

/**
 * @description: 注册级联管理平台
 */
function setRegisterIpApi(data) {
  return http.post({ url: `/api/analysis/register`, data });
}

/**
 * @description: 获取设备客户端的平台ip
 */
function getClientIpApi() {
  return http.get({ url: `/api/setting/clientIp` });
}

/**
 * @description: 配置设备客户端的平台ip
 */
function setClientIpApi(data) {
  return http.put({ url: `/api/setting/clientIp`, data });
}

/**
 * @description: 查询远程管理标识
 */
function getClientNameApi() {
  return http.get({ url: `/api/setting/clientName` });
}

/**
 * @description: 修改远程管理标识
 */
function setClientNameApi(data) {
  return http.put({ url: `/api/setting/clientName`, data });
}

/**
 * @description: 资产组同步
 */
function assetGroupSyncApi(data) {
  return http.post({ url: `/api/setting/assetGroupSync`, data });
}

/**
 * @description: 用户日志查询
 */
function getSystemLogsAllApi(params) {
  return http.get({ url: `/api/logs/all`, params });
}

export {
  getRegisterIpApi,
  setRegisterIpApi,
  getClientIpApi,
  setClientIpApi,
  getClientNameApi,
  setClientNameApi,
  assetGroupSyncApi,
  getSystemLogsAllApi
};
