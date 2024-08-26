/*
 * @name: ts 类型
 * @description: 知识库升级
 * @date: 2023-09-19 10:01:52
 * @path: \knowledge-upgrade\\types\upgrade.ts
 */
export type KnowledgeType = "devices" | "events" | "protos" | "rules";

export interface KnowledgeBase {
  id: number;
  createTime: string;
  name: string;
  type: KnowledgeType;
  typeName: string;
  lastName?: string;
  lastTime?: string;
}

export interface KnowledgeRecord {
  createTime: string;
  id: number;
  name: string;
  sn: string;
  type: KnowledgeType;
}
