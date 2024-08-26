import { http } from "@guolisec/request";
import type {
  PlcDeviceDetail,
} from "../types/plc";

/**
 * @description: 获取大庆PLC其他信息
 */
function getPlcDeviceDetailApi(params: { deviceIp: string; deviceMac: string }) {
  return http.get<{ assetDetailOtherVO: PlcDeviceDetail }>({
    url: `/api/assetDetail/getAssetDetailOther`,
    params,
  });
}


export {
  getPlcDeviceDetailApi,
};
