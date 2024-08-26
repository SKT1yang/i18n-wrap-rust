<!--
 * @name: 设备运行状态
-->
<template>
  <Badge :color="colorSet[props.status]" :text="statusNameSet[props.status]"></Badge>
</template>
<script name="RunStatusTag" lang="ts" setup>
import { Badge } from 'ant-design-vue';
import { t } from '@/entry/languages/useLanguage'

const props = defineProps<{
  status: 0 | 1 | 2;
}>();
//table
const colorSet = ['red', 'green', 'orange'];
const statusNameSet = [t('离线'), t('在线'), t('闲置')];
</script>
