/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-26 10:31:29
 * @path: \system\src\types\knowledge.ts
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
