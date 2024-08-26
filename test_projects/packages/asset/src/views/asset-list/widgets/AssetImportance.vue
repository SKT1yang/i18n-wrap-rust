<!--
 * @name: 关键资产
 * @description: Do not edit
-->
<template>
  <TableAsset :importance="1" :hidden-features="hiddenFeatures"></TableAsset>
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
  const ASSET_IMPORTANCE: Feature = 'asset::importance'
  let result = [ASSET_IMPORTANCE, ...props.hiddenFeatures]
  result = Array.from(new Set(result))
  return result
})
</script>