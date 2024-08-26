<template>
  <button @click="handleClick">发送请求</button>
</template>
<script setup lang="ts">
import { http } from '../../../../../src/index'

async function handleClick(e) {
  getAssetListApi({})
  getPointApi()
  getEndEventComposeApi()
  deleteSafeField()
  const res = await getAfterLoginInfoApi()
}

/**
 * 获取资产清单列表
 * @param params
 */
function getAssetListApi(params) {
  return http.get(
    { url: `/api/asset/assetLists`, params, timeout: 2000 },
    { errorMessageMode: 'none', skipFilterRequestMessage: true },
  );
}

/**
 * 获取点位
 * @param params
 */
function getPointApi() {
  return http.get<any>({ url: `/api/pointFieldRelation/getPoint` });
}

/**
 * @description: 查询合并后的事件名称
 */
function getEndEventComposeApi() {
  return http.get<string[]>({ url: `/api/eventComposeSetting/getEndEventCompose` });
};
/**
 * @description: 登录设置token后 获取登录后基本信息(包括后端权限信息)
 */
function getAfterLoginInfoApi() {
  return http.get(
    { url: `/api/permission/getCurrentPermission` },
    { errorMessageMode: 'none' },
  );
}

/**
 * @description: 查询合并后的事件名称
 */
function deleteSafeField() {
  return http.delete(
    {
      url:
        `/api/safeField?ids=4028839a8a9854cd018a985c33b90000&ids=4028839a8b1c4298018b1c88a0430000&ids=4028839a8b1c4298018b1c8905b70001&ids=4028839a8b1c4298018b1c8918b10002&ids=4028839a8b1c4298018b1c892bfe0003&ids=ff8081818a3acba4018a3b620ff40000&ids=ff8081818a3acba4018a3b6226710001`
    }, {
    skipFilterRequestMessage: false
  }
  );
};
</script>