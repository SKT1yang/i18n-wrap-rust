/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \asset-new\src\model\status.ts
 */
import { http } from '@guolisec/request';

export type StatusBackType = {
  assetGroupId: number;
  label: string;
  assetStatusList: AssetStatusList[];
};

export interface AssetStatusList {
  status: number;
  count: number;
}

async function countByAssetGroupStatusAPI() {
  return http.get<StatusBackType[]>({
    url: '/api/asset/countByAssetGroupStatus',
  });
}
async function countAssetByStatusAPI() {
  return http.get<any[]>({
    url: '/api/asset/countAssetByStatus',
  });
}

export { countByAssetGroupStatusAPI, countAssetByStatusAPI };
