<!--
 * @Name: 服务器详情
 * @Description: Do not edit
-->

<template>
  <Tabs v-model:active-key="activeKey" centered destroy-inactive-tab-pane @change="handleChange">
    <TabPane key="overview" :tab="t('资产概览')">
      <Overview />
    </TabPane>
    <TabPane key="info" :tab="t('设备信息')" v-if="hasLicense">
      <Container class="bg-[--color-bg-base] space-y-4">
        <RunStatusServer />
        <HardwareInfoHost />
        <OsInformation />
      </Container>
    </TabPane>
    <TabPane key="internetworking" :tab="t('网络互联')" v-if="hasLicense">
      <Container class="bg-[--color-bg-base] space-y-4">
        <FirewallInformation />
        <Internetworking />
      </Container>
    </TabPane>
    <TabPane key="database" :tab="t('数据库')" v-if="hasLicense">
      <Container class="bg-[--color-bg-base]">
        <Database />
      </Container>
    </TabPane>
    <TabPane key="log" :tab="t('日志信息')" v-if="hasLicense">
      <Container class="bg-[--color-bg-base] space-y-4">
        <FileTamperRecords />
        <USBRecords />
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
      <Container>
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
<script setup lang="ts">
/* 第三方模块 */
import { onMounted, ref } from 'vue';
import { Tabs, TabPane } from 'ant-design-vue';
/* 本地模块 */
import { t } from "@/entry/languages/useLanguage";
/* 组件 */
import Overview from '@/widgets/Overview.vue';
import Flow from '@/domains/session/views/flow/Flow.vue';
import TabsEvent from '@/domains/event/views/TabsEvent.vue';
import Vul from '@/domains/vul/views/Vul.vue';
import AssetRelation from '@/domains/relation/views/AssetRelation.vue';
import Container from '@/shared/components/Container.vue';
import LayoutPageHeader from './LayoutPageHeader.vue';
import RightExtra from './RightExtra.vue';
import HardwareInfoHost from '@/domains/hardware/views/host/HardwareInfoHost.vue'
import OsInformation from '@/domains/app/views/OsInformation.vue'
import USBRecords from '@/domains/log/views/USBRecords.vue';
import Internetworking from '@/domains/session/views/internetworking/Internetworking.vue';
import Database from '@/domains/database/views/Database.vue';
import FirewallInformation from '@/domains/firewall/views/FirewallInformation.vue';
import FileTamperRecords from '@/domains/log/views/FileTamperRecords.vue'
import RunStatusServer from '@/domains/hardware/views/host/RunStatusHost.vue';
/* api */
import { getLicenseAsset } from '@/domains/app/model'
/* hook */
import { useAssetInfoStore } from '@/entry/store';
import { useTabsSwitch } from '@/entry/features/useTabsSwitch'
import { isShowByFeature } from '@/entry/features/useContext.ts'

const { asset } = useAssetInfoStore()

const { activeKey, handleChange } = useTabsSwitch(["overview", "flow", "event", "vul", "relation", "info", "database", "log", "internetworking"])

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


onMounted(() => {
  getLicenseAssetData()
})
</script>

<style scoped>
.ant-tabs-top> :deep(.ant-tabs-nav) {
  margin: 0
}
</style>
