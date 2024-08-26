<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-26 10:20:39
 * @path: \system\src\views\upgrade\index.vue
-->
<template>
  <Tabs v-model:active-key="activeKey">
    <TabPane tab="系统升级" key="SystemUpgrade">
      <SystemUpgrade />
    </TabPane>
    <slot></slot>
  </Tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Tabs, TabPane } from 'ant-design-vue';
import SystemUpgrade from './SystemUpgrade.vue'

const activeKey = ref('SystemUpgrade')
</script>