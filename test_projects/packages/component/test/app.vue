<!--
 * @name: 根组件
 * @description: Do not edit
 * @date: 2023-02-03 09:00:30
 * @path: \vue-package-quickstart\test\app.vue
-->
<template>
  <config-provider :locale="locale" :theme="{
    algorithm: algorithm
  }">
    <router-view />
    <FloatButtonGroup shape="circle" trigger="hover">
      <template #icon>
        <i class="i-base-magic-line"></i>
      </template>
      <FloatButton @click="switchColorScheme()">
        <template #icon>
          <i v-if="currentColorScheme === 'dark'" class="i-base-sun-line"></i>
          <i v-else class="i-base-moon-line"></i>
        </template>
      </FloatButton>
      <FloatButton @click="handleSwitchTranlate()">
        <template #icon>
          <span v-if="language === 'en'">中</span>
          <span v-if="language === 'zh'">En</span>
        </template>
      </FloatButton>
    </FloatButtonGroup>
  </config-provider>
</template>

<script lang="ts" setup>
/* 第三方模块 */
import { computed } from 'vue'
import { ConfigProvider, theme, FloatButtonGroup, FloatButton } from 'ant-design-vue'
import { useDocumentTitle, useAntdFollowSystemTheme } from '@guolisec/utils'
/* 本地模块 */
import { useLanguage } from '@/entry/languages/useLanguage'
import { getCurrentColorScheme, switchColorScheme } from '#/entry/theme'

// 网页title
useDocumentTitle()

// 国际化
const { language, locale, handleSwitchTranlate, } = useLanguage()

// 主题
const currentColorScheme = computed(() => {
  const colorScheme = getCurrentColorScheme()
  return colorScheme.value
})

// ant-design-vue 主题变化
const { algorithm } = useAntdFollowSystemTheme(theme)
</script>