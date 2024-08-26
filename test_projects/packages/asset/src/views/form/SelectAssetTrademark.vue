<!--
 * @name: 资产品牌和系列复合选择组件
 * @description: 品牌和系列联动选择
-->
<template>
  <Select v-model:value="trademarkCode" :options="trademarkCodeOptions" :filter-option="filterOption" show-search
    placeholder="选择资产品牌" class="w-full" />
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { IAssetTrademark } from '@guolisec/types';
import { ref, watchEffect } from 'vue'
import { Select } from 'ant-design-vue'
import { filterOption } from '@guolisec/utils';
import { getAssetBrandsApi } from '@/model/list'
import { DefaultOptionType } from 'ant-design-vue/es/select';

const props = defineProps({
  options: {
    type: Array as PropType<IAssetTrademark[]>
  }
})

const trademarkCode = defineModel<number>('trademarkCode')
const trademarkCodeOptions = ref<DefaultOptionType[]>([])

async function getAssetBrands() {
  const { content } = await getAssetBrandsApi()
  trademarkCodeOptions.value = transfer(content)
}

watchEffect(() => {
  // options 就算是异步获取的，也必须给与初始值 [], 否则直接接口获取
  if (props.options) {
    trademarkCodeOptions.value = transfer(props.options)
  } else {
    getAssetBrands()
  }
})

function transfer(content: IAssetTrademark[]) {
  return content.map((item) => {
    return {
      label: item.trademarkName,
      value: item.trademarkCode,
      assetDicts: item.assetDicts
    }
  })
}
</script>