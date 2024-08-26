<!--
 * @name: 资产扫描时能需要特别配置的字段
 * @description: 其实就是鞍钢项目的定制字段
-->
<template>
  <FormItem name="systemLevel" :label="t('所属系统级别')"
    v-if="dataForm.assetTypeCode && [1, 2, 3, 4, 5, 8, 9, 10, 11, 17, 25, 31, 35, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74].includes(dataForm.assetTypeCode)">
    <Select class=" min-w-20" v-model:value="dataForm.systemLevel" :options="systemLevelOptions"
      :placeholder="t('选择所属系统级别')" allowClear />
  </FormItem>
  <FormItem name="systemName" :label="t('所属系统名称')"
    v-if="dataForm.assetTypeCode && [1, 2, 3, 4, 5, 8, 9, 10, 11, 17, 18, 25, 31, 35, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.systemName" :maxlength="50" :placeholder="t('所属系统名称')" autocomplete="off" />
  </FormItem>
  <FormItem name="serverType" :label="t('服务器结构类型')"
    v-if="dataForm.assetTypeCode && [25].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.serverType" :maxlength="50" :placeholder="t('服务器结构类型')" autocomplete="off" />
  </FormItem>
  <FormItem name="redundancy" :label="t('冗余情况')" v-if="dataForm.assetTypeCode && [25].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.redundancy" :maxlength="50" :placeholder="t('冗余情况')" autocomplete="off" />
  </FormItem>
  <FormItem name="databaseVersion" :label="t('数据库版本')"
    v-if="dataForm.assetTypeCode && [25, 4, 10, 11].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.databaseVersion" :maxlength="50" :placeholder="t('数据库版本')" autocomplete="off" />
  </FormItem>
  <FormItem name="mainSoftware" :label="t('主要软件')"
    v-if="dataForm.assetTypeCode && [25, 3, 4, 10, 11, 31].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.mainSoftware" :maxlength="50" :placeholder="t('主要软件')" autocomplete="off" />
  </FormItem>
  <FormItem name="protectSoftwareType" :label="t('防护软件类型')"
    v-if="dataForm.assetTypeCode && [25, 3, 4, 10, 11, 31].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.protectSoftwareType" :maxlength="50" :placeholder="t('防护软件类型')"
      autocomplete="off" />
  </FormItem>
  <FormItem name="protectSoftwareName" :label="t('防护软件名称')"
    v-if="dataForm.assetTypeCode && [25, 3, 4, 10, 11, 31].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.protectSoftwareName" :maxlength="50" :placeholder="t('防护软件名称')"
      autocomplete="off" />
  </FormItem>
  <FormItem name="usbSituation" :label="t('USB 封堵情况')"
    v-if="dataForm.assetTypeCode && [25, 3, 4, 10, 11, 31].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.usbSituation" :maxlength="50" :placeholder="t('USB 封堵情况')" autocomplete="off" />
  </FormItem>
  <FormItem name="restoreWay" :label="t('备份方式')" v-if="dataForm.assetTypeCode && [25].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.restoreWay" :maxlength="50" :placeholder="t('备份方式')" autocomplete="off" />
  </FormItem>
  <FormItem name="restoreCycle" :label="t('备份周期')" v-if="dataForm.assetTypeCode && [25].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.restoreCycle" :maxlength="50" :placeholder="t('备份周期')" autocomplete="off" />
  </FormItem>
  <FormItem name="restoreMedium" :label="t('备份介质')"
    v-if="dataForm.assetTypeCode && [25].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.restoreMedium" :maxlength="50" :placeholder="t('备份介质')" autocomplete="off" />
  </FormItem>
  <FormItem name="manageProtocol" :label="t('管理协议')"
    v-if="dataForm.assetTypeCode && [5, 8, 9, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.manageProtocol" :maxlength="50" :placeholder="t('管理协议')" autocomplete="off" />
  </FormItem>
  <FormItem name="workingWay" :label="t('工作方式')"
    v-if="dataForm.assetTypeCode && [67, 68, 69, 70, 71, 72, 73, 74].includes(dataForm.assetTypeCode)">
    <Input v-model:value.trim="dataForm.workingWay" :maxlength="50" :placeholder="t('工作方式')" autocomplete="off" />
  </FormItem>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { IAsset } from '@guolisec/types';
import { DefaultOptionType } from 'ant-design-vue/es/select';
/* 第三方模块 */
import { ref } from 'vue';
import { FormItem, Input, Select } from 'ant-design-vue';
import { Asset } from '@guolisec/utils';
/* 本地模块 */
import { t } from '@/languages/useLanguage'
/* 组件 */

const dataForm = defineModel<Partial<IAsset>>('value', {
  required: true,
  default() {
    return new Asset()
  }
})
const systemLevelOptions = ref<DefaultOptionType[]>([
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
])
</script>