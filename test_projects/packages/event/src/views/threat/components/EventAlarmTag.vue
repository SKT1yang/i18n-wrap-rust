<!--
 * @name: 列表栏内的tag
 * @author: bwb
 * @description: 列表栏内的tag
 * @path: \event\src\views\threat\components\EventAlarmTag.vue
-->
<template>
  <Tag :color="color" :style="{ color: getColorSchemeMode() === ThemeEnum.DARK ? '#fff' : '#686868' }">{{
    label
  }}</Tag>
</template>
<script name="EventAlarmTag" lang="tsx" setup>
import { getOptionItem } from '../../../utils/tag';
import { getColorSchemeMode } from '@guolisec/utils'
import { Tag } from 'ant-design-vue';
import { computed } from 'vue';


enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

type EventScore = 0 | 2 | 5 | 10;
type EventLevel = 1 | 2 | 3 | 4;

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
