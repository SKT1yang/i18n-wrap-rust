import { http } from "@guolisec/request";

/**
 * 显示未处置事件列表
 * @param params
 */
function getShowUntreatedEventListApi(params) {
  return http.get<any>({ url: '/api/untreatedEvent/showUnTreatEvent', params });
}

/**
 * @description: 查询事件名称
 */
const getEventNameApi = (obj) => {
  return http.get({ url: '/api/realtimeMonitoring/getEventName', params: obj });
};


/**
 * @description: 查询工控事件名称
 */
const getIcsEventNameApi = () => {
  return http.get({ url: '/api/realtimeMonitoring/getIcsEventName' });
};

/**
 * @description: 查询异常工控时间日志源名称
 */
const getIcsLogSourceTypeName = () => {
  return http.get({ url: '/api/realtimeMonitoring/getIcsLogSourceName' });
};

/**
 * @description: 查询日志源名称
 */
const getLogSourceNameApi = (obj) => {
  return http.get({ url: '/api/realtimeMonitoring/getLogSourceName', params: obj });
};

/**
 * @description: 查询日志源类型名称
 */
const getLogSourceTypeNameApi = (obj) => {
  return http.get({ url: '/api/realtimeMonitoring/getLogSourceTypeName', params: obj });
};

/**
 * 获取异常工控事件tab
 * @param params
 */
const getIcsTabApi = () => {
  return http.get<any>({ url: '/api/event/getIcsTab' });
}

export {
  getShowUntreatedEventListApi,
  getEventNameApi,
  getIcsEventNameApi,
  getIcsLogSourceTypeName,
  getLogSourceNameApi,
  getLogSourceTypeNameApi,
  getIcsTabApi
}