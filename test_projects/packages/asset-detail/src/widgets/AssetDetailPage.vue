<!--
 * @name: 资产详情页面
 * @description: 其他页面通过跳转进入资产详情页面，参数默认通过history.state传递
 * @path: \assets-detail\src\views\ModalAssetDetail\index.vue
-->
<template>
  <AssetDetail :assetId="assetId" :related-asset-id="relatedAssetId" :time="createTime"
    :hiddenFeatures="props.hiddenFeatures" :closeFeatures="props.closeFeatures" />
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue';
/* 第三方模块 */
import { ref, watchEffect } from 'vue'
/* 本地模块 */
import AssetDetail from './AssetDetail.vue';
import { type Features } from '@/entry/features/useContext'

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

const assetId = ref()
const relatedAssetId = ref()
const createTime = ref<[string, string]>(['', ''])

watchEffect(async () => {
  // 优先从history.state
  const { id, relatedId, time } = history.state
  assetId.value = id
  relatedAssetId.value = relatedId
  createTime.value = time
})

</script>