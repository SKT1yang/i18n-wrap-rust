/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \permission\src\views\UsbKey\usbKey.ts
 */
// usb原生的pininfo
interface PinInfo {
  isDefaultPIN: number;
  remainCount?: number;
  retryCount: number;
}

type UsbKeyAppInfoItem = {
  sn: string;
  devHandle?: string;
  appHandle?: string;
  appName?: string;
} & Partial<PinInfo>;

export type { PinInfo, UsbKeyAppInfoItem };
