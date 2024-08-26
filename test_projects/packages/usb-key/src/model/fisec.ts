import { http } from '@guolisec/request'
import axios from 'axios'
import { message } from '@guolisec/toast'
import { t } from '../languages'

/********************** UsbKey本身服务接口 **********************/

const USBKeyHttp = axios.create({
  timeout: 1000 * 15,
  baseURL: 'http://127.0.0.1:8090/do',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    Accept: '*/*'
  }
})
// 02000004
// 02000005
// 02000014
// 02000015
// 02000016
// 02000017
// 02000020
// 02000022
// 02000073
// 02000074

/**
 * 序列化参数数据
 * @param message
 */
function encodemessage(message: {
  order?: string
  flag?: number
  provider?: string
  devName?: string
  hDev?: string
  appname?: string
  happ?: string
  pintype?: 0 | 1 // 用户类型，0：管理员，1：操作员
  oldPin?: string
  newPin?: string
  adminpin?: string
  usrpin?: string
  app?: string
  pin?: string
  alg?: number
  pubkey?: string
  id?: string
}) {
  let data = ''
  for (const key in message) {
    data = data + key + '=' + message[key] + '&'
  }
  data = data.substring(0, data.length - 1)
  return data
}

/**
 * 枚举设备
 * @param flag：1表示当前存在的设备列表，0表示取当前驱动支持的设备列表
 * @param provider 可选。key的供应商。不存在时，枚举全部存在设备
 * @return rev 为 0 时，枚举成功，获取 NameList 设备列表
 */
async function enumDeviceApi(provider = undefined, flag = 1) {
  let result = null
  try {
    const rawData: {
      order: string
      flag: number
      provider?: string
    } = {
      order: '02000004',
      flag
    }
    if (provider) {
      rawData.provider = provider
    }

    const data = encodemessage(rawData)
    const response = await USBKeyHttp.post('', data)
    if (response.status === 200 && response.data.rev === '0') {
      result = response.data.NameList
    } else {
      message.warning(t('未插入USB Key'))
    }
  } catch (e) {
    console.error(e)
    message.info(t('当前未检测到USB Key'))
  }
  return result
}

/**
 * 处理设备的序列号
 * @param {*} devices
 */
function handleUSBKeySnStr(devices: string[]) {
  const serialList: string[] = []
  const deviceList = Array.isArray(devices) ? devices : [devices]
  deviceList.forEach((device) => {
    const serial = device.split(':')[1].split('||')[0]
    if (serial) {
      const snList = serial.split('|')
      serialList.push(...snList)
    }
  })
  return serialList
}

/**
 * 连接设备
 * @param devName：设备序列号
 * @param deviceType 可选。key的供应商。不存在时，需要先枚举全部设备然后连接设备
 *
 * @return rev 为 0 时，连接成功，获取到设备句柄
 */
async function connectDevApi(devName?: string, provider?: string) {
  let result = ''
  try {
    const rawdata: {
      order: string
      devName?: string
      provider?: string
    } = {
      order: '02000005',
      devName
    }
    if (provider) {
      rawdata.provider = provider
    }
    const data = encodemessage(rawdata)

    const response = await USBKeyHttp.post('', data)
    if (response.status === 200 && response.data.rev === 0) {
      result = response.data.hDev
    } else {
      message.warning(t('连接失败'))
    }
  } catch (e) {
    console.error('connectDev:', e)
    message.warning(t('连接设备失败'))
  }
  return result
}

/**
 * 枚举应用
 * @param hDev ：设备句柄
 * @description 返回应用列表，以|分割，以||结尾
 */
async function enumApplicationApi(hDev: string) {
  let result = ''
  try {
    const rawdata = {
      order: '02000020',
      hDev
    }
    const data = encodemessage(rawdata)

    const response = await USBKeyHttp.post('', data)
    if (response.status === 200 && response.data.rev === 0) {
      result = response.data.appList
    } else {
      message.warning(t('枚举应用失败'))
    }
  } catch (e) {
    console.error(e)
    message.warning(t('枚举应用失败'))
  }

  return result
}

