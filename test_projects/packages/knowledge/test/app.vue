<!--
 * @name: 根组件
 * @description: Do not edit
 * @date: 2023-02-03 09:00:30
 * @path: \knowledge\test\app.vue
-->
<template>
  <config-provider :locale="zhCN" :theme="{
    algorithm: algorithm
  }">
    <router-view />
    <FloatButtonGroup shape="circle">
      <FloatButton @click="switchColorScheme()">
        <template #icon>
          <i v-if="currentColorScheme === 'dark'" class="i-base-sun-line"></i>
          <i v-else class="i-base-moon-line"></i>
        </template>
      </FloatButton>
    </FloatButtonGroup>
  </config-provider>
</template>

<script lang="ts" setup>
import { computed, unref } from 'vue'
import { ConfigProvider, theme, FloatButtonGroup, FloatButton } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { useDocumentTitle, useAntdFollowSystemTheme } from '@guolisec/utils'
import { getCurrentColorScheme, switchColorScheme } from '#/entry/theme'

// 当前全局主题明暗
const currentColorScheme = computed(() => {
  const colorScheme = getCurrentColorScheme()
  return unref(colorScheme)
})

// 浏览器标签页名（文档title）
useDocumentTitle()

// ant-design-vue跟随系统主题变化
const { algorithm } = useAntdFollowSystemTheme(theme)
</script>