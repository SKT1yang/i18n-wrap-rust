/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { http, RequestCanceler } from "@guolisec/request";

/**
 * 重新扫描资产
 * @param params
 * @returns
 */
function retryScanAssetApi(address: string) {
  return http.get(
    {
      url: `/api/assetScanQueue/debugMode`,
      params: { address },
      responseType: "blob",
      timeout: 3 * 60 * 1000,
    },
  );
}

/**
 * 扫描资产后，重新下载抓包文件
 */
function reDownloadDebugFile(address: string) {
  return http.get({
    url: `/api/assetScanQueue/reDownloadDebugFile`,
    params: { address },
    responseType: "blob",
    timeout: 3 * 60 * 1000,
  });
}

function cancelRetryScanAsset() {
  const axiosCanceler = new RequestCanceler();
  axiosCanceler.removePending({
    method: "get",
    url: "/api/assetScanQueue/debugMode",
  });
}

/**
 * 设为基线
 * @param params
 * @returns
 */
function setAssetBaseLineApi(addressList: string[]) {
  return http.post({ url: `/api/assetBaseLine/set`, data: addressList });
}

export {
  retryScanAssetApi,
  cancelRetryScanAsset,
  setAssetBaseLineApi,
  reDownloadDebugFile,
};
