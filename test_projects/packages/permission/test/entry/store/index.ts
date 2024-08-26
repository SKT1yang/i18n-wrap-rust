/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { createPinia } from 'pinia';
import { setupStore } from '@guolisec/storable';
import { isDev } from '@guolisec/utils';
isDev() && console.log('创建pinia实例前：beforeCreatePinia');
const store = createPinia();
isDev() && console.log('创建pinia实例后：afterCreatePinia');
// !初始化storable
setupStore(store);
isDev() && console.log('pinia实例挂载到全局window：after run setupStore');

export { store };
