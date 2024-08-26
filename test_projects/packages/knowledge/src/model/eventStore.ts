/*
 * @name: 事件库 - api 接口
 * @description: Do not edit
 * @date: 2023-09-20 18:26:21
 * @path: \front\knowledge\src\model\eventStore.ts
 */
/* 类型文件 */
import type { DataListResult } from "@guolisec/types";
import type { EventTypeTree, Event } from "../types/eventStore";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 获取事件类型树
 */
async function getEventTypeTree() {
  return http.get<EventTypeTree[]>({
    url: "/api/eventStore/getTree",
  });
}

/**
 * 获取事件库
 */
async function getEventStore(params: {
  page: number;
  size: number;
  name?: string;
  typeId?: number;
  eventGroup?: string;
}) {
  return http.get<DataListResult<Event>>({
    url: "/api/eventStore",
    params,
  });
}

export { getEventTypeTree, getEventStore };
