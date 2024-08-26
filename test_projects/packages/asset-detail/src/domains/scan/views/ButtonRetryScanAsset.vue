<!--
 * @name: 调试模式扫描
 * @description: Do not edit
-->

<template>
  <Button @click="handleScan">{{ t('调试模式扫描') }}</Button>
  <ModalRetryScanAsset v-model:visible="visible"></ModalRetryScanAsset>
</template>

<script lang='ts' setup>
import { ref } from 'vue'
import { Button, Modal } from 'ant-design-vue';
import ModalRetryScanAsset from './ModalRetryScanAsset.vue';
import { t as i18nTranslate } from '@/entry/languages';
import { t } from '@/entry/languages/useLanguage'
import { useRouter } from '@guolisec/routerable'
import { getAssetDetailApi } from '@/domains/asset/model'
import { useAssetInfoStore } from '@/entry/store';

const { asset } = useAssetInfoStore()

const visible = ref(false)

/**
 * 调试模式扫描
 */
async function handleScan() {
  Modal.confirm({
    iconType: 'warning',
    title: i18nTranslate('提示'),
    content: i18nTranslate(`确定调试模式扫描？`),
    centered: true,
    async onOk() {
      // 确保当前资产存在
      try {
        await getAssetDetailApi({ id: asset.id })
      } catch {
        handleBack()
        return
      }
      visible.value = true
    },
  });
}

function handleBack() {
  // state异常，直接back
  const router = useRouter()
  router.back()
}

</script>