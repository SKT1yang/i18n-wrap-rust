<!--
 * @name: 资产安全域选择框
 * @description: Do not edit
 * @path: \feature-vue\platform\front\asset\src\views\form\SelectAssetSafeField.vue
-->
<template>
  <Select class="min-w-40" v-model:value="safeFieldId" :options="options" placeholder="选择安全域" allowClear
    :filter-option="filterOption" show-search />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'ant-design-vue'
import { onMountedOrActivated, filterOption } from '@guolisec/utils';
import { getSafeFieldApi } from '@/model/safeField'
import { DefaultOptionType } from 'ant-design-vue/es/select';

const safeFieldId = defineModel<string>('value')
const options = ref<DefaultOptionType[]>([])

onMountedOrActivated(async () => {
  const temp = await getSafeFieldApi({})
  options.value = temp.map((i) => {
    return {
      label: i.name,
      value: i.id
    }
  })
})
</script>