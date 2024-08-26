/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-26 10:29:22
 * @path: \system\src\types\upgrade.ts
 */

export interface Knowledge {
  createBy: string;
  createTime: string;
  id: number;
  name: string;
  remoteUpgrade: boolean;
  selfUpgrade: boolean;
  type: string;
  typeName: string;
}

export interface KnowledgeContent {
  content: Knowledge[];
  totalElements: number;
}

export interface KnowledgeRecordModel {
  size: number;
  page: number;
  type: string;
  sn: string;
}

export interface LogModel {
  page: number;
  size: number;
  sort: string;
  browserNotNull?: string;
  browserNull?: string;
  createTime?: string;
  description: string;
  logType?: string;
  username: string;
}

export interface PlatformConfig {
  ip?: string;
  port?: number;
  publicIp?: string;
  publicPort?: number;
  remoteIp?: string;
  remotePort?: number;
  sceneName?: number;
  serviceName?: string;
  subTargetType?: string;
}
