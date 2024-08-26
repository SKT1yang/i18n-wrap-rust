/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-03 10:26:21
 * @path: \types\src\router.ts
 */
import type { Component, DefineComponent } from "vue";
import type { Lazy } from "./utils.ts";

type RouteComponent = Component | DefineComponent;
type RawRouteComponent = RouteComponent | Lazy<RouteComponent>;

export { type RawRouteComponent };
