/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-13 11:13:10
 * @path: \routerable\src\interface.ts
 */
import type {
  RouteLocationRaw,
  LocationQueryRaw,
  RouteRecordName,
} from "vue-router";

/**
 * @internal
 */
export type LocationNameAndQuery = {
  name?: RouteRecordName;
  query?: LocationQueryRaw;
};

export type RouteLocationRawEx = RouteLocationRaw & LocationNameAndQuery;

export interface GoConfig {
  // 是否跳转，不保留跳转历史
  isReplace: boolean;
  // 路由不匹配时是否提示
  isMsg: boolean;
  // 路由不匹配时是否依然跳转页面
  isGoPage: boolean;
}