function handleUSBKeyAppNameStr(allAppNames: string) {
  allAppNames = allAppNames.slice(0, -2).trim()
  let appNameList: string[] = []
  if (allAppNames) {
    appNameList = allAppNames.split('|')
  }
  for (let i = 0; i < appNameList.length; i++) {
    if (appNameList[i] === '') {
      i--
    }
  }
  return appNameList
}

/**
 * 打开应用
 * @param hDev ：设备句柄
 * @param appname :应用名
 *
 */
async function turnOnApplicationApi(hDev: string, appname: string) {
  let result = ''
  try {
    const rawdata = {
      order: '02000022',
      hDev,
      appname
    }
    const data = encodemessage(rawdata)

    const response = await USBKeyHttp.post('', data)

    if (response.status === 200 && response.data.rev === 0) {
      result = response.data.hApp
    } else {
      message.warning(t('打开失败,rev = ') + response.data.rev)
    }
  } catch (e) {
    console.error(e)
    message.warning(t('打开应用失败'))
  }
  return result
}

/**
 * 获取 PIN 码信息
 * @param happ ：应用句柄
 * @param pintype : 用户类型，0：管理员，1：操作员
 *
 * @return 返回JSON字符串, 包含：重试次数（retryCount）、剩余重试次数（remainCount）、是否为初始密钥（isDefaultPIN）
 */
async function getPINInfoApi(happ: string, pintype: 0 | 1) {
  let result = null
  try {
    const rawdata = {
      order: '02000015',
      happ,
      pintype
    }
    const data = encodemessage(rawdata)

    const response = await USBKeyHttp.post('', data)
    if (response.status === 200 && response.data.rev === 0) {
      result = response.data.pininfo
    } else {
      message.warning(t('获取失败,rev=') + response.data.rev)
    }
  } catch (e) {
    console.error(e)
    message.warning(t('获取Pin信息失败'))
  }
  return result
}

/**
 * 修改指定用户的PIN码
 * @param happ ：应用句柄
 * @param pintype :用户类型，0：管理员，1：操作员
 * @param oldPin  :旧PIN 码
 * @param newPin  :新PIN码
 *
 * @return 返回 0 ，修改成功
 */
async function changePinApi(happ: string, pintype: 0 | 1, oldPin: string, newPin: string) {
  let result = null
  try {
    // !字段顺序不能修改
    const rawdata = {
      order: '02000014',
      happ,
      pintype,
      oldPin,
      newPin
    }
    const data = encodemessage(rawdata)

    const response = await USBKeyHttp.post('', data)

    if (response.status === 200 && response.data.rev === 0) {
      result = response.data.rev
    } else {
      message.warning(t('旧的Pin码输入错误'))
    }
  } catch (e) {
    console.error(e)
    message.warning(t('修改PIN码失败'))
  }
  return result
}

/**
 * 解锁用户PIN
 * @param happ ：应用句柄
 * @param adminpin :管理员PIN
 * @param usrpin  :新的用户PIN
 *
 * @return 返回 0 ，解锁成功
 */
async function unblockPINApi(happ: string, adminpin: string, usrpin: string) {
  let result = null
  try {
    const rawdata = {
      order: '02000017',
      happ,
      adminpin,
      usrpin
    }
    const data = encodemessage(rawdata)

    const response = await USBKeyHttp.post('', data)
    if (response.status === 200 && response.data.rev === 0) {
      result = response.data.rev
    } else {
      message.warning(t('PIN码重置失败'))
    }
  } catch (e) {
    console.error(e)
    message.warning(t('获取Pin信息失败'))
  }

  return result
}

/**
 * 校验PIN码
 * @param app ：应用句柄
 * @param pintype :用户类型，0：管理员，1：操作员
 * @param pin :PIN码
 * @return 返回 0 ，校验成功
 */
