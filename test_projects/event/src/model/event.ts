import { http } from "@guolisec/request";
interface EventTypeItem {
	id: number;
	name: string;
	level: number;
	eventTypes: EventTypeItem;
}
const getTreeEventTypeOptsApi = () => {
	return http.get<EventTypeItem[]>({ url: "/api/eventStore/getTree" });
};
const getSearchAggTermApi = () => {
	return http.get({ url: "/api/log/es/searchAggTerm" });
};
const getEventListApi = (obj?) => {
	return http.get({
		url: "/api/log/es",
		params: obj
	});
};
function getCountUntreatedEventByEventNameReportApi(obj) {
	return http.get<any>({
		url: "/api/untreatedEvent/situation/countUntreatedEventByEventNameReport",
		params: obj
	});
}
function getEventTypeLevelApi(pid?: number) {
	return http.get<any>({ url: "/api/eventStore/getLevel" + `/${pid}` });
}
function getCountUntreatedEventByEventLevelReportApi(obj) {
	return http.get<any>({
		url: "/api/untreatedEvent/situation/countUntreatedEventByEventLevelReport",
		params: obj
	});
}
export { getTreeEventTypeOptsApi, getSearchAggTermApi, getEventListApi, getEventTypeLevelApi, getCountUntreatedEventByEventNameReportApi, getCountUntreatedEventByEventLevelReportApi };
