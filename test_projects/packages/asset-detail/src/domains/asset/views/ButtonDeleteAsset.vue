<template>
  <Button @click="handleDelete" danger>{{ t('移除资产') }}</Button>
</template>

<script lang='ts' setup>
import { Button, Modal, message } from 'ant-design-vue';
import { useAssetInfoStore } from '../../../entry/store'
import { deleteAssetApi, getAssetDetailApi } from '../model';
import { useRouter } from '@guolisec/routerable'
import { t as i18nTranslate } from '@/entry/languages';
import { t } from '@/entry/languages/useLanguage'

const { asset } = useAssetInfoStore()

/**
 * 删除资产组
 */
async function handleDelete() {
  Modal.confirm({
    iconType: 'warning',
    title: `${i18nTranslate('确定移除 {} 吗', asset.name)}`,
    content: `${i18nTranslate('移除后将丢失资产所有信息，确认移除 {} 吗？', asset.name)}`,
    okText: `${i18nTranslate('确定移除')}`,
    okButtonProps: { danger: true },
    async onOk() {
      try {
        await getAssetDetailApi({ id: asset.id })
      } catch {
        handleBack()
        return
      }

      try {
        await deleteAssetApi([asset.id]);
        message.success(`${i18nTranslate('移除成功')}`);
        handleBack()
      } catch (e) {
        message.warn(`${i18nTranslate('移除失败')}`);
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