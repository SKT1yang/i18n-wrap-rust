/*
 * @name: Do not edit
 * @description: Do not edit
 */

import { http } from "@guolisec/request";

/**
 * 设备资源使用率
 * @param params
 * @description 当前（实时的）设备CPU使用情况（一个）+ 内存使用情况（多个）
 */
function getResourceUsageApi(params) {
  return http.get<any>({
    url: `/api/resourceUsage/queryLastExterResourceUsage`,
    params,
  });
}

export { getResourceUsageApi };
