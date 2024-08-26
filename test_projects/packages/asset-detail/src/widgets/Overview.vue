<!--
 * @name: 资产概览
 * @description: Do not edit
-->

<template>
  <Container class="grid grid-cols-4 grid-rows-5 gap-4">
    <!-- 基本信息 -->
    <Card class="col-span-4">
      <BasicInfo />
    </Card>
    <Card :title="t('资产信息')" class="col-span-4 row-span-2">
      <Properties />
    </Card>
    <!-- 运行状态 -->
    <RunStatus class="row-span-2" v-if="!([3, 31, 44, 25].includes(asset.assetTypeCode))" />
    <!-- 开放端口/服务 -->
    <OpenPort :class="!([3, 31, 44, 25].includes(asset.assetTypeCode)) ? '' : 'col-span-2'" class="row-span-2" />
    <!-- 资产监测项 -->
    <MonitorItems class="col-span-2 row-span-4" />
    <!-- 资产历史曲线 -->
    <UsageHistory class="col-span-2 row-span-2" v-if="!([3, 31, 44, 25].includes(asset.assetTypeCode))" />
  </Container>
</template>

<script lang='ts' setup>
import Card from '@/shared/components/Card.vue';
import Container from '@/shared/components/Container.vue';
import BasicInfo from '@/domains/asset/views/BasicInfo.vue';
import Properties from '@/domains/asset/views/Properties.vue';
import RunStatus from '@/domains/hardware/views/RunStatus.vue';
import OpenPort from '@/domains/port/views/OpenPort.vue'
import UsageHistory from '@/domains/hardware/views/history/UsageHistory.vue';
import MonitorItems from './MonitorItems.vue';
import { t } from "@/entry/languages/useLanguage";
import { useAssetInfoStore } from '@/entry/store';

const { asset } = useAssetInfoStore()
</script>