<!--
 * @name: 根组件
 * @description: Do not edit
 * @date: 2023-02-03 09:00:30
 * @path: \vue-package-quickstart\src\app.vue
-->
<template>
  <AppProvider>
    <router-view />
  </AppProvider>
</template>

<script lang="ts" setup>
import { useDocumentTitle } from '@guolisec/utils'
/* 本地模块 */
import AppProvider from './shared/components/AppProvider.vue'

useDocumentTitle()
</script>

