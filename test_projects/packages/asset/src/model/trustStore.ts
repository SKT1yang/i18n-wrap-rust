/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \asset\src\model\trustStore.ts
 */
import { defineStore } from 'pinia';
import { useStore } from '@guolisec/storable';
import { reactive } from 'vue';
import { backType } from '../views/asset-field/types';

const useMyStore = defineStore('trust', () => {
  let data = reactive<{
    list: backType['content'];
    pageSize: number;
    current: number;
    total: number;
  }>({ list: [], pageSize: 10, current: 1, total: 0 });
  return { data };
});

// Need to be used outside the setup
function useFormStoreWithOut() {
  const store = useStore();
  return useMyStore(store);
}

export { useFormStoreWithOut as useStore };
