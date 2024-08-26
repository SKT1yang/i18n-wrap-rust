import { http } from "@guolisec/request";


/**
 * @description: 按时间获取设备及对应网卡
 */
const getNetworkCardByTimeApi = (obj) => {
  return http.get({ url: '/api/log/reportes/getNetworkCardByTime', params: obj });
};

/**
 * @description: 获取流量最大设备
 */
const getLargestTrafficDeviceApi = (obj) => {
  return http.get({ url: '/api/log/reportes/getLargestTrafficDevice', params: obj });
};

/**
 * @description: 流量分页查询
 */
const queryTrafficListApi = (obj) => {
  return http.get({ url: '/api/assetInformation/queryTrafficList', params: obj });
};

/**
 * @description: 查询协议流量排行
 */
const getTopProtocolOfTrafficApi = (obj?) => {
  return http.get({ url: '/api/network/queryTopProtocolOfTraffic', params: obj });
};

/**
 * @description: 流量趋势查询-小时-平均
 */
const queryTrafficTrendHourApi = (obj) => {
  return http.get({ url: '/api/log/reportes/queryTrafficTrendHour', params: obj });
};

/**
 * @description: 资产流量按小时查询
 */
const queryAssetTrafficByHourApi = (obj) => {
  return http.get({ url: '/api/log/reportes/queryAssetTrafficByHour', params: obj });
};


/**
 * @description: 协议流量按小时查询
 */
const queryProtocolTrendByHourApi = (obj) => {
  return http.get({ url: '/api/network/queryProtocolTrendByHour', params: obj });
};


/**
 * @description: 流量趋势查询-天-平均
 */
const queryTrafficTrendDayApi = (obj) => {
  return http.get({ url: '/api/log/reportes/queryTrafficTrendDay', params: obj });
};

/**
 * @description: 审计网口备注
 */
const saveInterfaceRemarkApi = (obj) => {
  return http.post({ url: '/api/interfaceRemark/saveInterfaceRemark', data: obj });
};

export {
  getNetworkCardByTimeApi,
  getLargestTrafficDeviceApi,
  queryTrafficListApi,
  getTopProtocolOfTrafficApi,
  queryTrafficTrendHourApi,
  queryAssetTrafficByHourApi,
  queryProtocolTrendByHourApi,
  queryTrafficTrendDayApi,
  saveInterfaceRemarkApi
}