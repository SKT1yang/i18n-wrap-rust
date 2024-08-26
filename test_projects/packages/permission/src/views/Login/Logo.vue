<!--
 * @name: 默认logo
 * @description: Do not edit
-->

<template>
  <img :src="logoUrl" class="w-10 h-10" />
</template>

<script lang='ts' setup>
import { computed } from 'vue';

const logoUrl = computed(() => {
  let url = ''
  if (window.OEM_SETTINGS && window.OEM_SETTINGS.HTML_LOGO_PATH) {
    url = `${window.OEM_SETTINGS.HTML_LOGO_PATH}/logo.png`
  }
  return url
})
</script>