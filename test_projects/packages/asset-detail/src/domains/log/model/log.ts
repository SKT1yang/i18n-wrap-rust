import { http } from "@guolisec/request";
import type {
  PLCErrorLog,
  PLCErrorQuery,
} from "../types/log";
import type { DataListResult } from "@guolisec/types";
/**
 * plc的资产监测项-plc错误日志
 * @param params
 * @returns
 */
function getPlcLogInfoApi(params) {
  return http.get<{
    log: {
      key: string;
      value: string;
    }[];
  }>({ url: `/api/assetInformation/logInfo`, params });
}

/**
 * @description: 故障模块
 */
function getAssetErrorModules(params: {
  deviceIp?: string;
  deviceMac?: string;
}) {
  return http.get<string[]>({
    url: `/api/assetErrorLog/getAssetErrorModules`,
    params,
  });
}

/**
 * @description: 故障日志
 */
function getAssetErrorLog(params: PLCErrorQuery) {
  return http.get<DataListResult<PLCErrorLog>>({
    url: `/api/assetErrorLog/getAssetErrorLog`,
    params,
  });
}

/**
 * @description: 获取交换机错误日志
 */
function getDeviceLogApi(params: {
  switchIp: string;
  sort: string;
  size: number;
  page: number;
  logTime?: string[],
  logLevel?: number;
  logDescript?: string
}) {
  return http.get<DataListResult<PLCErrorLog>>({
    url: `/api/assetErrorLog/getDeviceLog`,
    params,
  });
}

export {
  getPlcLogInfoApi,
  getAssetErrorModules,
  getAssetErrorLog,
  getDeviceLogApi
};
