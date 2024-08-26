/*
 * @name: 类型文件
 * @description: Do not edit
 * @date: 2023-04-12 19:09:32
 * @path: \glsec\apps\rsmp\src\domain\system\type.ts
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
