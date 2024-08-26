/*
 * @name: Do not edit
 * @description: Do not edit
 */
/* 类型文件 */
import type { SelectValue } from 'ant-design-vue/es/select'
import type { PinInfo, UsbKeyAppInfoItem } from '../types/fisec'
/* 第三方模块 */
import { message } from '@guolisec/toast'
/* 本地模块 */
import {
  enumDeviceApi,
  handleUSBKeySnStr,
  connectDevApi,
  turnOnApplicationApi,
  verifyPINApi,
  enumApplicationApi,
  handleUSBKeyAppNameStr,
  getPINInfoApi
} from '../model/fisec'
import { t } from '../languages'

/**
 * 枚举设备、连接设备、打开应用
 * @param sn 需要鉴权的设备序列号
 * @description 目的验证是否插了usbkey，并获取devHandle
 */
async function checkSn(sn: SelectValue) {
  const localSn = sn as string
  let devHandle = ''
  let appHandle = ''
  try {
    // 连接设备前要枚举设备
    const snList = await enumSnList()
    if (sn && !snList.includes(localSn)) {
      message.warning(t('请插入正确的USB Key'))
      return {
        devHandle,
        appHandle
      }
    }
    if (sn) {
      // 连接设备
      devHandle = await connectDevApi(localSn)
      if (!devHandle) {
        message.warning(t('USB Key 设备连接失败或设备不匹配'))
        return {
          devHandle,
          appHandle
        }
      }
      // 打开应用，查看是否已被注册
      appHandle = await openApplication(devHandle)
    }
  } catch (error) {
    console.log(error)
    message.warning(t('USB Key 设备连接失败或设备不匹配'))
  } finally {
    return {
      devHandle,
      appHandle
    }
  }
}

/**
 * USB Key：打开应用，若设备注册未注册，提示用户注册
 */
async function openApplication(devHandle: string) {
  let appHandle = ''
  try {
    // 打开应用
    appHandle = await turnOnApplicationApi(devHandle, 'security')
    if (!appHandle) {
      message.warning(t('USB Key 应用未正确初始化程序'))
    }
  } catch (error) {
    message.warning(t('USB Key 应用未正确初始化程序'))
  } finally {
    return appHandle
  }
}

/**
 * 验证pin码是否正确
 * @returns
 */
async function checkPin(
  sn: string,
  pin: string,
  pinType: 0 | 1 = 0,
  devHandle?: string,
  appHandle?: string
) {
  let remainCount = 10
  try {
    if (!devHandle || !appHandle) {
      const hanlde = await checkSn(sn)
      devHandle = hanlde.devHandle
      appHandle = hanlde.appHandle
    }

    if (appHandle) {
      const pinInfo = await getPINInfoApi(appHandle, pinType)
      remainCount = JSON.parse(JSON.stringify(pinInfo)).remainCount
      if (remainCount === 0) {
        message.warning(t('重试次数为0'))
        return false
      }
    }

    if (!!devHandle && !!appHandle && pin) {
      const result = await verifyPINApi(appHandle, pinType, pin)
      if (result !== 0) {
        message.warning(t('Pin 码错误，还可重试{remainCount}次，请重新输入', { remainCount }))
        return false
      } else {
        return true
      }
    }
    return false
  } catch (error) {
    return false
  }
}

/**
 * 枚举设备，获取usbkey设备序列号列表
 */
async function enumSnList() {
  let snList: string[] = []
  try {
    const devices = await enumDeviceApi()
    if (devices) {
      snList = handleUSBKeySnStr(devices)
    }
  } finally {
    return snList
  }
}

// usbkey：获取插入 usbkey 设备列表
async function getUsbKeyDeviceList() {
  let dataList: UsbKeyAppInfoItem[] = []
  try {
    let snList: string[] = []
    snList = await enumSnList()
    if (snList.length === 0) {
      dataList = []
      return dataList
    }
    if (snList.length > 0) {
      // 获取插入usbkey设备信息，未被注册过的设备不会添加到 canOperatedDataList
      for (let i = 0; i < snList.length; i++) {
        const sn = snList[i]
        const appInfoList = await getAppInfoListBySn(sn)
        dataList.push(...appInfoList)
      }

      // 将未注册过，但当前插入的设备加入列表
      for (let i = 0; i < snList.length; i++) {
        let flag = false
        dataList.forEach((data) => {
          if (data.sn === snList[i]) {
            flag = true
          }
        })
        if (!flag) {
          dataList.push({
            sn: snList[i]
          })
        }
      }
    }
  } catch (error) {
    dataList = []
    return dataList
  } finally {
    return dataList
  }
}

// usbkey：连接设备、对设备进行认证、枚举应用、获取应用对应的信息
async function getAppInfoListBySn(sn: string) {
  let appInfoList: UsbKeyAppInfoItem[] = []
  try {
    // 连接设备、获取设备句柄
    const devHandle = await connectDevApi(sn)
    if (!devHandle) {
      message.warning(t('USB Key设备连接失败'))
      return appInfoList
    }
    // 枚举应用
    const appNamesStr = await enumApplicationApi(devHandle)
    if (appNamesStr) {
      // 应用列表
      const appNameList = handleUSBKeyAppNameStr(appNamesStr)
      // 获取应用信息
      appInfoList = await getAppInfo(sn, devHandle, appNameList)
    }
  } catch (error) {
    message.warning(t('USB Key设备连接失败'))
  } finally {
    return appInfoList
  }
}

async function getAppInfo(sn: string, devHandle: string, appNameList: string[]) {
  const result: UsbKeyAppInfoItem[] = []
  try {
    for (let i = 0; i < appNameList.length; i++) {
      const appName = appNameList[i]
      // 打开应用, 并获取应用句柄
      const appHandle = await turnOnApplicationApi(devHandle, appName)
      // 获取 pin 登录信息
      if (appHandle) {
        const appInfo = await getPINInfoApi(appHandle, 1)
        const appInfoObj: PinInfo = JSON.parse(JSON.stringify(appInfo))
        result.push({
          sn,
          devHandle,
          appHandle,
          appName,
          ...appInfoObj
        })
      }
    }
  } catch (error) {
    message.warning(t('打开应用失败'))
  } finally {
    return result
  }
}

export { enumSnList, checkSn, checkPin, getUsbKeyDeviceList }
