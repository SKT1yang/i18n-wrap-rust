<!--
 * @name: 用户管理
 * @description: Do not edit
-->
<template>
  <Account :show-items="['User', 'Role', 'UsbKey', 'EmergencyLogin']" />
</template> 
<script lang="ts" setup>
import { Account } from '@/index'
</script>
