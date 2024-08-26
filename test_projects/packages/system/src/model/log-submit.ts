/*
 * @Name: Do not edit
 * @Description: Do not edit
 * @Author: lkq
 * @Date: 2022-03-15 14:55:07
 * @LastEditTime: 2024-03-13 09:57:18
 * @LastEditors: Please set LastEditors
 */
/* 类型文件 */
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */
/* 业务模块 */

/**
 * @description: 显示当前SYSLOG服务器
 */
function getSyslogApi() {
  return http.get({ url: `/api/syslog/show` });
}

/**
 * @description: 设置SYSLOG服务器
 */
function UpdateSyslogApi(data) {
  return http.put({ url: `/api/syslog/set`, data });
}

/**
 * @description: syslog使能状态
 */
function getShutdownStatusApi() {
  return http.get<boolean>({ url: `/api/syslog/shutdownStatus` });
}

/**
 * @description: syslog使能
 */
function setShutdownApi(params) {
  return http.get({ url: `/api/syslog/shutdown`, params });
}

/**
 * @description: 获取日志过滤条件
 */
function getFilterLogApi() {
  return http.get({ url: `/api/log/filter/get` });
}

/**
 * @description: 配置日志过滤条件
 */
function setFilterLogApi(data) {
  return http.post({ url: `/api/log/filter/set`, data });
}

/**
 * @description: 获取事件类型下拉选项
 */
interface EventTypeItem {
  id: number;
  name: string;
  level: number;
  eventTypes: EventTypeItem[];
}
function getTreeEventTypeOptsApi() {
  return http.get<EventTypeItem[]>({ url: `/api/eventStore/getTree` });
}

/**
 * 获取事件库类型树
 */
function getLogTreeApi() {
  return http.get<EventTypeItem[]>({ url: `/api/eventStore/getLogTree` });
}

export {
  getSyslogApi,
  UpdateSyslogApi,
  getShutdownStatusApi,
  setShutdownApi,
  setFilterLogApi,
  getFilterLogApi,
  getTreeEventTypeOptsApi,
  getLogTreeApi
};
