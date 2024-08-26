/*
 * @name: 用户自定义布局注册中心
 * @description: Do not edit
 * @date: 2023-02-09 16:12:00
 * @path: \knowledge\src\entry\layout\index.ts
 */
/* 类型文件 */
import { type Component } from "vue";

function getLayoutMap() {
  const LayoutMap = new Map<string, Component>();
  return LayoutMap;
}

export { getLayoutMap };
