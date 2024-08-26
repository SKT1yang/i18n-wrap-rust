/*
 * @name: app全局状态
 * @description: Do not edit
 */
import { createPinia } from 'pinia'
import { afterCreateStore, beforeCreateStore } from '@/extension'

beforeCreateStore()

const store = createPinia()

afterCreateStore(store)

export { store }
