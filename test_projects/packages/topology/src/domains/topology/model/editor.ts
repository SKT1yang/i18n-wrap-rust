/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-12-18 11:40:29
 * @path: \feature-vue\platform\front\topology\src\domains\topology\model\editor.ts
 */
/* 类型文件 */
import type { DataListResult, IAsset, EventRecord } from '@guolisec/types';
import type { TopologyInfo } from '../types';
import type { AssetConnectionItem } from '../types/editor';
/* 第三方模块 */

import { http } from '@guolisec/request';
/* 本地共享模块 */

/* 业务模块 */

/**
 * 查询归档任务
 * @returns elementTypeList：列表形式
 */
async function showUnTreatEvent(params) {
  return await http.get<DataListResult<EventRecord>>({
    url: '/api/untreatedEvent/showUnTreatEvent',
    params,
  });
}

async function getAllAssetApi(params) {
  return http.get<IAsset[]>({
    url: '/api/asset/queryAll',
    params,
  });
}

/**
 * 根据id查询拓扑信息
 * @param params
 */
async function getTopoInformationByIdsApi(params) {
  return http.get<TopologyInfo[]>({
    url: `/api/asset/topology/getHit/topoInformation/topoIds`,
    params,
  });
}

/**
 * 批量修改资产字段
 * @param data
 */
function updateAssetColumnBatchApi(data) {
  return http.post({ url: `/api/asset/import`, data });
}

/**
 * 获取拓扑最新拓扑关系，自动生成拓扑
 * @param params
 */
async function getAssetConnectionApi(params) {
  return http.get<AssetConnectionItem[]>({
    url: `/api/asset/topology/getAssetConnection`,
    params,
  });
}

export {
  showUnTreatEvent,
  getAllAssetApi,
  getTopoInformationByIdsApi,
  updateAssetColumnBatchApi,
  getAssetConnectionApi,
};
