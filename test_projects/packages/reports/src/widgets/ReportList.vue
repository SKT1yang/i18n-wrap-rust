<!--
 * @name: 资产详情
 * @description: Do not edit
 * @path: \assets-detail\src\views\ModalAssetDetail\index.vue
-->
<template>
  <Report />
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue';
/* 本地模块 */
import Report from '../views/list/index.vue'
import { provideReportContext, type Features } from '../entry/features/useContext'

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

provideReportContext({
  hiddenFeatures: props.hiddenFeatures,
  closeFeatures: props.closeFeatures,
})

</script>