<!--
 * @name: 资产清单
 * @description: Do not edit
-->
<template>
  <div class="w-[100%] p-2 asset-manager-back-gray">
    <Tabs v-model:active-key="tabsKey">
      <TabPane :key="1" :tab="t('注册资产')">
        <AssetRegistered :hidden-features="props.hiddenFeatures" />
      </TabPane>
      <TabPane :key="0" :tab="t('离线资产')">
        <AssetOffline :hidden-features="props.hiddenFeatures" />
      </TabPane>
      <TabPane :key="2" :tab="t('闲置资产')">
        <AssetIdle :hidden-features="props.hiddenFeatures" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script lang='ts' setup>
import type { PropType } from 'vue'
import { type Features } from '../context/useListContext'
import { ref } from "vue"
import {
  Tabs, TabPane,
} from "ant-design-vue"
import AssetRegistered from "./AssetRegistered.vue";
import AssetOffline from "./AssetOffline.vue";
import AssetIdle from "./AssetIdle.vue";
import { t } from '@/languages/useLanguage'

const tabsKey = ref(1) // 值为资产状态

// 父组件传值
const props = defineProps({
  mergeAsset: {
    type: Boolean,
    default: true,
  },
  hiddenFeatures: {
    type: Object as PropType<Features>,
    default: () => []
  },
  closeFeatures: {
    type: Object as PropType<Features>,
    default: () => []
  },
});
</script>