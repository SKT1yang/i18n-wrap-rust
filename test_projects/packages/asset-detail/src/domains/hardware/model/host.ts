import { http } from "@guolisec/request";
import type { Hardware, CPU, Disk, Network, Ram } from "../types/host";

/**
 * @description: 获取客户端时间
 */
function getSystemDate() {
  return http.get({ url: `/api/systemDate` });
}

/**
 * 获取硬件信息-主机/服务器
 */
function getAssetHardwareInfo(params: {
  deviceIp: string;
  deviceMac: string;
}) {
  return http.get<Hardware>({
    url: `/api/assetDetail/getAssetHardwareInfo`,
    params,
  });
}

/**
 * 获取资产运行状态
 */
function getAssetRunStatus(params: {
  deviceIp: string;
  deviceMac: string;
  createTime: string[];
}) {
  return http.get<{
    cpu: CPU[];
    ram: Ram[];
    network: Network[];
    disk: Disk[];
  }>({
    url: `/api/assetDetail/getAssetRunStatus`,
    params,
  });
}

export { getAssetHardwareInfo, getAssetRunStatus, getSystemDate };
