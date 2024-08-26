<!--
 * @name: 离线资产
 * @description: Do not edit
-->
<template>
  <TableAsset :run-status="0" :hidden-features="hiddenFeatures"></TableAsset>
</template>

<script lang='ts' setup>
import type { PropType } from 'vue'
import type { Features, Feature } from '../context/useListContext'
import { computed } from 'vue'
import TableAsset from '../TableAsset.vue'

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

const hiddenFeatures = computed(() => {
  const ASSET_RUN_STATUS: Feature = 'asset::run-status'
  let result = [ASSET_RUN_STATUS, ...props.hiddenFeatures]
  result = Array.from(new Set(result))
  return result
})
</script>