<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <Tag :color="color">{{
    label
  }}</Tag>
</template>
<script name="EventAlarmTag" lang="ts" setup>
import { computed } from 'vue'
import { Tag } from 'ant-design-vue';
import { getOptionItem } from './utils';
import type { EventScore, EventLevel } from './types/event';

const props = defineProps<{
  score?: EventScore;
  level?: EventLevel;
}>();

// 颜色
const color = computed(() => {
  // 分数优先于等级
  if (props.score !== undefined) {
    const optionItem = getOptionItem(props.score, 'score');
    return optionItem?.color;
  }
  if (props.level !== undefined) {
    const optionItem = getOptionItem(props.level, 'level');
    return optionItem?.color;
  }
});

// 文字
const label = computed(() => {
  // 分数优先于等级
  if (props.score !== undefined) {
    const optionItem = getOptionItem(props.score, 'score');
    return optionItem?.label;
  }
  if (props.level !== undefined) {
    const optionItem = getOptionItem(props.level, 'level');
    return optionItem?.label;
  }
});
</script>