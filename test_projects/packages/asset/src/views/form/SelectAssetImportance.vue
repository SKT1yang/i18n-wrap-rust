<!--
 * @name: 资产重要程度选择框
 * @description: Do not edit
 * @path: \feature-vue\platform\front\asset\src\views\form\SelectAssetImportance.vue
-->
<template>
  <Select class="min-w-40" v-model:value="importance" :options="options" placeholder="选择重要程度" allowClear
    :filter-option="filterOption" show-search />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'ant-design-vue'
import { DefaultOptionType } from 'ant-design-vue/es/select';
import { filterOption } from '@guolisec/utils';

const importance = defineModel<number>('value')
const options = ref<DefaultOptionType[]>([
  {
    label: '重要',
    value: 1,
  },
  {
    label: '普通',
    value: 0,
  },
])
</script>