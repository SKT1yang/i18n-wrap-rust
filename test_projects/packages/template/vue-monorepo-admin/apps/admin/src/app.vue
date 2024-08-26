<!--
 * @name: 根组件
 * @description: Do not edit
-->

<script lang="ts" setup>
/* 第三方模块 */
import { useMonitor } from '@guolisec/permission'
/* 本地模块 */
import AppProvider from './shared/components/AppProvider.vue'

// 用户行为监测
useMonitor()
</script>

<template>
  <AppProvider>
    <router-view />
  </AppProvider>
</template>
