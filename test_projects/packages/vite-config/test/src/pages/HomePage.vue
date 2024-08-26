<!--
 * @name: 首页
 * @description: 404 not found
-->
<template>
  <div>
    <div>{{ t('测试首页') }}</div>
    <DatePicker />
    <i class="i-base-24-hours-fill"></i>
    <i class="i-base-account-pin-circle-fill"></i>
  </div>
</template>

<script lang="ts" setup>
import { t } from '@/entry/languages/useLanguage'
import { DatePicker } from 'ant-design-vue'
</script>
