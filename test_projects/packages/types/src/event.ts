/*
 * @Name: 事件的类型文件
 * @Description: 业务类型文件
 */

// 事件类型
interface EventType {
  eventType: EventType | null;
  id: number;
  level: number;
  name: string;
}

// 事件记录（数据库表里拿的）
interface EventRecord {
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
interface EventDetail {
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
  createTime: string;
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

export type {
  EventType,
  EventRecord,
  EventDetail
}