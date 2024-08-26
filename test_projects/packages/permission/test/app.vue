<!--
 * @name: 根组件
 * @description: Do not edit
-->
<template>
  <config-provider :locale="locale" :theme="{
    algorithm: algorithm
  }">
    <router-view />
    <FloatButtonGroup shape="circle" trigger="hover" type="primary">
      <FloatButton @click="switchColorScheme()">
        <template #icon>
          <i v-if="currentColorScheme === 'dark'" class="i-base-sun-line"></i>
          <i v-else class="i-base-moon-line"></i>
        </template>
      </FloatButton>
      <FloatButton @click="handleSwitchTranlate()">
        <template #icon>
          <i class="i-base-translate"></i>
        </template>
      </FloatButton>
    </FloatButtonGroup>
  </config-provider>
</template>

<script lang="ts" setup>
import { computed, unref } from 'vue'
import { ConfigProvider, theme, FloatButtonGroup, FloatButton } from 'ant-design-vue'

import { useDocumentTitle, useAntdFollowSystemTheme } from '@guolisec/utils'
import { getCurrentColorScheme, switchColorScheme } from '#/entry/theme'
import { locale, handleSwitchTranlate } from '@/languages/useLanguage'
import { useMonitor } from '@/index'

// 当前全局主题明暗
const currentColorScheme = computed(() => {
  const colorScheme = getCurrentColorScheme()
  return unref(colorScheme)
})

// 浏览器标签页名（文档title）
useDocumentTitle()

// ant-design-vue跟随系统主题变化
const { algorithm } = useAntdFollowSystemTheme(theme)

useMonitor()
</script>

<style scoped>
.box {
  color: var(--color-text, #000000)
}
</style>