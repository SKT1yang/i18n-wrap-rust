/*
 * @name: Do not edit
 * @description: Do not edit
 */
import 'uno.css'
import type { UsbKeyLoginForm } from './types/fisec'
import FiSecUsbKey from './views/fisec/index.vue' // usbkey管理页面
import FiSecButtonUsbKeyBindUser from './views/fisec/UsbKeyBind/ButtonUsbKeyBindUser.vue' // 绑定按钮
import FiSecModalUsbKeyBindUser from './views/fisec/UsbKeyBind/ModalUsbKeyBindUser.vue' // 绑定/解绑弹窗
import { useGetBindRelation, useUsbKeyLogin } from './controller/useFisec' // usbkey登录hook
import { enumSnList } from './service/fisec'

export {
  FiSecUsbKey as UsbKey,
  FiSecButtonUsbKeyBindUser as ButtonUsbKeyBindUser,
  FiSecModalUsbKeyBindUser as ModalUsbKeyBindUser,
  useUsbKeyLogin,
  useGetBindRelation,
  // 枚举usbkey的设备序列号
  enumSnList,
  type UsbKeyLoginForm
}
