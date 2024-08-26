<!--
 * @name: 资产运行状态选择框
 * @description: Do not edit
 * @path: \feature-vue\platform\front\asset\src\views\form\SelectRunStatus.vue
-->
<template>
  <Select class="min-w-40" v-model:value="runStatus" :options="options" placeholder="选择运行状态" allowClear
    :filter-option="filterOption" show-search />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'ant-design-vue'
import { DefaultOptionType } from 'ant-design-vue/es/select';
import { filterOption } from '@guolisec/utils';

const runStatus = defineModel<number>('value')
const options = ref<DefaultOptionType[]>([
  {
    label: '离线',
    value: 0,
  },
  {
    label: '在线',
    value: 1,
  },
  // todo: 资产健康监测中没有闲置状态,之后需要做兼容
  // {
  //   label: '闲置',
  //   value: 2,
  // },
])
</script>