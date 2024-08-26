import { http } from "@guolisec/request";

/**
 * @description: 查询资产会话上送设备
 */
const getDeviceBySessionApi = (obj) => {
  return http.get({ url: '/api/log/reportes/getDeviceBySession', params: obj });
};

/**
 * @description: 会话列表查询
 */
const querySessionListApi = (obj) => {
  return http.get({ url: '/api/log/reportes/querySessionList', params: obj });
};

/**
 * @description: 会话协议与状态数量查询
 */
const querySessionCountApi = (obj) => {
  return http.get({ url: '/api/log/reportes/querySessionCount', params: obj });
};

/**
 * @description: 获取应用层协议列表
 */
const getAppProtocolApi = (obj?) => {
  return http.get({ url: '/api/protocolList', params: obj });
};

/**
 * @description: 会话top10查询
 */
const querySessionTop10Api = (obj) => {
  return http.get({ url: '/api/log/reportes/querySessionTop10', params: obj });
};

export {
  getDeviceBySessionApi,
  querySessionListApi,
  querySessionCountApi,
  getAppProtocolApi,
  querySessionTop10Api
}