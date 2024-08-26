<!--
 * @name: 资产类型选择框
 * @description: Do not edit
 * @path: \feature-vue\platform\front\asset\src\views\form\SelectAssetType.vue
-->
<template>
  <Select class="min-w-40" v-model:value="assetTypeCode" :options="options" :filter-option="filterOption" show-search
    placeholder="选择资产类型" @change="handleChange" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'ant-design-vue'
import { onMountedOrActivated, filterOption } from '@guolisec/utils';
import { getAssetTypeApi } from '@/model/list'
import { DefaultOptionType } from 'ant-design-vue/es/select';

const assetTypeCode = defineModel<number>('value')
const emit = defineEmits(['change'])

const options = ref<DefaultOptionType[]>([])

onMountedOrActivated(async () => {
  const temp = await getAssetTypeApi()
  options.value = temp.map((i) => {
    return {
      label: i.assetTypeName,
      value: i.assetTypeCode
    }
  })
})

function handleChange(value, option) {
  emit('change', value, option);
}
</script>