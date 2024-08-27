import { IEvent, IEventType, IEventRecord } from "./event";
export class Event implements IEvent {
	abnormal = true;
	alarm = true;
	description = "";
	eventType = new EventType();
	id = 0;
	killchainId = 0;
	level = 1;
	name = "";
	score = 0;
	threshold = 2;
	unit = 0;
}
export class EventRecord implements IEventRecord {
	id = 0;
	eventName = "";
	eventId = 0;
	eventType = "";
	eventTypeId = 0;
	eventTypeName = "";
	description = "";
	naturalLanguageDescription = "";
	eventSuggestion = "";
	suggestion = "";
	eventLevel = "";
	createTime = "";
	score = 0;
	srcIp = "";
	srcAssetName = "";
	dstIp = "";
	dstAssetName = "";
	applayerProtocolName = "";
	appProtocol = "";
	srcAssetMac = "";
	treat = false;
	sign = "";
	level = 1;
	count = 1;
	srcPort = 0;
	dstPort = 0;
	compose = true;
	logSourceTypeName = "";
	logSourceName = "";
	treatTime = "";
}
export class EventType implements IEventType {
	eventType = null;
	id = 0;
	level = 1;
	name = "";
}
