/*
 * @name: 拓扑图清单接口
 * @description: Do not edit
 */
/* 类型文件 */
import type { DataListResult } from '@guolisec/types';
import type { TopologyInfo } from '../types';

/* 第三方模块 */

import { http } from '@guolisec/request';
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
  });
}

export { getTopoInformationListApi };
