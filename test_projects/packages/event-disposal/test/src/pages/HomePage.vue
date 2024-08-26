<!--
 * @name: 首页
 * @description: 404 not found
-->
<template>
  <div>
    <div>{{ t('测试首页') }}</div>
    <DatePicker />
  </div>
</template>

<script lang="ts" setup>
import { t } from '@/entry/languages/useLanguage'
import { DatePicker } from 'ant-design-vue'
</script>
