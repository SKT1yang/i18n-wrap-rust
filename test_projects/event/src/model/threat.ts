import { http } from "@guolisec/request";
function getShowUntreatedEventListApi(params) {
	return http.get<any>({
		url: "/api/untreatedEvent/showUnTreatEvent",
		params
	});
}
const getEventNameApi = (obj) => {
	return http.get({
		url: "/api/realtimeMonitoring/getEventName",
		params: obj
	});
};
const getIcsEventNameApi = () => {
	return http.get({ url: "/api/realtimeMonitoring/getIcsEventName" });
};
const getIcsLogSourceTypeName = () => {
	return http.get({ url: "/api/realtimeMonitoring/getIcsLogSourceName" });
};
const getLogSourceNameApi = (obj) => {
	return http.get({
		url: "/api/realtimeMonitoring/getLogSourceName",
		params: obj
	});
};
const getLogSourceTypeNameApi = (obj) => {
	return http.get({
		url: "/api/realtimeMonitoring/getLogSourceTypeName",
		params: obj
	});
};
const getIcsTabApi = () => {
	return http.get<any>({ url: "/api/event/getIcsTab" });
};
export { getShowUntreatedEventListApi, getEventNameApi, getIcsEventNameApi, getIcsLogSourceTypeName, getLogSourceNameApi, getLogSourceTypeNameApi, getIcsTabApi };
