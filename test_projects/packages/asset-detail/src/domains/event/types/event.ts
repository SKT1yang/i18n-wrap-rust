// 事件记录（数据库表里拿的）
interface IEventRecord {
  id: number;
  eventName: string;
  eventId: number;
  eventType: string;
  eventTypeId: number;
  eventTypeName: string;
  modelralLanguageDescription: string;
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
interface IEventDetail {
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
  level: 1 | 2 | 3 | 4;
  eventLevel: 1 | 2 | 3 | 4;
  dstPort: number;
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
  upTraffic: number;
  downTraffic: number;
  protocol: string;
}

interface RelationDto {
  createTime: [string, string]; // 时间区间
  dstIp: string; // 资产IP(可能是目的IP)
  eventType: string; // 工控事件（工控：1001；网络：1004；威胁：1002）
  glAssetsDst: string[]; // 不显示国利网安作为目的资产的会话信息
  glAssetsSrc: string[]; // 不显示国利网安作为源资产的会话信息
  reverse: string[]; // 翻转OR处理(link中使用)
  sort?: string;
  srcIp: string; // 资产IP(可能是源IP)
  srcIpEqu: string; // 100401:网络事件--只选取srcIp为该资产的事件，不需要OR处理
  type: number; // 事件类型
  status?: number[]; // 不显示关闭状态的记录2和超时4
  trust?: number;
  page: number;
  size: number;
}

export type { IEventRecord, IEventDetail, RelationDto };
