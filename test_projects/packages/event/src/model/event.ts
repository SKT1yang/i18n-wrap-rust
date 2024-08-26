import { http } from "@guolisec/request";
/**
 * @description: 获取事件类型下拉选项
 */
interface EventTypeItem {
  id: number;
  name: string;
  level: number;
  eventTypes: EventTypeItem;
}
const getTreeEventTypeOptsApi = () => {
  return http.get<EventTypeItem[]>({ url: '/api/eventStore/getTree' });
};
/**
 * @description: 获取日志源类型下拉选项、事件名称下拉选项
 */
const getSearchAggTermApi = () => {
  return http.get({ url: '/api/log/es/searchAggTerm' });
};

/**
 * @description: 获取事件表格数据
 */
const getEventListApi = (obj?) => {
  return http.get({ url: '/api/log/es', params: obj });
};


/**
 * 未处置事件按事件名称统计
 */
function getCountUntreatedEventByEventNameReportApi(obj) {
  return http.get<any>({ url: '/api/untreatedEvent/situation/countUntreatedEventByEventNameReport', params: obj });
}

/**
 * 获取事件库级类型
 * @param params
 */
function getEventTypeLevelApi(pid?: number) {
  return http.get<any>({ url: '/api/eventStore/getLevel' + `/${pid}` });
}

/**
 * 未处置事件按事件等级统计
 */
function getCountUntreatedEventByEventLevelReportApi(obj) {
  return http.get<any>({ url: '/api/untreatedEvent/situation/countUntreatedEventByEventLevelReport', params: obj });
}


export {
  getTreeEventTypeOptsApi,
  getSearchAggTermApi,
  getEventListApi,
  getEventTypeLevelApi,
  getCountUntreatedEventByEventNameReportApi,
  getCountUntreatedEventByEventLevelReportApi,
}