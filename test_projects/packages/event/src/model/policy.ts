import { IEvent } from "../views/policy/Safety/components/SelectEventModal/types/event";
import { http } from "@guolisec/request";
import { ColumnType, DefaultRecordType } from "ant-design-vue/lib/vc-table/interface";
function getEventStoreTreeApi() {
	return http.get<any>({ url: "/api/eventStore/getTree" });
}
interface GetEventStoreDto {
	name?: string;
	typeId?: number;
	page: number;
	size: number;
}
function getEventStoreApi(params: GetEventStoreDto) {
	return http.get<any>({
		url: "/api/eventStore",
		params
	});
}
function modifyEventComposeSettingApi(data: IAssociateEventStore) {
	return http.post<any>({
		url: "/api/eventComposeSetting/modify",
		data
	});
}
function createEventComposeSettingApi(data: IAssociateEventStore) {
	return http.post<any>({
		url: "/api/eventComposeSetting/add",
		data
	});
}
type EventStoreName = "eventStoreA" | "eventStoreB" | "eventStoreC";
interface IAssociateEventStore {
	id: number;
	eventStoreA: IEvent;
	eventStoreB: IEvent;
	eventStoreC: IEvent;
}
interface CustomRenderOpt {
	value: any;
	text: any;
	record: IAssociateEventStore;
	index: number;
	renderIndex: number;
	column: ColumnType<DefaultRecordType>;
}
interface GetEventComposeSettingDto {
	name: string;
	sort: string;
	page: number;
	size: number;
}
function getEventComposeSettingListApi(params: GetEventComposeSettingDto) {
	return http.get<any>({
		url: "/api/eventComposeSetting/get",
		params
	});
}
function deleteEventComposeSettingApi(data: IAssociateEventStore) {
	return http.delete<any>({
		url: "/api/eventComposeSetting/delete",
		data
	});
}
export { getEventStoreTreeApi, getEventStoreApi, modifyEventComposeSettingApi, createEventComposeSettingApi, getEventComposeSettingListApi, deleteEventComposeSettingApi };
export type { EventStoreName, IAssociateEventStore, CustomRenderOpt };
