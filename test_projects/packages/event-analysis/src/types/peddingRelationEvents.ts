import type { VNode, CSSProperties } from 'vue';
// 事件记录（数据库表里拿的）
export interface IEventRecord {
  id: number;
  eventName: string;
  eventId: number;
  eventType: string;
  eventTypeId: number;
  eventTypeName: string;
  description: string;
  naturalLanguageDescription: string;
  eventSuggestion: string;
  suggestion: string;
  eventLevel: string;
  createTime: string;
  treatTime: string;
  score: number;
  srcIp: string;
  srcAssetName: string;
  dstIp: string;
  dstAssetName: string;
  applayerProtocolName: string;
  appProtocol: string;
  srcAssetMac: string;
  treat: boolean;
  sign: string;
  level: number;
  count: number;
  srcPort: number;
  dstPort: number;
  compose: boolean;
  logSourceTypeName: string;
  logSourceName: string;
}

declare type Recordable<T = any> = Record<string, T>;

export interface DescItem {
  labelMinWidth?: number;
  contentMinWidth?: number;
  labelStyle?: CSSProperties;
  field: string;
  label: string | VNode | JSX.Element;
  // Merge column
  span?: number;
  show?: (...arg: any) => boolean;
  // render
  render?: (
    val: any,
    data: Recordable
  ) => VNode | undefined | JSX.Element | Element | string | number;
}
