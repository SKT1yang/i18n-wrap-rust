/*
 * @Name: 事件的类型文件
 * @Description: 业务类型文件
 * @Author: ygd
 * @Date: 2022-04-12 18:04:31
 * @LastEditTime: 2022-07-04 16:12:13
 * @LastEditors: lkq
 */
import { ColumnType, DefaultRecordType } from 'ant-design-vue/lib/vc-table/interface';

// 事件
export interface IEvent {
  abnormal: boolean;
  alarm: boolean;
  description: string;
  eventType: IEventType;
  id: number;
  killchainId: number;
  level: number;
  name: string;
  score: number;
  threshold: number;
  unit: number;
}

// 事件类型
export interface IEventType {
  eventType: IEventType | null;
  id: number;
  level: number;
  name: string;
}

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

// 事件详情（es里拿的）
export interface IEventDetail {
  id: string;
  srcName: string;
  killchainId: number;
  statusType: number;
  dstName: string;
  counts: number;
  appProtocol: string;
  contentId: number;
  rawPacket: string;
  srcPort: number;
  deviceName: string;
  applayerProtocolId: number;
  eventHash: number;
  score: number;
  dstPort: number;
  eventLevel: number;
  eventName: string;
  eventCharacter: string;
  sn: string;
  logSourceTypeName: string;
  flowId: number;
  eventId: number;
  srcIp: string;
  dstMac: string;
  suggestion: string;
  eventType: string;
  modules: string;
  firstTime: number;
  isIcp: number;
  canTrust: number;
  '@timestamp': string;
  translayerProtocolId: number;
  createTime: number;
  networkInterface: string;
  eventObject: string;
  signMd5: string;
  srcMac: string;
  dstIp: string;
  time: number;
  logSourceName: string;
  logSourceIp: string;
  logSourceTypeCode: number;
  logSourceType: string;
  eventSubject: string;
  status: number;
}

// 关联事件库名
export type EventStoreName = 'eventStoreA' | 'eventStoreB' | 'eventStoreC';

// 关联事件
export interface IAssociateEventStore {
  id: number;
  eventStoreA: IEvent;
  eventStoreB: IEvent;
  eventStoreC: IEvent;
}

export interface CustomRenderOpt {
  value: any;
  text: any;
  record: IAssociateEventStore;
  index: number;
  renderIndex: number;
  column: ColumnType<DefaultRecordType>;
}
