/*
 * @name: ts 类型
 * @description: 授权管理
 * @date: 2023-10-20 15:46:16
 * @path: \front\license\src\types\license.ts
 */
interface LicenseRecord {
  counts: number;
  expireTime: string;
  importTime: string;
  licenseContent: number;
}

type LicenseModule = 1 | 2 | 3;
type LicenseName = "功能授权" | "通用授权" | "知识库授权";

interface LicenseByMqtt {
  current: 0 | 1;
  data: LicenseRecord[];
  expire: number;
  licenseModule: LicenseModule;
}

interface SystemSettings {
  createTime: string;
  factoryName: string;
  machineCode?: string;
  name: string;
  sn: string;
  updateTime: string;
}

export type {
  LicenseRecord,
  LicenseModule,
  LicenseName,
  LicenseByMqtt,
  SystemSettings,
};
