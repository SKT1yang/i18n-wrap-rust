<!--
 * @name: 资产详情
 * @description: Do not edit
 * @path: \assets-detail\src\views\ModalAssetDetail\index.vue
-->
<template>
  <div>
    <template v-if="spinning">
      <Spin :spinning="spinning">
        <Empty></Empty>
      </Spin>
    </template>
    <template v-else>
      <!-- PLC -->
      <Plc v-if="[1].includes(asset.assetTypeCode)" />
      <!-- 主机、操作站、工程师站 -->
      <Host v-else-if="[3, 31, 44].includes(asset.assetTypeCode)" />
      <!-- 服务器 -->
      <Server v-else-if="[25].includes(asset.assetTypeCode)" />
      <!-- 交换机 -->
      <Switch v-else-if="[8].includes(asset.assetTypeCode)" />
      <!-- 安全隔离 -->
      <Sid v-else-if="[38].includes(asset.assetTypeCode)" />
      <!-- 其他设备 -->
      <Other v-else />
    </template>
  </div>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue';
/* 第三方模块 */
import { ref, watchEffect } from 'vue'
import { Empty, Spin } from 'ant-design-vue';
/* 本地模块 */
import Host from './layout-by-asset-type/Host.vue';
import Plc from './layout-by-asset-type/Plc.vue';
import Switch from './layout-by-asset-type/Switch.vue';
import Other from './layout-by-asset-type/Other.vue';
import Sid from './layout-by-asset-type/Sid.vue';
import Server from './layout-by-asset-type/Server.vue';
import { useAssetInfoStore } from '@/entry/store';
import { provideAssetDetailContext, type Features } from '@/entry/features/useContext'

// 父组件传值
const props = defineProps({
  time: {
    type: Object as PropType<[string, string]>,
    default: () => []
  },
  assetId: {
    type: Number,
    require: true
  },
  // 和主资产直接连接的资产的id
  relatedAssetId: {
    type: Number,
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

provideAssetDetailContext({
  hiddenFeatures: props.hiddenFeatures,
  closeFeatures: props.closeFeatures,
})

const { asset, getAssetDetail, getRelationAssetDetail, setTime } = useAssetInfoStore()
const spinning = ref(false)

watchEffect(async () => {
  spinning.value = true
  try {
    if (props.time) {
      setTime(props.time)
    }
    if (props.assetId !== undefined && Boolean(props.assetId)) {
      await getAssetDetail(props.assetId)
    }

    if (props.relatedAssetId !== undefined && Boolean(props.relatedAssetId)) {
      await getRelationAssetDetail(props.relatedAssetId)
    }
  } finally {
    spinning.value = false
  }
})

</script>