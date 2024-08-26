<template>
  <Card :title="t('资产监测项')" v-if="supportMonitorTypes.includes(asset.assetTypeCode)">
    <RunLogsPlc v-if="asset.assetTypeCode === 1" />
    <PortStatusSwitch v-if="asset.assetTypeCode === 8" />
  </Card>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import { useAssetInfoStore } from '@/entry/store';
import Card from '@/shared/components/Card.vue';
import RunLogsPlc from '@/domains/log/views/RunLogsPlc.vue'
import PortStatusSwitch from '@/domains/port/views//PortStatusSwitch.vue'
import { t } from "@/entry/languages/useLanguage";

const { asset } = useAssetInfoStore()

// 1:plc 3:主机 8: 交换机
const supportMonitorTypes = ref([1, 8])
</script>