<!--
 * @name: 资产信息
 * @description: 资产字段展示
-->
<template>
  <div class="grid grid-cols-6 gap-4" label-align="left" layout="vertical">
    <div>
      <div class="text-color-text-label">IP</div>
      <div class="truncate">{{ asset.assetIp }}</div>
    </div>
    <div>
      <div class="text-color-text-label">MAC</div>
      <div class="truncate">{{ asset.assetMac }}</div>
    </div>
    <div>
      <div class="text-color-text-label">{{ t('资产类型') }}</div>
      <div class="truncate">{{ asset.assetTypeName || '-' }}</div>
    </div>
    <div>
      <div class="text-color-text-label">{{ t('资产品牌') }}</div>
      <div class="truncate">{{ asset.trademarkName || '-' }}</div>
    </div>
    <div>
      <div class="text-color-text-label">{{ t('资产系列') }}</div>
      <div class="truncate">{{ asset.assetSeriesNameLong || '-' }}</div>
    </div>
    <div
      v-if="asset.assetTypeCode === 1 || asset.assetTypeCode === 8 || asset.assetTypeCode === 14 || asset.assetTypeCode === 45">
      <div class="text-color-text-label">{{ t('资产型号') }}</div>
      <div class="truncate">{{ asset.hardwareModel || '-' }}</div>
    </div>

    <div v-if="asset.assetTypeCode && [10, 11, 12, 13, 16, 19, 23, 27, 28, 29, 45].includes(asset.assetTypeCode)">
      <div>
        <div class="text-color-text-label">{{ t('硬件序列号') }}</div>
        <div class="truncate">{{ asset.sn || '-' }}</div>
      </div>
    </div>
    <div>
      <div class="text-color-text-label">{{ t('资产组') }}</div>
      <div class="truncate">{{ asset.assetGroup ? asset.assetGroup.label : '-' }}</div>
    </div>
    <div v-if="isShowByFeature('asset-field')">
      <div class="text-color-text-label">{{ t('资产域') }}</div>
      <div class="truncate">{{ asset?.assetField?.name ?? '-' }}</div>
    </div>
    <div v-if="isShowByFeature('safe-field')">
      <div class="text-color-text-label">{{ t('安全域') }}</div>
      <div class="truncate">{{ asset?.safeField?.name || '-' }}</div>
    </div>
    <!-- 1, 2, 17, 30, 3, 25: PLC DCS 主机 SIS 服务器 工作站 -->
    <div v-if="asset.assetTypeCode && ![1, 2, 17, 30, 3, 25].includes(asset.assetTypeCode)">
      <div class="text-color-text-label">{{ t('软件版本') }}</div>
      <div class="truncate">{{ asset.softwareVersion || '-' }}</div>
    </div>
    <div>
      <div class="text-color-text-label">{{ t('所处位置') }}</div>
      <div class="truncate">{{ asset.assetLocation || '-' }}</div>
    </div>
    <div>
      <div class="text-color-text-label">{{ t('运行状态') }}</div>
      {{ runStatusText }}
    </div>
    <div>
      <div class="text-color-text-label">{{ t('入网时间') }}</div>
      <div class="truncate">{{ createTimeText }}</div>
    </div>
    <div v-if="asset.assetTypeCode === 1">
      <div class="text-color-text-label">{{ t('重要程度') }}</div>
      <div>{{ importanceText }}</div>
    </div>
    <div>
      <div class="text-color-text-label">{{ t('责任部门') }}</div>
      <div class="truncate">{{ asset.security || '-' }}</div>
    </div>
    <div v-if="asset.assetTypeCode && [3, 25].includes(asset.assetTypeCode)">
      <div class="text-color-text-label">{{ t('操作系统') }}</div>
      <div class="w-55 overflow-ellipsis truncate" :title="asset.os">{{ asset.os || '-' }}</div>
    </div>

    <div v-if="asset.assetTypeCode && [11].includes(asset.assetTypeCode)">
      <div class="text-color-text-label">{{ t('HTTP 端口') }}</div>
      <div>{{ asset.port || '-' }}</div>
    </div>
    <ExtraProperites :asset="asset" v-if="isShowByFeature('asset::info::extra-props')" />
  </div>
</template>
<script setup lang="ts">
/* 类型文件 */
/* 第三方模块 */
import { computed } from 'vue'
import { formatToDateTime } from '@guolisec/utils';
/* 本地模块 */
import { isShowByFeature } from '@/entry/features/useContext'
import { useAssetInfoStore } from '@/entry/store';
import ExtraProperites from './ExtraProperites.vue'
import { t } from '@/entry/languages/useLanguage'

const { asset } = useAssetInfoStore()

// 重要程度
const importanceText = computed(() => {
  return asset.importance !== undefined ? [t('普通'), t('重要')][asset.importance || 0] : '-'
})

// 设备运行状态
const runStatusText = computed(() => {
  return asset.runStatus !== undefined ? [t('离线'), t('在线'), t('闲置')][asset.runStatus || 0] : '-'
})

// 入网时间
const createTimeText = computed(() => {
  return typeof asset.createTime === 'string' && Boolean(asset.createTime) ? formatToDateTime(asset.createTime) : '-'
})
</script>

<style scoped>
.text-color-text-label {
  color: var(--color-text-label)
}
</style>