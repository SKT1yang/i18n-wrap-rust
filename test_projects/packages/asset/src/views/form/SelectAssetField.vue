<!--
 * @name: 资产域选择框
 * @description: Do not edit
 * @path: \feature-vue\platform\front\asset\src\views\form\SelectAssetField.vue
-->
<template>
  <Select class="min-w-40" v-model:value="fieldId" :options="options" placeholder="选择资产域" allowClear
    :filter-option="filterOption" show-search />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'ant-design-vue'
import { onMountedOrActivated, filterOption } from '@guolisec/utils';
import { getAssetFieldListApi } from '@/model/field'
import { DefaultOptionType } from 'ant-design-vue/es/select';

const fieldId = defineModel<string>('value')
const options = ref<DefaultOptionType[]>([])

onMountedOrActivated(async () => {
  const temp = await getAssetFieldListApi({})
  options.value = temp.map((i) => {
    return {
      label: i.name,
      value: i.id
    }
  })
})
</script>