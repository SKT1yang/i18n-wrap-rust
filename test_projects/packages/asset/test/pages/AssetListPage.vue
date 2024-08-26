<!--
 * @name: 首页
 * @description: Do not edit
-->
<template>
  <MarginPageWrapper>
    <AssetRegistered :hidden-features="['asset-scan']" class="p-4" />
  </MarginPageWrapper>
</template>
<script lang="ts" setup>
import { AssetRegistered } from '@/index'
import { MarginPageWrapper } from '@guolisec/permission'
</script>
