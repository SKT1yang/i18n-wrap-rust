/* 类型文件 */

/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * @description: 获取声光电设备数据
 */
function getSoundLightDeviceApi() {
  return http.get({ url: `/api/soundLightSwitch/obtain/moxaIO` });
}

/**
 * @description: 获取声光电告警数据
 */
interface SoundLightConfig {
  id?: number;
  assetIp?: string;
  doIndex?: number;
  doStatus: number;
  score: number;
}
function getSoundLightInfoApi() {
  return http.get<SoundLightConfig>({ url: `/api/soundLightSwitch/show` });
}

/**
 * @description: 修改声光电告警数据
 */
function postSoundLightInfoApi(data) {
  return http.post({ url: `/api/soundLightSwitch/manipulate`, data });
}

export {
  getSoundLightDeviceApi,
  getSoundLightInfoApi,
  postSoundLightInfoApi,
  type SoundLightConfig,
};
