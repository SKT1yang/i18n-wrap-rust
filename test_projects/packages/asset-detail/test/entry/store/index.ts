/*
 * @name: 全局状态
 * @description: Do not edit
 * @date: 2023-02-14 09:14:53
 * @path: \asset-detail\test\entry\store\index.ts
 */
/* 第三方模块 */
import { createPinia } from "pinia";
import { setupStore } from "@guolisec/storable";

const store = createPinia();
// !初始化storable
setupStore(store);

export { store };