async function verifyPINApi(app: string, pintype: 0 | 1 = 1, pin: string) {
  let result = null
  try {
    const rawdata = {
      order: '02000016',
      app,
      pintype,
      pin
    }
    const data = encodemessage(rawdata)

    const response = await USBKeyHttp.post('', data)
    if (response.status === 200 && response.data.rev === 0) {
      result = response.data.rev
    }
  } catch (e) {
    console.error(e)
    message.warning(t('校验PIN码失败'))
  }
  return result
}

/**
 * HSAH 杂凑初始化
 * @param hDev :设备句柄
 * @param pubkey 公钥数据
 * @param id :ID数据
 * @param alg :算法类型
 * @return 返回杂化句柄
 */
async function digestInitApi(hDev: string, alg: number = 2, pubkey: string = '', id: string = '') {
  let hHash = null
  try {
    const rawdata = {
      order: '02000073',
      hDev,
      alg,
      pubkey,
      id
    }
    const data = encodemessage(rawdata)
    const response = await USBKeyHttp.post('', data)
    if (response.status === 200 && response.data.rev === 0) {
      hHash = response.data.hHash
    } else {
      message.warning(t('初始化杂凑失败'))
    }
  } catch (e) {
    console.error(e)
    message.warning(t('初始化杂凑失败'))
  }
  return hHash
}

/**
 * HSAH 杂凑初始化
 * @param inData :原文数据
 * @param hHash： 杂化句柄
 * @return 返回 加密后的结果
 */
async function digestApi(hHash: string, inData: string) {
  let hashData = null
  try {
    const rawdata = {
      order: '02000074',
      hHash,
      inData
    }

    const data = encodemessage(rawdata)
    const response = await USBKeyHttp.post('', data)
    if (response.status === 200 && response.data.rev === 0) {
      hashData = response.data.hashData
    } else {
      message.warning(t('单包杂凑失败'))
    }
  } catch (e) {
    console.error(e)
    message.warning(t('单包杂凑失败'))
  }
  return hashData
}

/********************** UsbKey后端接口服务 **********************/

/**
 * @description: 用户与key绑定
 * @returns 返回成功或者失败
 */
function doUSBKeyBindUserApi(data: { pin?: string; sn: string; username: string }) {
  return http.post({ url: `/api/usbkey/keyBinding`, data })
}

/**
 * @description: 用户与key解绑, 需验证PIN码
 */
function doUSBKeyUnbindUserApi(data) {
  return http.post({ url: `/api/usbkey/keyUnbinding`, data })
}

/**
 * @description: 获取 - 绑定关系
 */
async function getBindRelationApi() {
  return http.get<
    {
      sn: string
      username: string
    }[]
  >({ url: `/api/usbkey/getBindRelation` })
}

/**
 * @description: 根据用户名获取USB key是否绑定
 */
async function checkUserBindStatusApi(data) {
  return http.post({ url: `/api/usbkey/checkKey`, data })
}

/**
 * @description: 获取紧急登录随机数
 */
async function getUSBKeyRandomStrApi() {
  return http.get<string>({ url: `/api/validate/getRandomStr` })
}

/**
 * 获取紧急登录恢复代码
 * @param random 随机数
 * @returns
 */
async function getUSBKeyRecoveryCodeApi(random: string) {
  return http.get<string>({
    url: `/api/validate/getUsbKeyPin`,
    params: {
      str: random
    }
  })
}

export {
  connectDevApi,
  enumDeviceApi,
  handleUSBKeySnStr,
  enumApplicationApi,
  handleUSBKeyAppNameStr,
  turnOnApplicationApi,
  getPINInfoApi,
  changePinApi,
  unblockPINApi,
  verifyPINApi,
  digestInitApi,
  digestApi,
  doUSBKeyBindUserApi,
  doUSBKeyUnbindUserApi,
  getBindRelationApi,
  checkUserBindStatusApi,
  getUSBKeyRandomStrApi,
  getUSBKeyRecoveryCodeApi
}
