<!--
 * @name: app provider
 * @description: antd配置、主题、国际化注入入口
-->

<script lang="ts" setup>
/* 第三方模块 */
import { ConfigProvider, FloatButton, FloatButtonGroup, theme } from 'ant-design-vue'
import { useAntdFollowSystemTheme } from '@guolisec/utils'
/* 本地模块 */
import { handleSwitchTranlate, language, locale } from '@/entry/languages/useLanguage'
import { currentColorScheme, switchColorScheme } from '@/entry/theme'

const isDevMode = import.meta.env.DEV

// ant-design-vue 主题变化
const { algorithm } = useAntdFollowSystemTheme(theme)
</script>

<template>
  <config-provider
    :locale="locale"
    :theme="{
      algorithm
    }"
  >
    <slot />
    <template v-if="isDevMode">
      <FloatButtonGroup shape="circle" trigger="hover">
        <template #icon>
          <i class="i-base-magic-line" />
        </template>
        <FloatButton @click="switchColorScheme()">
          <template #icon>
            <i v-if="currentColorScheme === 'dark'" class="i-base-sun-line" />
            <i v-else class="i-base-moon-line" />
          </template>
        </FloatButton>
        <FloatButton @click="handleSwitchTranlate()">
          <template #icon>
            <span v-if="language === 'en'">中</span>
            <span v-if="language === 'zh'">En</span>
          </template>
        </FloatButton>
      </FloatButtonGroup>
    </template>
  </config-provider>
</template>
