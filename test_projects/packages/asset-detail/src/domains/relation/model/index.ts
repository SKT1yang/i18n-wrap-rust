import { http } from "@guolisec/request";
import type { RelationDto } from "@/domains/event/types/event";
/**
 * 查找资产信息-资产关系
 * @param params
 */
function getAssetRelationApi(params: Partial<RelationDto>) {
  return http.get<any>({ url: `/api/assetInformation/relationAssetVOList`, params });
}

export {
  getAssetRelationApi
}