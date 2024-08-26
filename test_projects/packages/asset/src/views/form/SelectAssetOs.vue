<!--
 * @name: 资产操作系统选择框
 * @description: Do not edit
 * @path: \feature-vue\platform\front\asset\src\views\form\SelectAssetOs.vue
-->
<template>
  <Select class="min-w-40" v-model:value="os" :options="options" placeholder="选择操作系统" allowClear
    :filter-option="filterOption" show-search />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'ant-design-vue'
import { onMountedOrActivated, filterOption } from '@guolisec/utils';
import { getAssetOsListApi } from '@/model/list'
import { DefaultOptionType } from 'ant-design-vue/es/select';

const os = defineModel<string>('value')
const options = ref<DefaultOptionType[]>([])

onMountedOrActivated(async () => {
  const temp = await getAssetOsListApi()
  options.value = temp.map((os) => {
    return {
      label: os,
      value: os
    }
  })
})
</script>