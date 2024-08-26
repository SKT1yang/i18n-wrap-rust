/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \asset\src\model\mergeAsset.ts
 */
import { http } from "@guolisec/request";
import type { INetworkAsset, INetwork } from "@guolisec/types";

interface NetworkDTO {
  mainUid: string;
  networkName: string;
}

interface OptionalNetworkAssetDTO {
  mainUid: string;
  networkId: number;
  uid: string;
}

/**
 * 新增网口
 * @param data
 */
function createNetworkApi(data: NetworkDTO) {
  return http.post<any>({ url: "/api/networkAsset", data });
}

/**
 * 删除网口
 * @param params
 */
function deleteNetworkApi(networkIds: number[]) {
  return http.delete<any>({ url: "/api/networkAsset", data: networkIds });
}

/**
 * 主资产添加网口资产
 * @param data
 */
function createNetworkAssetApi(data: OptionalNetworkAssetDTO) {
  return http.post<any>({ url: "/api/networkAsset/addAsset", data });
}

/**
 * 主资产批量添加网口资产
 * @param data
 */
function createNetworkAssetBatchApi(data: OptionalNetworkAssetDTO[]) {
  return http.post<any>({ url: "/api/networkAsset/addAssetBatch", data });
}

/**
 * 主资产删除网口资产
 * @param uid
 */
function deleteNetworkAssetApi(uid: string) {
  return http.post<any>({ url: "/api/networkAsset/deleteAsset", data: uid });
}

/**
 * 主资产批量删除网口资产
 * @param uids
 */
function deleteNetworkAssetBatchApi(uids: string[]) {
  return http.delete<any>({
    url: "/api/networkAsset/deleteAssetBatch",
    data: uids,
  });
}

/**
 * 获得网卡可添加资产的ip地址
 */
function getOptionalNetworkAssetListApi(params: {
  mainUid: string;
  assetTypeCode: number;
}) {
  return http.get<INetworkAsset[]>({
    url: "/api/asset/getNetworkAddAssetList",
    params,
  });
}

/**
 * 根据资产id获取所有网口资产
 * @param params
 */
function getNetworkListByAssetIdApi(params: { id: number }) {
  return http.get<INetwork[]>({
    url: `/api/asset/getNetworkAssetListByAssetId`,
    params,
    timeout: 5 * 60 * 1000,
  });
}

export {
  createNetworkApi,
  deleteNetworkApi,
  createNetworkAssetApi,
  createNetworkAssetBatchApi,
  deleteNetworkAssetApi,
  deleteNetworkAssetBatchApi,
  getOptionalNetworkAssetListApi,
  getNetworkListByAssetIdApi,
};
