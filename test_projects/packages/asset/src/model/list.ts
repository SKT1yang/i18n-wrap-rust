/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \feature-vue\platform\front\asset\src\model\list.ts
 */
import { http } from "@guolisec/request";
import type { IAssetTrademark, IAsset, DataListResult } from "@guolisec/types";

function getAssetListApi(params) {
  return http.get<DataListResult<IAsset>>({
    url: "/api/asset/assetLists",
    params,
  });
}

/**
 * 新增资产
 */
function createAssetApi(data) {
  return http.post<any>({ url: `/api/asset`, data });
}

/**
 * 修改资产
 */
function modifyAssetApi(data) {
  return http.post<any>({ url: `/api/asset/updateAssetColumn`, data });
}

/**
 * 导入资产清单表格
 * @param params
 */
function importAssetTableApi(data) {
  return http.uploadMultipartFile({
    url: "/api/asset/mergeImport",
    data,
    timeout: 1000 * 60 * 60,
  });
}

/**
 * 导入资产清单表格(鞍钢)
 * @param params
 */
function importAnGangExcelApi(data) {
  return http.uploadMultipartFile<string | string[]>({
    url: "/api/asset/importAnGangExcel",
    data,
    timeout: 1000 * 60 * 60,
  });
}

function getAssetTypeApi() {
  return http.get<
    {
      assetTypeCode: number;
      assetTypeName: string;
      id: number;
    }[]
  >({
    url: "/api/asset/showAssetType",
  });
}

/**
 * 获取资产品牌
 */
function getAssetBrandsApi() {
  return http.get<{
    content: IAssetTrademark[];
  }>({
    url: `api/assetBrand/getAssetBrands`,
  });
}

/**
 * 查询主机操作系统
 */
function getAssetOsListApi() {
  return http.get<string[]>({ url: `/api/asset/getAssetOsList` });
}

/**
 * 导出资产清单表格
 * @param params
 */
function exportAssetTableApi(params) {
  return http.get<any>({
    url: `/api/asset/download`,
    params,
    responseType: "blob",
  });
}

/**
 * 导出资产清单表格(鞍钢)
 * @param params
 */
function downloadAnGangExcelApi(params) {
  return http.get<any>({
    url: `/api/asset/downloadAnGangExcel`,
    params,
    responseType: "blob",
  });
}

/**
 * 下载资产清单模板
 */
function downloadAssetTemplateApi() {
  return http.get<any>({
    url: `/api/asset/downloadTemplate`,
    responseType: "blob",
  });
}

/**
 * 下载资产清单模板(鞍钢)
 */
function downloadAnGangExcelTempleApi() {
  return http.get<any>({
    url: `/api/asset/downloadAnGangExcelTemple`,
    responseType: "blob",
  });
}

/**
 * 获取资产详情
 * @param params
 */
function getAssetDetailApi(params: { id: number }) {
  return http.get<IAsset>({ url: `/api/asset/getAssetDetail`, params });
}

/**
 * 删除资产
 * @param assetList
 */
function deleteAssetApi(ids: number[]) {
  return http.post<any>({
    url: `/api/asset/deleteAsset`,
    data: ids,
    timeout: 30 * 1000,
  });
}

/**
 * 批量新增资产
 */
function createAssetBatchApi(data) {
  return http.post<any>({ url: `/api/assetScanAudit/batch`, data });
}

/**
 * 查找资产列表或资产组列表是否存在于监测任务
 * @param params
 */
function checkAssetScanTaskApi(params: {
  assetGroupIds?: number[];
  assetIds?: number[];
}) {
  return http.get<{ baseLine: string[]; scan: string[] }>({
    url: `/api/assetScanTask/checkAssetScanTask`,
    params,
  });
}

export {
  importAssetTableApi,
  getAssetListApi,
  getAssetTypeApi,
  getAssetBrandsApi,
  getAssetOsListApi,
  createAssetApi,
  modifyAssetApi,
  exportAssetTableApi,
  downloadAssetTemplateApi,
  getAssetDetailApi,
  deleteAssetApi,
  createAssetBatchApi,
  importAnGangExcelApi,
  downloadAnGangExcelApi,
  downloadAnGangExcelTempleApi,
  checkAssetScanTaskApi,
};
