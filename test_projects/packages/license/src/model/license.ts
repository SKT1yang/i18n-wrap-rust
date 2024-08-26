/*
 * @name: api 接口
 * @description: 授权管理
 * @date: 2023-10-20 15:37:47
 * @path: \front\license\src\model\license.ts
 */
/* 类型文件 */
import type { LicenseByMqtt, SystemSettings } from "../types/license";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */
/* 业务模块 */

/**
 * mqtt查询授权记录
 * @param param 查询条件
 * @returns
 */
async function getLicensesByMqtt(params: {
  current: 0 | 1; //  license类型：0-历史表；1-当前表
  licenseModule: 1 | 2 | 3; // 授权类型：1-功能授权；2-通用授权；3-知识库
}) {
  return http.get<LicenseByMqtt>({
    url: "/api/sysLicense/getLicensesByMqtt",
    params,
  });
}

/**
 * 生成机器码
 * @param param 查询条件
 * @returns
 */
async function getMachineCode() {
  return http.get({
    url: "/api/sysSetting/getMachineCode",
  });
}

/**
 * 获取系统配置
 * @param param 查询条件
 * @returns
 */
async function getSysSetting() {
  return http.get<SystemSettings>({
    url: "/api/sysSetting",
  });
}

export { getLicensesByMqtt, getMachineCode, getSysSetting };
