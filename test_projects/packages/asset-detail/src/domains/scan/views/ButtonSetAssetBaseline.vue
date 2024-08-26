<!--
 * @name: 更新基线
 * @description: Do not edit
-->

<template>
  <Button @click="handleSetBaseline">{{ t('更新基线') }}</Button>
</template>

<script lang='ts' setup>
import { Button, Modal, message } from 'ant-design-vue';
import { setAssetBaseLineApi, } from '../model'
import { getAssetDetailApi } from '@/domains/asset/model'
import { useAssetInfoStore } from '@/entry/store';
import { t as i18nTranslate } from '@/entry/languages';
import { t } from '@/entry/languages/useLanguage'
import { useRouter } from '@guolisec/routerable'

const { asset } = useAssetInfoStore()

/**
 * 更新基线
 */
async function handleSetBaseline() {
  Modal.confirm({
    iconType: 'warning',
    title: i18nTranslate('提示'),
    content: i18nTranslate(`确定更新基线？`),
    async onOk() {
      try {
        await getAssetDetailApi({ id: asset.id })
      } catch {
        handleBack()
        return
      }
      try {
        const address = asset.assetIp || asset.assetMac
        if (address) {
          await setAssetBaseLineApi([address]);
          message.success(`${i18nTranslate('更新基线成功')}`);
        } else {
          message.success(`${i18nTranslate('更新基线失败，资产信息异常')}`);
        }
      } catch (e) {
        message.warn(`${i18nTranslate('更新基线失败')}`);
      }
    },
  });
}

function handleBack() {
  // state异常，直接back
  const router = useRouter()
  router.back()
}
</script>