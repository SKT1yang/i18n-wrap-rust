<!--
 * @name: app被嵌套异常时，兜底页面
 * @description: Do not edit
-->
<template>
  <div class="flex items-center flex-col justify-center h-screen">
    <img :src="undraw" class="mb-4">
    <span class="mb-4">{{ t('连接不稳定，请稍后再试~') }}</span>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/languages/useLanguage'
import undraw from '../../assets/undraw.svg'
</script>
