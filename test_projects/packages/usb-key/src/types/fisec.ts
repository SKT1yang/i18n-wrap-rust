/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \usb-key\src\types\fisec.ts
 */
// usb原生的pininfo
interface PinInfo {
  isDefaultPIN: number
  remainCount?: number
  retryCount: number
}

type UsbKeyAppInfoItem = {
  sn: string
  devHandle?: string
  appHandle?: string
  appName?: string
} & Partial<PinInfo>

interface UsbKeyLoginForm {
  [key: string]: any
  sn: string // usbkey设备序列号（其实是查询绑定关系，也就是当前登录用户之前绑定usbkey设备序列号）
  pin: string // usbkey用户pin
  mode: 0 | 1 // usbkey登录模式，0为正常模式，1为紧急登录模式，默认为0
  recoveryCode: string // 紧急登录恢复代码
  random: string // 紧急登录随机数，md5后生成恢复代码
}

export type { PinInfo, UsbKeyAppInfoItem, UsbKeyLoginForm }
