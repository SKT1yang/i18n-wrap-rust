<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <TabsAsset :hidden-features="['asset-scan', 'cascade::sync::manage']" />
  <!-- <TabsAsset :hidden-features="['asset-scan', 'cascade::client-name', 'cascade::sync::device']" /> -->
</template>
<script lang="ts" setup>
import { TabsAsset } from '@/index';
</script>
