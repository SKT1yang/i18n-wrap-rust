<!--
 * @name: 资产系列选择组件
 * @description: 
 * @path: \feature-vue\platform\front\asset\src\views\form\SelectAssetSeries.vue
-->
<template>
  <Select v-model:value="assetSeriesCode" :options="assetSeriesCodeOptions" :filter-option="filterOption" show-search
    placeholder="选择资产系列" />
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { IAssetTrademark } from '@guolisec/types';
import { ref, watch } from 'vue'
import { Select } from 'ant-design-vue'
import { filterOption, onMountedOrActivated } from '@guolisec/utils';
import { getAssetBrandsApi } from '@/model/list'
import { DefaultOptionType } from 'ant-design-vue/es/select';

const props = defineProps({
  options: {
    type: Array as PropType<IAssetTrademark[]>
  },
})
// 位置不能动
let isFetch = false

const trademarkCode = defineModel<number>('trademarkCode')
const trademarkCodeOptions = ref<DefaultOptionType[]>([])

const assetSeriesCode = defineModel<number>('assetSeriesCode')
const assetSeriesCodeOptions = ref<DefaultOptionType[]>([])

onMountedOrActivated(async () => {
  init()
})

watch([trademarkCode, () => props.options], () => {
  init()
})

async function getAssetBrands() {
  isFetch = true
  const { content } = await getAssetBrandsApi()
  trademarkCodeOptions.value = transfer(content)
}

async function init() {
  // options 就算是异步获取的，也必须给与初始值 [], 否则直接接口获取
  if (props.options) {
    trademarkCodeOptions.value = transfer(props.options)
  } else {
    !isFetch && await getAssetBrands()
  }
  if (trademarkCode.value !== undefined) {
    const option = trademarkCodeOptions.value.find((item) => {
      return item.value === trademarkCode.value
    })
    if (option) {
      assetSeriesCodeOptions.value = option.assetDicts.map((item) => {
        return {
          label: item.assetSeriesName,
          value: item.assetSeriesCode,
        }
      })
    } else {
      assetSeriesCodeOptions.value = []
    }
    // 如果当前系列不在选项中，初始化资产系列
    const target = assetSeriesCodeOptions.value.find((item) => {
      return item.value === assetSeriesCode.value
    })

    if (assetSeriesCodeOptions.value.length > 0 && target === undefined) {
      assetSeriesCode.value = undefined
    }
  }
}

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