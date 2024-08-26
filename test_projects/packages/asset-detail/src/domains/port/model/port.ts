/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { http } from "@guolisec/request";
import { OpenPortAndService, Port } from "../types/port";
import type { DataListResult } from "@guolisec/types";

/**
 * 查找资产信息-资产服务
 * @param params
 */
function getAssetServiceListApi(params: { assetIp: string }) {
  return http.get<OpenPortAndService[]>({
    url: `/api/commonConfig/assetServiceList`,
    params,
  });
}

/**
 * 获取端口信息
 */
function getAssetPortInfo(params: {
  deviceIp: string;
  deviceMac: string;
  page: number;
  size: number;
  sort: string;
  ports?: number[];
  protocols?: string[];
}) {
  return http.get<DataListResult<Port>>({
    url: `/api/assetDetail/getAssetProcessInfo`,
    params,
  });
}

/**
 * 获取进程信息聚合查询条件
 */
function getAssetPortAggregation(params: {
  deviceIp: string;
  deviceMac: string;
}) {
  return http.get<{
    pid: number[];
    port: number[];
    protocol: string[];
  }>({
    url: `/api/assetDetail/getAssetProcessAggregation`,
    params,
  });
}

export { getAssetServiceListApi, getAssetPortInfo, getAssetPortAggregation };
