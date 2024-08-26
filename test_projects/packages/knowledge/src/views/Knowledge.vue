<!--
 * @name:  包含事件库、自定义库和漏洞库的tab页
 * @description: Do not edit
 * @date: 2023-09-20 14:07:53
 * @path: \knowledge\src\views\KnowledgePage.vue
-->
<template>
  <Tabs destroy-inactive-tab-pane>
    <TabPane tab="事件库" key="1">
      <EventStore />
    </TabPane>
    <TabPane tab="自定义库" key="2">
      <EventStore :config="{ type: 'custom' }" />
    </TabPane>
    <TabPane tab="漏洞库" key="3">
      <VulStore />
    </TabPane>
  </Tabs>
</template>

<script lang="ts" setup>
import { Tabs, TabPane } from 'ant-design-vue'
import EventStore from './eventStore/EventStore.vue';
import VulStore from './VulStore.vue'
</script>