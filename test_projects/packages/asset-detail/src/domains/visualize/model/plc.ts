import { http } from "@guolisec/request";
import { ModulePlcVisualize } from "../types/plc";

/**
 * 查找plc模块信息
 * @param params
 */
function getPlcModuleApi(params) {
  return http.get<ModulePlcVisualize[]>({
    url: `/api/asset/assetInformation/getModuleVOList`,
    params,
  });
}

/**
 * @description: 保存PLC模块
 */
function savePlcModuleApi(data) {
  return http.post({ url: `/api/asset/assetInformation/saveModule`, data });
}


export {
  getPlcModuleApi,
  savePlcModuleApi,
};
