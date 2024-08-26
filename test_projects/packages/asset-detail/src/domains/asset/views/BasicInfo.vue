<!--
 * @Name: 基本信息
 * @Description: Do not edit
-->
<template>
  <div class="flex items-center text-xl mb-6">
    <Device :asset-type-code="asset.assetTypeCode" :color="cssVar('--color-text-base')" />
    <span class="ml-2">{{ asset.name }}</span>
    <span class="mx-2">/</span>
    <span>{{ asset.assetTypeName }}</span>
  </div>
  <div class="flex text-xs items-center">
    <BadgeRunStatus :status="asset.runStatus" />
    <span class="mx-2">
      <span class="text-slate-500 mr-2"> {{ t('业务状态') }} </span>
      <span>{{ malfunction }}</span>
    </span>
    <span class="mx-2">
      <span class="text-slate-500 mr-2"> {{ t('入网时间') }} </span>
      <span>{{ formatToDateTime(asset.createTime || undefined) }}</span>
    </span>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import BadgeRunStatus from './BadgeRunStatus.vue';
import { formatToDateTime, cssVar } from '@guolisec/utils'
import { useAssetInfoStore } from '../../../entry/store';
import { Device } from '@guolisec/component';
import { t } from '@/entry/languages/useLanguage'

const { asset } = useAssetInfoStore()
const malfunction = computed(() => {
  if (asset.malfunction == 0) {
    return t('正常')
  } else if (asset.malfunction == 1) {
    return t('故障')
  } else {
    return '-'
  }
})
</script>
