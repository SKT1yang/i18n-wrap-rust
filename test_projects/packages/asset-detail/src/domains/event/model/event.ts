/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \assets-detail\src\model\event.ts
 */
import { http } from "@guolisec/request";
import { RelationDto } from "../types/event";
import { DataListResult } from "@guolisec/types";
import { IEventRecord } from "../types/event";

/**
 * 查找资产事件
 * @param params
 */
function getAssetEventApi(params: Partial<RelationDto>) {
  return http.get<any>({ url: `/api/assetInformation/event`, params });
}

/**
 * 查找资产信息-工控事件
 * @param params
 * @description 一级事件
 */
function getIcEventEsResultVoListApi(params: Partial<RelationDto>) {
  return http.get<any>({ url: `/api/assetInformation/getIcEventEsResultVoList`, params });
}

/**
 * 查找资产信息-攻击事件
 * @param params
 * @description 一级事件
 */
function getIdsEventEsResultVoListApi(params: Partial<RelationDto>) {
  return http.get<any>({ url: `/api/assetInformation/getIdsEventEsResultVoList`, params });
}

/**
 * 查找资产信息-网络事件
 * @param params
 * @description 一级事件
 */
function getNetEventEsResultVoListApi(params: Partial<RelationDto>) {
  return http.get<any>({ url: `/api/assetInformation/getNetEventEsResultVoList`, params });
}

interface GetTreatEventDto {
  createTime: [string, string];
  eventType: number;
  logSourceName: number;
  logSourceTypeName: number;
  page: number;
  size: number;
  sort: string;
  srcIp: number;
  statusType: number;
  eventId: number;
  eventIds: number[];
  level: number;
  levelEnd: number;
  name: number;
  score: number;
  treat: boolean;
  ip: string;
}

/**
 * 查看未处置事件列表
 * @param params
 */
function getUnTreatEventListApi(params: Partial<GetTreatEventDto>) {
  return http.get<DataListResult<IEventRecord>>({ url: `/api/untreatedEvent/showUnTreatEvent`, params });
}


export {
  getIcEventEsResultVoListApi,
  getIdsEventEsResultVoListApi,
  getNetEventEsResultVoListApi,
  getUnTreatEventListApi,
  getAssetEventApi
}