/*
 * @name: 全局配置
 * @description: 只到构建阶段，不包含运行阶段
 */
import { setupConfigable } from '@guolisec/configable'

setupConfigable({
  permissionMode: import.meta.env.PROD ? 'BACK' : 'ROUTE_MAPPING'
})
