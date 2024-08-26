<!--
 * @name: 根组件
 * @description: Do not edit
 * @date: 2023-02-03 09:00:30
 * @path: \vue-package-quickstart\src\app.vue
-->
<template>
  <config-provider :locale="zhCN" :theme="{
    algorithm: algorithm
  }">
    <router-view />
  </config-provider>
</template>

<script lang="ts" setup>
import { ConfigProvider, theme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useDocumentTitle, useAntdFollowSystemTheme } from '@guolisec/utils'

// 浏览器标签页名（文档title）
useDocumentTitle()

// ant-design-vue跟随系统主题变化
const { algorithm } = useAntdFollowSystemTheme(theme)
</script>