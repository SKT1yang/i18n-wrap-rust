<!--
 * @Name: 资产组同步
 * @Description: Do not edit
-->

<template>
  <Button type="text" :title="title" :disabled="isShowByFeature('cascade::sync::device') ? !canUpload : false"
    :loading="isUploadLoading" @click="handleUpload" v-if="isShowByFeature('cascade::sync')">
    <template #icon>
      <i class="i-base-upload-cloud-2-line align-icon"></i>
    </template>
  </Button>
</template>
<script name="AssetTree" lang="ts" setup>
/* 类型文件 */
/* 第三方模块 */
import { onMounted, ref, computed } from 'vue';
import { Button } from 'ant-design-vue';
import { message } from '@guolisec/toast';
/* 本地模块 */
import { getClientNameApi, assetGroupSyncApi, getAssetGroupSynchronizationApi } from '../../model/cascade'
import { t } from '@/languages/useLanguage'
import { isShowByFeature } from '../asset-list/context/useListContext';

/********************** props、context、event处理 **********************/

const isDevice = isShowByFeature('cascade::sync::device')
const isManage = isShowByFeature('cascade::sync::manage')
const isClient = isShowByFeature('cascade::client-name')

/********************** 上送资产组结构 **********************/

const canUpload = ref(false) // 如果当前有资产组标识，可点击上送按钮
const clientInfo = ref()
async function getClientName() {
  clientInfo.value = await getClientNameApi()
  canUpload.value = clientInfo.value.body ? true : false
};

/**
 * 上送资产组结构状态
 */
const isUploadLoading = ref(false)
const title = computed(() => {
  if (isDevice) {
    return '上送资产组结构'
  }
  if (isManage) {
    return '资产组同步'
  }
  return ''
})
async function handleUpload() {
  try {
    isUploadLoading.value = true
    if (isManage) {
      await getAssetGroupSynchronizationApi()
      message.success(t('资产组正在同步'))
    }
    if (isDevice) {
      await assetGroupSyncApi(clientInfo.value)
      message.success(t('上送成功'))
    }

  } finally {
    isUploadLoading.value = false
  }
}

onMounted(() => {
  if (isClient) {
    getClientName()
  }
});
</script>
