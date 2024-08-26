<!--
 * @name: 资产扫描时能需要特别配置的字段
 * @description: 其实就是鞍钢项目的定制字段
-->
<template>
  <div class="mb-6"
    v-if="dataForm.assetTypeCode && [1, 2, 3, 4, 5, 8, 9, 10, 11, 17, 25, 31, 35, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('所属系统级别')}}</div>
    <div>{{ typeof dataForm.systemLevel === 'number' ? systemLevelOptions[dataForm.systemLevel].label : '-' }}</div>
  </div>
  <div class="mb-6"
    v-if="dataForm.assetTypeCode && [1, 2, 3, 4, 5, 8, 9, 10, 11, 17, 18, 25, 31, 35, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('所属系统名称')}}</div>
    <div>{{ dataForm.systemName || '-' }}</div>
  </div>
  <div class="mb-6" v-if="dataForm.assetTypeCode && [25].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('服务器结构类型')}}</div>
    <div>{{ dataForm.serverType || '-' }}</div>
  </div>
  <div class="mb-6" v-if="dataForm.assetTypeCode && [25].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('冗余情况')}}</div>
    <div>{{ dataForm.redundancy || '-' }}</div>
  </div>
  <div class="mb-6" v-if="dataForm.assetTypeCode && [25, 4, 10, 11].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('数据库版本')}}</div>
    <div>{{ dataForm.databaseVersion || '-' }}</div>
  </div>
  <div class="mb-6" v-if="dataForm.assetTypeCode && [25, 3, 4, 10, 11, 31].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('主要软件')}}</div>
    <div>{{ dataForm.mainSoftware || '-' }}</div>
  </div>
  <div class="mb-6" v-if="dataForm.assetTypeCode && [25, 3, 4, 10, 11, 31].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('防护软件类型')}}</div>
    <div>{{ dataForm.protectSoftwareType || '-' }}</div>
  </div>
  <div class="mb-6" v-if="dataForm.assetTypeCode && [25, 3, 4, 10, 11, 31].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('防护软件名称')}}</div>
    <div>{{ dataForm.protectSoftwareName || '-' }}</div>
  </div>
  <div class="mb-6" v-if="dataForm.assetTypeCode && [25, 3, 4, 10, 11, 31].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('USB 封堵情况')}}</div>
    <div>{{ dataForm.usbSituation || '-' }}</div>
  </div>
  <div class="mb-6" v-if="dataForm.assetTypeCode && [25].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('备份方式')}}</div>
    <div>{{ dataForm.restoreWay || '-' }}</div>
  </div>
  <div class="mb-6" v-if="dataForm.assetTypeCode && [25].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('备份周期')}}</div>
    <div>{{ dataForm.restoreCycle || '-' }}</div>
  </div>
  <div class="mb-6" v-if="dataForm.assetTypeCode && [25].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('备份介质')}}</div>
    <div>{{ dataForm.restoreMedium || '-' }}</div>
  </div>
  <div class="mb-6"
    v-if="dataForm.assetTypeCode && [5, 8, 9, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('管理协议')}}</div>
    <div>{{ dataForm.manageProtocol || '-' }}</div>
  </div>
  <div class="mb-6" v-if="dataForm.assetTypeCode && [67, 68, 69, 70, 71, 72, 73, 74].includes(dataForm.assetTypeCode)">
    <div class="text-color-text-label">{{t('工作方式')}}</div>
    <div>{{ dataForm.workingWay || '-' }}</div>
  </div>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { IAsset } from '@guolisec/types';
/* 第三方模块 */
import { Asset } from '@guolisec/utils';
/* 本地模块 */
import { t } from '@/entry/languages/useLanguage'
/* 组件 */

const dataForm = defineModel<Partial<IAsset>>('asset', {
  required: true,
  default() {
    return new Asset()
  }
})

const systemLevelOptions = [
  {
    label: t('未知系统级别'),
    value: 0,
  },
  {
    label: t('一级系统'),
    value: 1,
  },
  {
    label: t('二级系统'),
    value: 2,
  },
  {
    label: t('三级系统'),
    value: 3,
  },
  {
    label: t('四级系统'),
    value: 4,
  },
  {
    label: t('五级系统'),
    value: 5,
  },
]
</script>