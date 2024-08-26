/*
 * @name: 拓扑图清单接口
 * @description: Do not edit
 */
/* 类型文件 */
import type { DataListResult, IAssetGroupTreeItem } from '@guolisec/types'
import type { TopologyInfo } from '../types'

/* 第三方模块 */

import { http } from '@guolisec/request'
/* 本地共享模块 */

/* 业务模块 */

/**
 * 获取拓扑图清单列表
 * @returns elementTypeList：列表形式
 */
async function getTopoInformationListApi(params) {
  return await http.get<DataListResult<TopologyInfo>>({
    url: '/api/asset/topology/getAll/topoInformation',
    params,
  })
}

/**
 * 创建拓扑信息
 * @param data
 */
async function createTopoInformationApi(data) {
  if (data && Array.isArray(data.assetGroupIds)) {
    data.assetGroupIds = data.assetGroupIds.map((i) => Number(i))
  }
  return http.post({ url: `/api/asset/topology/save/information`, data })
}

/**
 * 修改拓扑信息
 * @param data
 */
async function modifyTopoInformationApi(data) {
  if (data && Array.isArray(data.assetGroupIds)) {
    data.assetGroupIds = data.assetGroupIds.map((i) => Number(i))
  }
  return http.post({ url: `/api/asset/topology/update/information`, data })
}

/**
 * 批量删除拓扑信息
 * @param params
 */
async function deleteTopoInformationApi(params) {
  return http.delete({
    url: `/api/asset/topology/deleteBatch/information`,
    params,
  })
}

/**
 * 修改拓扑信息
 * @param data
 */
async function setMainTopoApi(data) {
  return http.post({ url: `/api/asset/topology/mainTopo`, data })
}

/**
 * 获取资产组树
 * @param params
 */
function getAssetGroupTreeApi(params?) {
  return http.get<IAssetGroupTreeItem[]>({
    url: `/api/asset/assetGroupTree`,
    params,
  })
}

export {
  getTopoInformationListApi,
  createTopoInformationApi,
  modifyTopoInformationApi,
  deleteTopoInformationApi,
  getAssetGroupTreeApi,
  setMainTopoApi,
}
