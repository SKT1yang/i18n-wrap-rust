import { http } from "@guolisec/request";
import type { FileTamperingRecord } from "../types/fileTamper";
import type { DataListResult } from "@guolisec/types";

/**
 * 获取已安装的探针列表
 */
function getInstallListApi(params: { ip: string; mac: string }) {
  return http.get({ url: `/api/probe/getInstallList`, params });
}

/**
 * 获取文件篡改记录
 */
function getFileTamperingRecordApi(params: {
  action?: string;
  deviceIp: string;
  deviceMac: string;
  createTime?: string[];
  path?: string;
  page: number;
  size: number;
  sort: string;
}) {
  return http.get<DataListResult<FileTamperingRecord>>({
    url: `/api/probe/getFileTamperingRecord`,
    params,
  });
}

export { getInstallListApi, getFileTamperingRecordApi };
