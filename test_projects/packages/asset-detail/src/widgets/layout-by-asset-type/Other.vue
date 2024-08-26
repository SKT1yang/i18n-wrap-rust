<!--
 * @Name: 默认资产详情
 * @Description: 兜底显示
-->
<template>
  <Tabs v-model:active-key="activeKey" centered destroy-inactive-tab-pane @change="handleChange">
    <TabPane key="overview" :tab="t('资产概览')">
      <Overview />
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
<script setup name="HostDetail" lang="ts">
/* 第三方模块 */
import { Tabs, TabPane } from 'ant-design-vue';
/* 本地模块 */
import Overview from '@/widgets/Overview.vue';
import Flow from '@/domains/session/views/flow/Flow.vue';
import TabsEvent from '@/domains/event/views/TabsEvent.vue';
import Vul from '@/domains/vul/views/Vul.vue';
import AssetRelation from '@/domains/relation/views/AssetRelation.vue';
import RightExtra from './RightExtra.vue';
import Container from '@/shared/components/Container.vue';
import LayoutPageHeader from './LayoutPageHeader.vue';

import { useTabsSwitch } from '@/entry/features/useTabsSwitch.ts'
import { isShowByFeature } from '@/entry/features/useContext.ts'
import { t } from "@/entry/languages/useLanguage";

const { activeKey, handleChange } = useTabsSwitch(["overview", "flow", "event", "vul", "relation"])

</script>

<style scoped>
.ant-tabs-top> :deep(.ant-tabs-nav) {
  margin: 0
}
</style>