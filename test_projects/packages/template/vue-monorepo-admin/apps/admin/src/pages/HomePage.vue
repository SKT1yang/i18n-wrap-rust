<!--
 * @name: 首页
 * @description: 404 not found
-->

<script lang="ts" setup>
import { t } from '@/entry/languages/useLanguage'
import { Demo } from '@/domains/demo'
</script>

<template>
  <div>
    <div>{{ t('首页') }}</div>
    <Demo />
  </div>
</template>
