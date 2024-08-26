/*
 * @name: 事件库 ts 类型
 * @description: Do not edit
 * @date: 2023-09-20 18:28:07
 * @path: \front\knowledge\src\types\eventStore.ts
 */
interface KnowledgeConfig {
  type: "normal" | "custom";
}

interface EventTypeTree {
  id: number;
  level: number;
  name: string;
  eventTypes?: EventTypeTree;
}

interface EventType {
  id: number;
  level: number;
  name: string;
  eventType?: EventType;
}

interface Event {
  id: number;
  abnormal: boolean;
  alarm: boolean;
  description: string;
  eventType: EventType;
  killchainId: number;
  level: number;
  name?: string;
  score: number;
  suggestion: string;
  tag: string;
  threshold: number;
  type: string;
  unit: string;
  eventGroup?: string;
}

export type { KnowledgeConfig, EventTypeTree, Event };
