/*
 * @name: 资产关系的依赖注入key
 * @description: Do not edit
 * @path: \asset\src\views\relation\sysmbols.ts
 */

import { InjectionKey } from "vue";
import { RelationInfo } from "./types";

export const relationInfoKey: InjectionKey<RelationInfo> =
  Symbol("RelationInfo");
