<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-01 17:20:53
 * @path: \permission\src\pages\LisenseLoginPage.vue
-->
<template>
  <LicenseLogin />
</template> 
<script lang="ts" setup>
import { LicenseLogin, provideLoginContext } from '@/index'

provideLoginContext({
  license: true
})
</script>
  