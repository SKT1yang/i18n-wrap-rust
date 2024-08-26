import { defineStore } from "pinia"
import { useStore } from "@guolisec/storable";
import { reactive } from 'vue'

const useMyStore = defineStore("device", () => {
  const data = reactive<{ list: any[], current: number, pageSize: number, total: number, sort?: string, key: number }>({ key: 1, list: [], current: 1, pageSize: 10, total: 0, sort: 'createTime,desc' })
  return { data }
})

// Need to be used outside the setup
function useFormStoreWithOut() {
  const store = useStore();
  return useMyStore(store);
}

export {
  useFormStoreWithOut as useStore
}