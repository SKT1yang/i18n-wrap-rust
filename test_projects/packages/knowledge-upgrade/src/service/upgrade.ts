/*
 * @name: 接口
 * @description: 知识库升级
 * @date: 2023-09-19 14:30:27
 * @path: \knowledge-upgrade\\service\upgrade.ts
 */
/* 类型文件 */
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */
export * from "../model/upgrade";

/**
 *
 */
async function assetStoreUpgrade(data, noLicense = false) {
  // const url = noLicense
  //   ? "/api/eventStore/knowledgeUpgrade/noLicense"
  //   : "/api/eventStore/knowledgeUpgrade";
  const url = "/api/eventStore/knowledgeUpgrade/noLicense";
  const headers = noLicense
    ? {}
    : {
        "Content-type": "multipart/form-data;charset=UTF-8",
        // @ts-ignore
        ignoreCancelToken: true,
      };
  return http.post<string>({
    url,
    data,
    timeout: 5 * 60 * 1000,
    headers,
  });
}

export { assetStoreUpgrade };
