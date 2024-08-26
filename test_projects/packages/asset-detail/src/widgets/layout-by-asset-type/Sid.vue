<!--
 * @name: 安全隔离类 
 * @description: assetTypeCode: 38
-->
<template>
  <Tabs v-model:active-key="activeKey" centered destroy-inactive-tab-pane @change="handleChange">
    <TabPane key="overview" :tab="t('资产概览')">
      <Overview />
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
import LayoutPageHeader from './LayoutPageHeader.vue';
import RightExtra from './RightExtra.vue';
import { useTabsSwitch } from '@/entry/features/useTabsSwitch'
import { t } from "@/entry/languages/useLanguage";

const { activeKey, handleChange } = useTabsSwitch(["overview", "flow", "event", "vul", "relation"])

</script>

<style scoped>
.ant-tabs-top> :deep(.ant-tabs-nav) {
  margin: 0
}
</style>
