<template>
  <table class="w-full border-collapse">
    <tr class="bg-[whitesmoke] text-left">
      <th class="h-9">资产IP</th>
      <th>资产Mac</th>
      <th>资产名称</th>
      <th>资产类型</th>
      <th>资产品牌</th>
      <th>资产系列</th>
    </tr>
    <tr v-for="(asset) in props.dataList" :key="asset.id" :class="rowStyle(asset)">
      <td class="h-8" :class="asset.assetIpMark ? 'text-#ff4d4f' : ''">{{ asset.assetIp }}</td>
      <td :class="asset.assetMacMark ? 'text-#ff4d4f' : ''">{{ asset.assetMac }}</td>
      <td :class="asset.nameMark ? 'text-#ff4d4f' : ''">{{ asset.name }}</td>
      <td :class="asset.assetTypeNameMark ? 'text-#ff4d4f' : ''">{{ asset.assetTypeName }}</td>
      <td :class="asset.trademarkNameMark ? 'text-#ff4d4f' : ''">{{ asset.trademarkName }}</td>
      <td :class="asset.assetSeriesNameMark ? 'text-#ff4d4f' : ''">{{ asset.assetSeriesName }}</td>
    </tr>
  </table>
</template>

<script lang='ts' setup>
import type { PropType } from 'vue'
import type { CompareAsset } from './types'

/********************** 外部状态和配置 **********************/



const props = defineProps({
  dataList: {
    type: Array as PropType<CompareAsset[]>,
    default() {
      return []
    }
  }
});

const rowStyle = (row) => {
  if (!row.assetIp && !row.assetMac && !row.name && !row.assetTypeName && !row.assetSeriesName) {
    return 'bg-#e5e5e5'
  } else if (row.rowMark) {
    return 'bg-#fff2f0'
  } else {
    return null
  }
}
</script>