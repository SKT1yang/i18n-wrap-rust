import { http } from "@guolisec/request";
import type { Application, OS } from "../types";
import type { DataListResult, IAsset } from "@guolisec/types";

/**
 * 获取应用信息
 */
function getAssetAppInfo(params: {
  deviceIp: string;
  deviceMac: string;
  page: number;
  size: number;
  sort: string;
  manufactures?: string[];
  appNames?: string[];
}) {
  return http.get<DataListResult<Application>>({
    url: `/api/assetDetail/getAssetAppInfo`,
    params,
  });
}

/**
 * 获取应用信息聚合查询条件
 */
function getAssetAppAggregation(params: {
  deviceIp: string;
  deviceMac: string;
}) {
  return http.get<{
    pid: number[];
    port: number[];
    protocol: string[];
  }>({
    url: `/api/assetDetail/getAssetAppAggregation`,
    params,
  });
}

/**
 * 获取资产其他信息（操作系统）
 */
function getAssetDetailInfo(params: { deviceIp: string; deviceMac: string }) {
  return http.get<OS>({
    url: `/api/assetDetail/getAssetDetailInfo`,
    params,
  });
}

/**
 * 获取license资产列表
 */
async function getLicenseAsset(params: {
  assetTypeCode?: number;
  assetGroupId?: number;
  assetIp: string;
  assetMac: string;
}) {
  return await http.get<DataListResult<IAsset>>({
    url: "/api/sysLicense/getLicenseAsset",
    params,
  });
}

export {
  getAssetAppInfo,
  getAssetAppAggregation,
  getAssetDetailInfo,
  getLicenseAsset,
};
