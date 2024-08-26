/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \asset\src\model\relation.ts
 */
import { http } from "@guolisec/request";
/**
 * 查找资产信息-资产关系
 * @param params
 */
interface RelationDto {
  createTime: [string, string]; // 时间区间
  isIcp: "0" | "1";
}

/**
 * 获取资产关系数据
 * @param params
 */
function getAssetRelationApi(params: Partial<RelationDto>) {
  return http.get<any>({ url: `/api/assetRelation`, params });
}

export { getAssetRelationApi };
