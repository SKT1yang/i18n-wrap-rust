<!--
 * @name: 默认完整logo
 * @description: Do not edit
-->

<template>
  <div class="absolute w-50 h-12 top-2 left-8 ">
    <img :src="logoFullUrl" class="w-50 h-12" />
  </div>
</template>

<script lang='ts' setup>
import { computed } from 'vue';

const logoFullUrl = computed(() => {
  let url = ''
  if (window.OEM_SETTINGS && window.OEM_SETTINGS.HTML_LOGO_PATH) {
    url = `${window.OEM_SETTINGS.HTML_LOGO_PATH}/logo-full.png`
  }
  return url
})
</script>