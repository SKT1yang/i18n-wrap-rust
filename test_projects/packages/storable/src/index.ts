/*
 * @name: 全局状态
 * @description: Do not edit
 */
import type { Pinia } from 'pinia';
declare global {
  export var __APP_GLOBAL_STORE_INSTANCE__: Pinia | undefined;
}

const __APP_GLOBAL_STORE_INSTANCE__ = '__APP_GLOBAL_STORE_INSTANCE__';
/**
 * 配置路由
 * @description 必须被调用， 否则路由实例是个空对象
 * @param options
 */
function setupStore(storeInstance: Pinia) {
  if (!globalThis[__APP_GLOBAL_STORE_INSTANCE__]) {
    globalThis[__APP_GLOBAL_STORE_INSTANCE__] = storeInstance;
  } else {
    console.warn(`[Storable Warning] 全局状态实例已存在！`);
  }
}

function useStore() {
  return globalThis[__APP_GLOBAL_STORE_INSTANCE__] as Pinia;
}

export { setupStore, useStore };
