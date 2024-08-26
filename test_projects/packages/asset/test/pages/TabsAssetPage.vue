<!--
 * @name: 首页
 * @description: Do not edit
 * @date: 2023-05-08 13:37:54
 * @path: \vue-monorepo-admin\apps\admin\src\pages\HomePage.vue
-->
<template>
  <MarginPageWrapper>
    <TabsAsset class="p-4" :hidden-features="['asset-scan', 'cascade::sync::manage']" />
  </MarginPageWrapper>
</template> 
<script lang="ts" setup>
import { TabsAsset } from '@/index'
import { MarginPageWrapper } from '@guolisec/permission'
</script>
