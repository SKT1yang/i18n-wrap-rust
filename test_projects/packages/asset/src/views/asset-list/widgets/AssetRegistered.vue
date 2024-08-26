<!--
 * @name: 已注册资产
 * @description: Do not edit
-->
<template>
  <Spin :spinning="pageLoading">
    <div class="flex space-x-6">
      <TreeAssetGroup :hidden-features="props.hiddenFeatures" v-model:value="assetGroup" />
      <div class="flex-1 max-w-full overflow-x-auto">
        <TableAsset :hidden-features="props.hiddenFeatures" />
      </div>
    </div>
  </Spin>
</template>

<script lang='ts' setup>
import type { PropType } from 'vue'
import { Spin } from 'ant-design-vue';
import { type Features } from '../context/useListContext'
import { provide, ref } from 'vue';
import TreeAssetGroup from '../../asset-group/TreeAssetGroup.vue';
import TableAsset from '../TableAsset.vue'
import { IAssetGroupTreeItem } from '@guolisec/types'

// 父组件传值
const props = defineProps({
  hiddenFeatures: {
    type: Object as PropType<Features>,
    default: () => []
  },
  closeFeatures: {
    type: Object as PropType<Features>,
    default: () => []
  },
});

const assetGroup = ref<IAssetGroupTreeItem>()

provide('assetGroup', {
  assetGroup
})

// 资产组刷新数据时，将页面设为 loading 状态
const pageLoading = ref(false)

function changePageLoadingStatus(value: boolean) {
  pageLoading.value = value
}

provide('changePageLoadingStatus',
  changePageLoadingStatus
)
</script>