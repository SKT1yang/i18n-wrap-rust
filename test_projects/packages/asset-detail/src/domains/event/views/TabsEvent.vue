<!--
 * @Name: 资产事件
 * @Description: Do not edit
-->
<template>
  <Tabs destroy-inactive-tab-pane class="bg-[--color-bg-base] p-4 min-h-190">
    <TabPane key="Session" :tab="t('会话信息')">
      <Session />
    </TabPane>
    <TabPane key="IcEvent" :tab="t('工控事件')">
      <Event event-type="1001" :api="getIcEventEsResultVoListApi" :columns="IcEventColumns" />
    </TabPane>
    <TabPane key="NetEvent" :tab="t('网络事件')">
      <Event event-type="1004" :api="getNetEventEsResultVoListApi" :columns="NetEventColumns" />
    </TabPane>
    <TabPane key="IdsEvent" :tab="t('攻击事件')">
      <Event event-type="1002" :api="getIdsEventEsResultVoListApi" :columns="IdsEventColumns" />
    </TabPane>
  </Tabs>
</template>
<script setup lang="ts">
import { Tabs, TabPane } from 'ant-design-vue';
import Session from '../../session/views/Session.vue';
import Event from '../views/Event.vue';
import { getIcEventEsResultVoListApi, getIdsEventEsResultVoListApi, getNetEventEsResultVoListApi } from '../model/event';
import {
  IcEventColumns,
  NetEventColumns,
  IdsEventColumns
} from '../views/event.data'
import { t } from '@/entry/languages/useLanguage'
</script>
