/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-14 09:14:53
 * @path: \vue-monorepo-template\apps\admin\test\entry\store\index.ts
 */
import { createPinia } from "pinia";
import { setupStore } from "@guolisec/storable";
const store = createPinia();

// !初始化storable
setupStore(store);

export { store };
