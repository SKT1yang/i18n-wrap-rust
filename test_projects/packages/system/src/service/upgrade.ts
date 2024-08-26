/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-26 10:21:14
 * @path: \feature-vue\platform\front\system\src\service\upgrade.ts
 */

export * from '../model/upgrade';
/* 类型文件 */

/* 第三方模块 */
import { http } from '@guolisec/request';
/* 本地共享模块 */

/* 业务模块 */

/**
 * 系统更新
 * 用于 平台v1.3、资产健康监测v1.1等，是旧升级方式
 * @returns
 */
export async function upgradePatch(data) {
  return http.post({
    url: "/api/systemManager/upgradePatch",
    timeout: 60 * 1000 * 5,
    data,
    headers: {
      "Content-type": "multipart/form-data;charset=UTF-8",
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
}

/**
 * 系统升级 - 全包或补丁zip
 * 用于 平台1.4、资产健康监测v1.2，是新升级方式
 * @returns
 */
export async function upgrade(data) {
  return http.post({
    url: "/api/systemManager/upgrade",
    timeout: 60 * 1000 * 5,
    data,
    headers: {
      'Content-type': 'multipart/form-data;charset=UTF-8',
      // @ts-ignore
      ignoreCancelToken: true,
    },
  });
}

/**
 * 重启设备
 * @returns
 */
export async function reboot() {
  return await http.get({
    url: '/api/system/reboot',
  });
}

/**
 * 知识库上传,只保留最后一版本知识库
 * @returns
 */
export async function uploadKnowledge(data) {
  return http.post({
    url: '/api/knowledgeBase',
    data,
    headers: {
      'Content-type': 'multipart/form-data;charset=UTF-8',
      // @ts-ignore
      ignoreCancelToken: true,
    },
    timeout: 2 * 60 * 1000,
  });
}

/**
 * 知识库升级
 * @returns
 */
export async function knowledgeUpgrade(data) {
  return http.post({
    url: '/api/eventStore/knowledgeUpgrade',
    data,
    timeout: 2 * 60 * 1000,
  });
}

/**
 * 获取正在执行的任务数量
 * @returns elementTypeList：列表形式
 */
export async function countRunningTaskNumber(params?) {
  return await http.get<number>({
    url: '/api/assetScanMessage/countRunningTaskNumber',
    params,
  })
}
