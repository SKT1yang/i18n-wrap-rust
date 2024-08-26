import { http } from "@guolisec/request";
import type {
  USB
} from "../types/usb";
import type { DataListResult } from "@guolisec/types";

/**
 * 获取 USB 记录  - linux
 */
function getAssetDetailUsbRecord(params: {
  deviceIp: string;
  deviceMac: string;
  createTime: [string, string];
  page: number;
  size: number;
  sort: string;
  usbNames?: string[];
  actions?: string[];
}) {
  return http.get<DataListResult<USB>>({
    url: `/api/assetDetail/getAssetDetailUsbRecord`,
    params,
  });
}

/**
 * 获取 USB 历史 - windows
 */
function getAssetDetailUsbHistory(params: {
  deviceIp: string;
  deviceMac: string;
  page: number;
  size: number;
  usbNames?: string[];
  operations?: string[];
}) {
  return http.get<DataListResult<USB>>({
    url: `/api/assetDetail/getAssetDetailUsbHistory`,
    params,
  });
}

/**
 * 获取 USB 记录聚合查询条件 - windows
 */
function getAssetDetailUsbHistoryAggregation(params: {
  deviceIp: string;
  deviceMac: string;
}) {
  return http.get<{ operation: string[] }>({
    url: `/api/assetDetail/getAssetDetailUsbHistoryAggregation`,
    params,
  });
}

/**
 * 获取 USB 记录聚合查询条件 - linux
 */
function getAssetDetailUsbRecordAggregation(params: {
  deviceIp: string;
  deviceMac: string;
  createTime: string[];
}) {
  return http.get<{ action: string[]; usbName: string[] }>({
    url: `/api/assetDetail/getAssetDetailUsbRecordAggregation`,
    params,
  });
}

export {
  getAssetDetailUsbRecord,
  getAssetDetailUsbHistory,
  getAssetDetailUsbRecordAggregation,
  getAssetDetailUsbHistoryAggregation,
};
