/*
 * @name: 设备级联
 * @description: 分设备端和管理端
 */

import { http } from '@guolisec/request';

/**
 * @description: 获取设备端标识
 * 包含标识相关信息，用于管理端标识设备端
 */
function getClientNameApi() {
  return http.get({ url: `/api/setting/clientName` });
}

/**
 * @description: 设备端的资产组同步
 * 设备端将资产组信息上送到管理端
 */
function assetGroupSyncApi(data) {
  return http.post({ url: `/api/setting/assetGroupSync`, data });
}

/**
 * @description: 管理端的资产组同步,全量设备同步
 * 管理端统一下发消息到设备端，要求同步资产组
 */
function getAssetGroupSynchronizationApi() {
  return http.get({ url: `/api/asset/getAssetGroupSynchronization` });
}

export { getClientNameApi, assetGroupSyncApi, getAssetGroupSynchronizationApi };
