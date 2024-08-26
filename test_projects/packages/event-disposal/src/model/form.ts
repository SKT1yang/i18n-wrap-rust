import { defineStore } from 'pinia'
import { useStore } from '@guolisec/storable'
import { reactive } from 'vue'

const useFormStoreInternal = defineStore('form', () => {
  const data = reactive<{
    pageSize: number
    total: number
    current: number
    list: any[]
    sort?: string
  }>({ pageSize: 10, total: 0, current: 1, list: [], sort: 'createTime,desc' })
  const data_disposed = reactive<{
    pageSize: number
    total: number
    current: number
    list: any[]
    sort?: string
  }>({ pageSize: 10, total: 0, current: 1, list: [], sort: 'createTime,desc' })
  return { data, data_disposed }
})

// Need to be used outside the setup
function useFormStoreWithOut() {
  const store = useStore()
  return useFormStoreInternal(store)
}

export { useFormStoreWithOut as useFormStore }
