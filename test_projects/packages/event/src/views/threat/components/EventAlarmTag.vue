<template>
  <tag :color="color" :style="{ color: getColorSchemeMode() === ThemeEnum.DARK ? '#fff' : '#686868' }">{{ label }}</tag>
</template>
<script name="EventAlarmTag" lang="tsx" setup>
import { getOptionItem } from "../../../utils/tag";
import { getColorSchemeMode } from "@guolisec/utils";
import { Tag } from "ant-design-vue";
import { computed } from "vue";
enum ThemeEnum {
	DARK = "dark",
	LIGHT = "light",
}
type EventScore = 0 | 2 | 5 | 10;
type EventLevel = 1 | 2 | 3 | 4;
const props = defineProps<{
	score?: EventScore;
	level?: EventLevel;
}>();
const color = computed(() => {
	if (props.score !== undefined) {
		const optionItem = getOptionItem(props.score, "score");
		return optionItem?.color;
	}
	if (props.level !== undefined) {
		const optionItem = getOptionItem(props.level, "level");
		return optionItem?.color;
	}
});
const label = computed(() => {
	if (props.score !== undefined) {
		const optionItem = getOptionItem(props.score, "score");
		return optionItem?.label;
	}
	if (props.level !== undefined) {
		const optionItem = getOptionItem(props.level, "level");
		return optionItem?.label;
	}
});
</script>
