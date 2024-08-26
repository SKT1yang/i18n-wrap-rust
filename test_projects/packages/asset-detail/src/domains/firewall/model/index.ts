import { http } from "@guolisec/request";
import type {
  Firewall,
} from "../types";

/**
 * 获取资产防火墙信息
 */
function getAssetFirewallList(params) {
  return http.get<Firewall[]>({
    url: `/api/assetDetail/getAssetFirewallList`,
    params,
  });
}


export {
  getAssetFirewallList,
};
