
import { http } from "@guolisec/request";

/**
 * 潜在危害事件名列表
 * @param params
 */
function getPotentialEventNameApi() {
  return http.get<any>({ url: '/api/potentialHazards/search/findEventName', });
}


/**
 * 异常行为分析
 * @param params
 */
function getPotentialDataApi(params) {
  return http.get<any>({ url: '/api/potentialHazards/search/findByEndDateBetween', params });
}


/**
 * 获取事件树
 * @param params
 */
function getEventStoreTreeApi() {
  return http.get<any>({ url: '/api/eventStore/getTree' });
}

export {
  getPotentialEventNameApi,
  getPotentialDataApi,
  getEventStoreTreeApi
}