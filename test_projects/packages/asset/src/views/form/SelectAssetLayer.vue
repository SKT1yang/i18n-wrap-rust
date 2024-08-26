<!--
 * @name: 资产层级域选择框
 * @description: Do not edit
-->
<template>
  <Select class="min-w-40" v-model:value="layer" :options="options" placeholder="选择所在的层级位置" allowClear show-search
    :filter-option="filterOption" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'ant-design-vue'
import { filterOption } from '@guolisec/utils';
import { DefaultOptionType } from 'ant-design-vue/es/select';

const layer = defineModel<number>('value')
const options = ref<DefaultOptionType[]>([
  {
    value: 1,
    label: 'L1（基本控制层）'
  },
  {
    value: 2,
    label: 'L2（区域监控系统层）'
  },
  {
    value: 3,
    label: 'L3（现场运营层）'
  }
])
</script>