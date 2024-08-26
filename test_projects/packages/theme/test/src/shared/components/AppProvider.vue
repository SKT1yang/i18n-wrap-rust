<!--
 * @name: app provider
 * @description: antd配置、主题和国际化注入入口
-->
<template>
  <config-provider :locale="locale" :theme="{
    algorithm: algorithm
  }">
    <slot></slot>
    <template v-if="!isProdMode">
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
    </template>
  </config-provider>
</template>

<script lang="ts" setup>
/* 第三方模块 */
import { ConfigProvider, theme, FloatButtonGroup, FloatButton } from 'ant-design-vue'
import { useAntdFollowSystemTheme } from '@guolisec/utils'
/* 本地模块 */
import { language, locale, handleSwitchTranlate } from '@/entry/languages/useLanguage'
import { currentColorScheme, switchColorScheme } from '@/entry/theme'

const isProdMode = import.meta.env.PROD

// ant-design-vue 主题变化
const { algorithm } = useAntdFollowSystemTheme(theme)
</script>
