import { http } from "@guolisec/request";
import type { IAsset } from "@guolisec/types";

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
 * 获取资产详情
 * @param params
 */
function getAssetDetailApi(params: { id: number }) {
  return http.get<IAsset>({ url: `/api/asset/getAssetDetail`, params });
}


export {
  deleteAssetApi,
  getAssetDetailApi
}