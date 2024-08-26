<!--
 * @Name: PLC详情
 * @Description: Do not edit
-->
<template>
  <Tabs v-model:active-key="activeKey" centered destroy-inactive-tab-pane @change="handleChange">
    <TabPane key="overview" :tab="t('资产概览')">
      <Overview />
    </TabPane>
    <TabPane key="info" :tab="t('设备信息')" v-if="[65795, 65798, 65799, 327938].includes(assetSeriesCode) && hasLicense">
      <Container class="bg-[--color-bg-base]">
        <RunStatusPlc v-if="[65795, 65798, 65799].includes(assetSeriesCode)" />
        <DeviceInfo v-if="[327938].includes(assetSeriesCode)" />
      </Container>
    </TabPane>
    <TabPane key="visualize" :tab="t('资产可视化')" v-if="isShowByFeature('visualize::plc') && hasLicense">
      <Container class="bg-[--color-bg-base]">
        <VisualizePlc />
      </Container>
    </TabPane>
    <TabPane key="log" :tab="t('日志信息')" v-if="[65795, 65798, 65799, 327938].includes(assetSeriesCode) && hasLicense">
      <Container class="bg-[--color-bg-base]">
        <ErrorLogsPlc v-if="[65795, 65798, 65799].includes(assetSeriesCode)" />
        <ErrorLogsRockWellPlc v-if="[327938].includes(assetSeriesCode)" />
      </Container>
    </TabPane>
    <TabPane key="flow" :tab="t('资产流量')" v-if="isShowByFeature('session::flow')">
      <Container class="bg-[--color-bg-base]">
        <Flow />
      </Container>
    </TabPane>
    <TabPane key="event" :tab="t('资产事件')" v-if="isShowByFeature('event')">
      <Container>
        <TabsEvent />
      </Container>
    </TabPane>
    <TabPane key="vul" :tab="t('资产漏洞')" v-if="isShowByFeature('vul')">
      <Container class="bg-[--color-bg-base]">
        <Vul />
      </Container>
    </TabPane>
    <TabPane key="relation" :tab="t('资产关系')" v-if="isShowByFeature('relation')">
      <Container class="bg-[--color-bg-base]">
        <AssetRelation />
      </Container>
    </TabPane>
    <TabPane key="configuration" :tab="t('组态变更')" v-if="isShowByFeature('event::configuration-change')">
      <Container class="bg-[--color-bg-base]">
        <ConfigurationChangeEvent />
      </Container>
    </TabPane>
    <template #leftExtra>
      <LayoutPageHeader />
    </template>

    <template #rightExtra>
      <RightExtra />
    </template>

  </Tabs>
</template>
<script setup name="HostDetail" lang="ts">
/* 第三方模块 */
import { Tabs, TabPane } from 'ant-design-vue';
/* 本地模块 */
import Overview from '@/widgets/Overview.vue';
import VisualizePlc from '@/domains/visualize/views/plc/VisualizePlc.vue'
import Flow from '@/domains/session/views/flow/Flow.vue';
import TabsEvent from '@/domains/event/views/TabsEvent.vue';
import Vul from '@/domains/vul/views/Vul.vue';
import AssetRelation from '@/domains/relation/views/AssetRelation.vue';
import ConfigurationChangeEvent from '@/domains/event/views/ConfigurationChangeEvent.vue';
import ErrorLogsPlc from '@/domains/log/views/ErrorLogsPlc.vue';
import RunStatusPlc from '@/domains/hardware/views/plc/RunStatusPlc.vue';
import DeviceInfo from '@/domains/hardware/views/plc/DeviceInfo.vue';
import ErrorLogsRockWellPlc from '@/domains/log/views/ErrorLogsRockWellPlc.vue';
import Container from '@/shared/components/Container.vue';
import LayoutPageHeader from './LayoutPageHeader.vue';
import RightExtra from './RightExtra.vue';
import { useTabsSwitch } from '@/entry/features/useTabsSwitch.ts'
import { isShowByFeature } from '@/entry/features/useContext.ts'
import { t } from "@/entry/languages/useLanguage";
import { useAssetInfoStore } from '@/entry/store';
import { getLicenseAsset } from '@/domains/app/model'
import { onMounted, ref } from 'vue';

const { asset } = useAssetInfoStore()

/**
 * 判断是否有 license
 */
const hasLicense = ref(false)
async function getLicenseAssetData() {
  const { content } = await getLicenseAsset({
    assetIp: asset.assetIp, assetMac: asset.assetMac
  })
  hasLicense.value = content.length > 0
}

const { asset: { assetSeriesCode } } = useAssetInfoStore()

const { activeKey, handleChange } = useTabsSwitch(["overview", "info", "visualize", "log", "configuration", "flow", "event", "vul", "relation"])

onMounted(() => {
  getLicenseAssetData()
})
</script>
<style scoped>
.ant-tabs-top> :deep(.ant-tabs-nav) {
  margin: 0
}
</style>