<!--
 * @name: 根组件
 * @description: Do not edit
 * @date: 2023-02-03 09:00:30
 * @path: \vue-package-quickstart\test\app.vue
-->
<template>
  <config-provider :locale="zhCN">
    <router-view />
  </config-provider>
</template>

<script lang="ts" setup>
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useDocumentTitle } from '@guolisec/utils'

useDocumentTitle()
</script>

