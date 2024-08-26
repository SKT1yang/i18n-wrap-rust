/*
 * @name: 事件库 - api 接口
 * @description: Do not edit
 * @date: 2023-09-20 18:31:31
 * @path: \front\knowledge\src\service\eventStore.ts
 */
/* 类型文件 */
import type { Event } from '../types/eventStore';
/* 第三方模块 */
import { http } from '@guolisec/request';
/* 本地共享模块 */

/* 业务模块 */

/**
 * 修改事件
 */
async function editEventStore(data: Event) {
  return http.put({
    url: '/api/eventStore',
    data,
  });
}

/**
 * 删除事件
 */
async function deleteEventStore(data: number[]) {
  return http.delete({
    url: '/api/eventStore',
    data,
  });
}

/**
 * 新增事件
 */
async function addEventStore(data: {
  description?: string;
  eventType: {
    id: number;
  };
  level: number;
  name: string;
  tag: string;
  score: number;
  eventDescription?: string;
}) {
  return http.post({
    url: '/api/eventStore',
    data,
  });
}

export * from '../model/eventStore';
export { editEventStore, deleteEventStore, addEventStore };
