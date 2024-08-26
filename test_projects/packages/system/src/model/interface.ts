/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-20 14:16:57
 * @path: \system\src\model\interface.ts
 */
/* 类型文件 */
import { NetworkInterface } from "../types/interface";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 接口管理
 * @returns
 */
async function getNetworkcardInfoApi() {
  return await http.get<NetworkInterface[]>({
    url: "/api/networkcard",
  });
}

async function modifyInterfaceApi(data: {
  networkCardName: string;
  ip: string;
  subnetMask: string;
  gateway: string;
}) {
  return http.put({
    url: "/api/networkcard/manipulate",
    data,
  });
}

export { getNetworkcardInfoApi, modifyInterfaceApi };
