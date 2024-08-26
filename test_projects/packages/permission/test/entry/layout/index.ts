/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-09 16:12:00
 * @path: \permission\test\entry\layout\index.ts
 */
import { type Component } from "vue";
import Layout from "./Layout.vue";

function getLayoutMap() {
  const LayoutMap = new Map<string, Component>();
  LayoutMap.set("CustomSonoma", Layout);
  return LayoutMap;
}

export { getLayoutMap };
