<!--
 * @name: 登录布局容器
 * @description: Do not edit
-->
<template>
  <div class="login flex justify-end w-screen h-screen relative">

    <!-- 公司完整图标 -->
    <slot name="logo-full"></slot>
    <div class="flex-center pr-20">
      <Card class="shadow-2xl">
        <template #title>
          <div class="flex items-center">

            <!-- 公司图标 -->
            <slot name="logo"></slot>

            <!-- 公司名称 -->
            <span class="ml-4 text-2xl font-bold tracking-widest">{{ APP_NAME }}</span>
          </div>
        </template>
        <slot></slot>
      </Card>
    </div>

    <!-- 公司版权声明 -->
    <div v-if="copyright" class="text-center absolute w-full bottom-10 text-sm text-white">
      {{ t("版权©2019国利网安浙ICP备19021981号-1") }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { injectLoginContext } from '../../controller/useContext';
import { Card } from 'ant-design-vue'
import { getDocumentTitleConfig } from '@guolisec/utils'
import { t } from '@/languages/useLanguage'

const { copyright = true } = injectLoginContext()
const APP_NAME = ref(getDocumentTitleConfig())
</script>

