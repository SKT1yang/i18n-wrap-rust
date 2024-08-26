<template>
  <Modal v-model:open="dialogVisible" :closable="false" :mask-closable="false">
    <template #title>
      <div>
        <i class="i-base-error-warning-fill text-xl text-orange-400 align-icon" v-if="mode === 'warning'"></i>
        <i class="i-base-checkbox-circle-fill text-xl text-green-400 align-icon" v-else></i>
        <span class="pl-1">{{ title }}</span>
      </div>
    </template>
    <div v-if="mode === 'warning'">
      <p>{{ t('正在以调试模式扫描资产 {}，扫描完成后将自动下载数据包，最多需要三分钟。', asset?.name) }}</p>
      <p class="font-bold">
        {{ t('请留在此页面，否则可能导致扫描失败！') }}
      </p>
    </div>
    <div v-if="mode === 'success'">
      <p>{{ t('已完成资产 {} 的调式模式扫描，稍后将自动下载数据包。', asset?.name) }}</p>
      <p>
        {{ t('还没开始下载？') }} <Button type="link" @click="handleEeDownloadDebugFile" :loading="reDownloadButtonLoading" :disabled="reDownloadButtonLoading">{{
          t('点击此处手动激活下载')
        }}</Button>
      </p>
    </div>
    <template #footer>
      <Button type="primary" v-if="mode === 'warning'" @click.prevent="closeModal" danger>{{ t('我要离开') }}</Button>
      <Button type="primary" v-else @click.prevent="closeModal">{{ t('完成') }}</Button>
    </template>
  </Modal>
</template>
<script setup lang="ts">
/* 类型文件 */
/* 第三方模块 */
import { ref, watch, computed } from 'vue'
import { Modal, Button } from 'ant-design-vue';
import { useVModel, downloadByData } from '@guolisec/utils';
/* 本地模块 */
import { retryScanAssetApi, reDownloadDebugFile } from '../model'
import { useAssetInfoStore } from '@/entry/store';
import { t } from '@/entry/languages/useLanguage'

const { asset } = useAssetInfoStore()

/********************** 外部状态或配置 **********************/

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
});

const emit = defineEmits(['update:visible', 'refresh']);

/********************** 初始化状态 **********************/
const mode = ref<'warning' | 'success'>('warning')

watch(
  () => props.visible,
  async (v) => {
    if (v) {
      mode.value = 'warning'
      download()
    }
  },
)

/********************** 弹窗 **********************/

const title = computed(() => {
  return mode.value === 'warning' ? t('调试模式扫描中') : t('调试模式扫描完成')
})

const dialogVisible = useVModel(props, 'visible', emit)

async function download() {
  const address = asset.assetIp || asset.assetMac
  if (address) {
    mode.value = 'warning'
    retryScanAssetApi(address).then(data => {
      const blob = new Blob([data], {
        type: 'application/octet-stream'
      })
      downloadByData(blob, `scan_packets.bin`)
      mode.value = 'success'
    }).catch(() => {
      closeModal()
    })
  } else {
    mode.value = 'warning'
  }
}

const reDownloadButtonLoading = ref(false)
async function handleEeDownloadDebugFile() {
  const address = asset.assetIp || asset.assetMac
  if (address) {
    reDownloadButtonLoading.value = true
    try {
      reDownloadDebugFile(address).then(data => {
        const blob = new Blob([data], {
          type: 'application/octet-stream'
        })
        downloadByData(blob, `scan_packets.bin`)
      })
    } finally {
      reDownloadButtonLoading.value = false
    }

  } else {
    mode.value = 'warning'
  }
}

function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}
</script>
