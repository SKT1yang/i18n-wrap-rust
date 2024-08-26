import { http } from "@guolisec/request";

/**
 * 潜在危害分析
 * @param params
 */
function getAbnormalDataApi(params) {
  return http.get<any>({ url: '/api/abnormalBehaviors/search/findByStartDateBetween', params });
}

/**
 * 异常行为事件名列表
 * @param params
 */
function getAbnormalBehaviorsEventNameApi() {
  return http.get<any>({ url: '/api/abnormalBehaviors/search/findEventName', });
}


export {
  getAbnormalDataApi,
  getAbnormalBehaviorsEventNameApi
}