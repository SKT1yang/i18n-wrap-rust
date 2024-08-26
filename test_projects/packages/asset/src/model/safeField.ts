/*
 * @name: 安全域接口
 * @description: Do not edit
 * @path: \asset-new\src\model\safeField.ts
 */
import { http } from "@guolisec/request";

/**
 * 获取安全域列表
 * @param params
 */
function getSafeFieldApi(params) {
  return http.get({ url: `/api/safeField/safeFieldList`, params });
}

export { getSafeFieldApi };
