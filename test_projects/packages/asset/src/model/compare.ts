import { http } from '@guolisec/request';
import type { DataListResult, IAsset } from '@guolisec/types';

/**
 * 执行资产对比
 */
function compareAssetApi(data) {
  return http.uploadMultipartFile({
    url: `/api/check/mergeImportCompare`,
    data,
  });
}

/**
 * 下载原始用户上传的对比文件
 */
function downloadApi(params) {
  return http.get({
    url: `/api/fileRecord/download`,
    responseType: 'blob',
    headers: { 'Content-Type': 'application/json; application/octet-stream' },
    params,
    timeout: 60 * 1000,
  });
}

/**
 * 获取资产对比记录清单
 */
function getAssetCompareRecordListApi(params) {
  return http.get<DataListResult<AssetCompareRecord>>({
    url: `/api/fileRecord/outputRecord`,
    params,
  });
}

/**
 * 删除资产对比记录
 */
function deleteAssetCompareRecordApi(data) {
  return http.post({
    url: `/api/fileRecord/deleteRecord`,
    data,
  });
}

/**
 * 资产对比模板下载
 */
function downloadAssetCompareTemplateApi() {
  return http.get({
    url: `/api/check/downloadCompareTemplate`,
    responseType: 'blob',
  });
}

/**
 * 下载资产核查结果-资产核查对比
 */
function checkCompareApi(params) {
  return http.get<{
    commonList: AssetCompareDetail[];
    unCommonList: IAsset[];
  }>({
    url: `/api/check/compare`,
    params,
  });
}

/**
 * 下载对比详情xlsx文件
 */
function downloadCompareXlsxApi(params) {
  return http.get({
    url: `/api/check/downloadCompareXlsx`,
    responseType: 'blob',
    params,
    timeout: 60 * 1000,
  });
}

interface AssetCompareRecord {
  id: number;
  fileName: string;
  filePath: string;
  createTime: string;
  type: number;
  status: number;
  size: number;
  sizeStr: string;
}

interface AssetCompareDetail {
  numId: number;
  assetIp: string;
  assetMac: string;
  name: string;
  assetSeriesName: string;
  assetTypeName: string;
  asset: IAsset;
}

export {
  compareAssetApi,
  getAssetCompareRecordListApi,
  deleteAssetCompareRecordApi,
  downloadAssetCompareTemplateApi,
  downloadApi,
  checkCompareApi,
  downloadCompareXlsxApi,
  type AssetCompareRecord,
  type AssetCompareDetail,
};
