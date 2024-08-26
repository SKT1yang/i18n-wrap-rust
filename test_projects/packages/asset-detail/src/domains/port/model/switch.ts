/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { http } from "@guolisec/request";
import {SwitchInfo} from '../types/port'

/**
 * 获取设备资源使用情况（主机的cpu、内存、磁盘使用情况等等）
 * @param params 
 * @returns 
 */
function getSwitchInfoApi(params: {assetIp: string; assetMac: string}) {
  return http.get<SwitchInfo>({ url: `/api/asset/getSwitchInfo`, params });
}

export {
  getSwitchInfoApi
}