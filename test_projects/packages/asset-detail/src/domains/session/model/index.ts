/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { http } from "@guolisec/request";
/**
 * @description: 资产流量按天查询
 */
function queryAssetTrafficByDayApi(params) {
  return http.get({ url: `/api/log/reportes/queryAssetTrafficByDay`, params });
};

/**
 * @description: 资产流量按小时查询
 */
const queryAssetTrafficByHourApi = (params) => {
  return http.get({ url: `/api/log/reportes/queryAssetTrafficByHour`, params });
};

/**
 * 查找资产信息-查找资产会话信息
 * @param params
 */
function getSessionInformationApi(params) {
  return http.get<any>({ url: `/api/assetInformation/sessionInformation`, params });
}


export {
  queryAssetTrafficByDayApi,
  queryAssetTrafficByHourApi,
  getSessionInformationApi
}