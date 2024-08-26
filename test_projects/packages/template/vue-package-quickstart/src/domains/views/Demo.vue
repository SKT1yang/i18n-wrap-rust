<template>
  <div>
    <div>{{ t('我是组件内页面') }}</div>
    <div>{{ msg }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { t } from '@/entry/languages/useLanguage'

const msg = ref(t('消息'))
</script>
