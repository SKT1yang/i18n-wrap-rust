import { IEvent } from "../views/policy/Safety/components/SelectEventModal/types/event";
import { http } from "@guolisec/request";
import {
  ColumnType,
  DefaultRecordType,
} from "ant-design-vue/lib/vc-table/interface";

/**
 * 获取事件树
 * @param params
 */
function getEventStoreTreeApi() {
  return http.get<any>({ url: "/api/eventStore/getTree" });
}

/**
 * 查看事件库
 * @param params
 */
interface GetEventStoreDto {
  name?: string;
  typeId?: number;
  page: number;
  size: number;
}
function getEventStoreApi(params: GetEventStoreDto) {
  return http.get<any>({ url: "/api/eventStore", params });
}

/**
 * 修改关联事件
 * @param data
 */
function modifyEventComposeSettingApi(data: IAssociateEventStore) {
  return http.post<any>({ url: "/api/eventComposeSetting/modify", data });
}

/**
 * 新增关联事件
 * @param data
 */
function createEventComposeSettingApi(data: IAssociateEventStore) {
  return http.post<any>({ url: "/api/eventComposeSetting/add", data });
}

// 关联事件库名
type EventStoreName = "eventStoreA" | "eventStoreB" | "eventStoreC";

// 关联事件
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

/**
 * 获取关联事件列表
 * @param params
 */
interface GetEventComposeSettingDto {
  name: string;
  sort: string;
  page: number;
  size: number;
}

function getEventComposeSettingListApi(params: GetEventComposeSettingDto) {
  return http.get<any>({ url: "/api/eventComposeSetting/get", params });
}

/**
 * 删除关联事件
 * @param data
 */
function deleteEventComposeSettingApi(data: IAssociateEventStore) {
  return http.delete<any>({ url: "/api/eventComposeSetting/delete", data });
}

export {
  getEventStoreTreeApi,
  getEventStoreApi,
  modifyEventComposeSettingApi,
  createEventComposeSettingApi,
  getEventComposeSettingListApi,
  deleteEventComposeSettingApi,
};

export type { EventStoreName, IAssociateEventStore, CustomRenderOpt };
