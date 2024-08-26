/*
 * @name: api 接口
 * @description: 授权管理
 * @date: 2023-10-20 15:37:37
 * @path: \front\license\src\service\license.ts
 */

/* 类型文件 */
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 导入授权书
 * @param data
 */
async function importLicense(data) {
  return http.put({
    url: "/api/sysLicense/importLicense",
    data,
    headers: { "Content-Type": "multipart/form-data;charset=UTF-8" },
  });
}

export * from "../model/license";
export { importLicense };
