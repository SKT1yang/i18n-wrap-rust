/*
 * @name: Do not edit
 * @description: Do not edit
 */

import { http } from "@guolisec/request";
import type { MemoryRate, CPURate } from "../types/history";

/**
 * 查询设备 CPU 历史使用率
 * @param params
 */
function queryResourceUsageApi(params) {
  return http.get<CPURate[]>({
    url: `/api/resourceUsage/queryPlcCpuRateByTime`,
    params,
  });
}

/**
 * 查询设备 内存 历史使用率
 * @param params
 */
function queryPlcMemRateByTime(params) {
  return http.get<MemoryRate[]>({
    url: `/api/resourceUsage/queryPlcMemRateByTime`,
    params,
  });
}

export { queryResourceUsageApi, queryPlcMemRateByTime };
