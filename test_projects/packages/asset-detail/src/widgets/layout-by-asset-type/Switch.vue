<!--
 * @Name: 交换机详情
 * @Description: Do not edit
-->
<template>
  <Tabs v-model:active-key="activeKey" centered destroy-inactive-tab-pane @change="handleChange">
    <TabPane key="overview" :tab="t('资产概览')">
      <Overview />
    </TabPane>
    <TabPane key="info" :tab="t('设备信息')" v-if="hasLicense">
      <Container class="bg-[--color-bg-base]">
        <PortInfoSwitch />
      </Container>
    </TabPane>
    <TabPane key="visualize" :tab="t('资产可视化')" v-if="isShowByFeature('visualize::switch')">
      <Container class="bg-[--color-bg-base]">
        <VisualizeSwitch />
      </Container>
    </TabPane>
    <TabPane key="flow" :tab="t('日志信息')" v-if="hasLicense">
      <Container class="bg-[--color-bg-base]">
        <ErrorLogsSwitch />
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
import VisualizeSwitch from '@/domains/visualize/views/switch/VisualizeSwitch.vue';
import TabsEvent from '@/domains/event/views/TabsEvent.vue';
import Vul from '@/domains/vul/views/Vul.vue';
import AssetRelation from '@/domains/relation/views/AssetRelation.vue';
import PortInfoSwitch from '@/domains/port/views/PortInfoSwitch.vue';
import Container from '@/shared/components/Container.vue';
import LayoutPageHeader from './LayoutPageHeader.vue';
import RightExtra from './RightExtra.vue';
import { useTabsSwitch } from '@/entry/features/useTabsSwitch'
import { isShowByFeature } from '@/entry/features/useContext'
import { t } from "@/entry/languages/useLanguage";
import ErrorLogsSwitch from '@/domains/log/views/ErrorLogsSwitch.vue';
import { getLicenseAsset } from '@/domains/app/model'
import { useAssetInfoStore } from '@/entry/store';
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

const { activeKey, handleChange } = useTabsSwitch(["overview", "info", "visualize", "flow", "event", "vul", "relation"])

onMounted(() => {
  getLicenseAssetData()
})
</script>

<style scoped>
.ant-tabs-top> :deep(.ant-tabs-nav) {
  margin: 0
}
</style>