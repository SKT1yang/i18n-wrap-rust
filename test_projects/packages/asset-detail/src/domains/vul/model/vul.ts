/*
 * @Name: 资产漏洞
 * @Description: api
 */
import { http } from "@guolisec/request";

/**
 * 根据资产查询漏洞列表
 * @param params
 */
interface VulListDto {
  assetId: number;
  page: number;
  size: number
}
function getVulListApi(params: VulListDto) {
  return http.get<any>({ url: '/api/feature/getAssetVulPage', params });
}

export {
  getVulListApi,
}
