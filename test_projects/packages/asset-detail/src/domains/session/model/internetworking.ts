import { http } from "@guolisec/request";
import type {
  AssetCommunicationQuery,
  AssetCommunication,
} from "../types/internetworking";
import type { DataListResult } from "@guolisec/types";

/**
 * 获取网络互联列表
 */
function getAssetCommunicationInfo(params: AssetCommunicationQuery) {
  return http.get<DataListResult<AssetCommunication>>({
    url: `/api/assetDetail/getAssetCommunicationInfo`,
    params,
  });
}

/**
 * 获取网络互联聚合查询条件
 */
function getAssetCommunicationAggregation(params: {
  deviceIp: string;
  deviceMac: string;
  pidNot: number
}) {
  return http.get<{
    programName: string[];
    state: string[];
    protocol: string[];
  }>({
    url: `/api/assetDetail/getAssetCommunicationAggregation`,
    params,
  });
}

/**
 * 获取远程 IP 非自身的网络互联列表
 */
function getAssetCommunicationInfoNoSelf(params: {
  deviceIp: string;
  deviceMac: string;
  pidNot: number
}) {
  return http.get<AssetCommunication[]>({
    url: `/api/assetDetail/getAssetCommunicationInfoNoSelf`,
    params,
  });
}


export {
  getAssetCommunicationInfo,
  getAssetCommunicationAggregation,
  getAssetCommunicationInfoNoSelf
};
