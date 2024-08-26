/*
 * @name: 资产组
 * @description: Do not edit
 */

import { IAssetGroupTreeItem } from '@guolisec/types';
import { http } from '@guolisec/request';

/**
 * 获取资产组树
 * @param params
 */
function getAssetGroupTreeApi(params?) {
  return http.get<IAssetGroupTreeItem[]>({
    url: `/api/asset/assetGroupTree`,
    params,
  });
}

/**
 * 获取资产组树, 数据中不包含资产
 * @param params
 */
function getAssetGroupTreeNoAssetApi(params?) {
  return http.get<IAssetGroupTreeItem[]>({
    url: `/api/asset/assetGroupTreeNoAsset`,
    params,
  });
}

/**
 * 新增/修改资产组
 * @param params
 */
function updateAssetGroupApi(data) {
  return http.post<any>({ url: `/api/asset/group`, data });
}

/**
 * 删除资产组
 * @param data { id: number }
 */
function deleteAssetGroupApi(data) {
  return http.post<any>({ url: `/api/asset/deleteGroup`, data });
}

/**
 * 批量分组（将多个资产一次分配到某组中）
 * @param data
 */
function setAssetGroupIdApi(data) {
  return http.post<any>({ url: `/api/asset/setAssetGroupId`, data });
}

/**
 * 获取资产组事件
 * @param params
 */
function getEventByGroupIdsApi(params) {
  return http.get<any>({
    url: `/api/gnsa/groups/untreatedEvent/count`,
    params,
  });
}

export {
  getAssetGroupTreeApi,
  updateAssetGroupApi,
  deleteAssetGroupApi,
  setAssetGroupIdApi,
  getEventByGroupIdsApi,
  getAssetGroupTreeNoAssetApi,
};
