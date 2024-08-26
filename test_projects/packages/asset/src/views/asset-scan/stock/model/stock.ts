import { http } from "@guolisec/request";
import type { DataListResult } from "@guolisec/types";
import type { StockAsset } from "../types";

/**
 * 获取新资产接入信息(待入库资产)
 * @returns
 */
async function getWaitStockAssetApi(params) {
  return http.get<DataListResult<StockAsset>>({
    url: `/api/assetScanAudit/getNewAssetAccess`,
    params,
  });
}

/**
 * 应用资产扫描变更(入库资产)
 */
function stockAssetApi(ids: number[]) {
  return http.post({ url: `/api/assetScanAudit/apply`, data: ids });
}

/**
 * 资产扫描变更忽略一次(忽略一次入库资产)
 */
function denyWaitStockAssetApi(ids) {
  return http.post({ url: `/api/assetScanAudit/deny`, data: ids });
}

/**
 * 资产扫描变更永久忽略(永久忽略入库资产)
 */
function denyAssetPermanentApi(ids) {
  return http.post({ url: `/api/assetScanAudit/permanentDeny`, data: ids });
}

/**
 * 资产扫描忽略取消(取消永久忽略入库资产)
 */
function cancelDenyAssetPermanentApi(ids) {
  return http.post({ url: `/api/assetScanAudit/cancelDeny`, data: ids });
}

interface VerifyAsset {
  id: number;
  name: string;
  assetIp: string;
  assetMac: string;
  compareMap: CompareMap;
}

interface Key {
  key: string;
  value: string;
}

interface CompareMap {
  assetTypeName: Key;
  assetSeriesName: Key;
  tradeMarkName: Key;
  hardwareModel: Key;
  assetMac: Key;
}

/**
 * 获取资产核查信息(待核查资产)
 * @returns
 */
async function getAssetVerificationAssetApi(params) {
  return http.get<DataListResult<VerifyAsset>>({
    url: `/api/assetScanAudit/getAssetVerification`,
    params,
  });
}

/**
 * 获取忽略的IP，MAC(获取永久忽略的列表)
 * @returns
 */
async function getDenyedAssetListApi(params) {
  return http.get<DataListResult<StockAsset>>({
    url: `/api/assetScanAudit/getDeny`,
    params,
  });
}

/**
 * 获取正在执行的任务数量
 * @returns elementTypeList：列表形式
 */
async function countRunningTaskNumberApi() {
  return await http.get<number>({
    url: "/api/assetScanMessage/countRunningTaskNumber",
  });
}

export {
  type StockAsset,
  type VerifyAsset,
  getWaitStockAssetApi,
  stockAssetApi,
  denyWaitStockAssetApi,
  getAssetVerificationAssetApi,
  denyAssetPermanentApi,
  cancelDenyAssetPermanentApi,
  getDenyedAssetListApi,
  countRunningTaskNumberApi,
};
