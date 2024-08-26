/*
 * @Name 事件工厂函数
 * @Description
 */
import { EventType, EventRecord, EventDetail } from '@guolisec/types';

class EventRecordFactory implements EventRecord {
  id = 0;
  eventName = '';
  eventId = 0;
  eventType = '';
  eventTypeId = 0;
  eventTypeName = '';
  description = '';
  naturalLanguageDescription = '';
  eventSuggestion = '';
  suggestion = '';
  eventLevel = '';
  createTime = '';
  score = 0;
  srcIp = '';
  srcAssetName = '';
  dstIp = '';
  dstAssetName = '';
  applayerProtocolName = '';
  appProtocol = '';
  srcAssetMac = '';
  treat = false;
  sign = '';
  level = 1;
  count = 1;
  srcPort = 0;
  dstPort = 0;
  compose = true;
  logSourceTypeName = '';
  logSourceName = '';
  treatTime = '';
}

class EventDetailFactory implements EventDetail {
  srcName = '';
  killchainId = 0;
  statusType = 0;
  dstName = '';
  counts = 0;
  appProtocol = '';
  contentId = 0;
  rawPacket = '';
  srcPort = 0;
  deviceName = '';
  applayerProtocolId = 0;
  eventHash = 0;
  score = 0;
  dstPort = 0;
  eventLevel = 0;
  eventName = '';
  eventCharacter = '';
  sn = '';
  logSourceTypeName = '';
  flowId = 0;
  eventId = 0;
  srcIp = '';
  dstMac = '';
  suggestion = '';
  eventType = '';
  modules = '';
  firstTime = 0;
  isIcp = 0;
  canTrust = 0;
  '@timestamp' = '';
  translayerProtocolId = 0;
  createTime = '';
  networkInterface = '';
  eventObject = '';
  signMd5 = '';
  srcMac = '';
  dstIp = '';
  time = 0;
  logSourceName = '';
  logSourceIp = '';
  logSourceTypeCode = 0;
  logSourceType = '';
  eventSubject = '';
  status = 0;
}

class EventTypeFactory implements EventType {
  eventType = null;
  id = 0;
  level = 1;
  name = '';
}

export {
  EventRecordFactory,
  EventDetailFactory,
  EventTypeFactory
}
