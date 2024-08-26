/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { isJson, isObject } from '@guolisec/utils';
import { reactive } from 'vue';

interface SystemConfig {
  permissionMode: 'ROUTE_MAPPING' | 'BACK';
}
declare global {
  export var __APP_GLOBAL_SYSTEM_CONFIG_INSTANCE__: SystemConfig | undefined;
}
const __APP_GLOBAL_SYSTEM_CONFIG_INSTANCE__ =
  '__APP_GLOBAL_SYSTEM_CONFIG_INSTANCE__';

const SYSTEM_CONFIG = 'SYSTEM_CONFIG_';

function update(config: Partial<SystemConfig>, local = true) {
  if (globalThis[__APP_GLOBAL_SYSTEM_CONFIG_INSTANCE__]) {
    Object.assign(globalThis[__APP_GLOBAL_SYSTEM_CONFIG_INSTANCE__], config);
    if (local && isObject(globalThis[__APP_GLOBAL_SYSTEM_CONFIG_INSTANCE__])) {
      localStorage.setItem(
        SYSTEM_CONFIG,
        JSON.stringify(globalThis[__APP_GLOBAL_SYSTEM_CONFIG_INSTANCE__])
      );
    }
  } else {
    console.warn(`[Configable Warning] 全局状态实例不存在！`);
  }
}

function useSystemConfig() {
  return globalThis[__APP_GLOBAL_SYSTEM_CONFIG_INSTANCE__] as SystemConfig;
}

/**
 * 初始化配置
 * @param config 用户自定义配置项
 */
function setupConfigable(config?: Partial<SystemConfig>) {
  if (!globalThis[__APP_GLOBAL_SYSTEM_CONFIG_INSTANCE__]) {
    globalThis[__APP_GLOBAL_SYSTEM_CONFIG_INSTANCE__] = reactive<SystemConfig>({
      permissionMode: 'ROUTE_MAPPING',
    });

    window.onstorage = function (e) {
      if (e.key === SYSTEM_CONFIG) {
        if (e.newValue && isJson(e.newValue)) {
          const localSystemConfig = JSON.parse(e.newValue);
          update(localSystemConfig, false);
        }
      }
    };
    // 第一次加载页面 同步本地缓存数据
    const localSystemConfigString = localStorage.getItem(SYSTEM_CONFIG);
    if (localSystemConfigString && isJson(localSystemConfigString)) {
      const localSystemConfig = JSON.parse(localSystemConfigString);
      update(localSystemConfig, false);
    }
    config && update(config);
  } else {
    console.warn(`[Storable Warning] 全局状态实例已存在！`);
  }
}

export { useSystemConfig, setupConfigable, update };
