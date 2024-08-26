import { http } from "@guolisec/request";

/**
 * @description: 
 */
export interface LogBasicContent {
  logSourceTypeCode?: number;
  appServerName?: string;
  applayerProtocolId?: number;
  clientId?: string;
  dstIp?: string;
  dstIps?: string[];
  eventId?: number;
  eventLevels?: number[];
  appServerId?: number;
  createTime?: string[] | undefined[];
  eventName?: string;
  eventNameTabs?: string[] | string;
  eventNames?: string[];
  eventObject?: string;
  eventSubject?: string;
  eventType?: string;
  eventTypes?: string[];
  eventLevel?: number;
  id?: number;
  indexName?: string;
  logSourceIps?: string[];
  logSourceName?: string;
  logSourceNameTag?: string;
  logSourceNames?: string[];
  logSourceType?: string;
  hostName?: string;
  logSourceTypeCodes?: number[];
  logType?: number;
  message?: string;
  module?: string;
  name?: string;
  score?: number;
  scores?: number[];
  sign?: string;
  signDiff?: string;
  signMd5?: string;
  sn?: string;
  srcIp?: string;
  srcIps?: string[];
  statusType?: 0 | 1 | 2 | 3;
  aggregation?: string;
  assetBrand?: string;
  dstIpNotNull?: string;
  srcIpNotNull?: string;
  logSourceIp?: string;
  uuid?: string;
}
export interface LogParamsContent extends LogBasicContent {
  page: number;
  size: number;
  sort?: string;
}

const getEsLogDataApi = (obj: LogParamsContent) => {
  return http.get({ url: '/api/log/es', params: obj });
};

/**
 * @description:聚合查询
 */
const getAggregationApi = (obj) => {
  return http.get({ url: '/api/log/es/aggregation', params: obj });
};

/**
 * @description: 查询合并后的事件名称
 */
const getEndEventComposeApi = () => {
  return http.get<string[]>({ url: '/api/eventComposeSetting/getEndEventCompose', });
};

/**
 * @description:获取SOC标准字典
 */
const getSocDictionaryApi = () => {
  return http.get({ url: '/api/log/es/situation/getSocDictionary' });
};


export {
  getEsLogDataApi,
  getAggregationApi,
  getEndEventComposeApi,
  getSocDictionaryApi
}