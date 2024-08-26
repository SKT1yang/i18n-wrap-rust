<template>
  <Select placeholder="请选择线型" @change="handleChange" v-model:value="selectValue">
    <SelectOption key="0 0">
      <StrokeLineStyle line-dash-style="0 0" />
    </SelectOption>
    <SelectOption key="2 2">
      <StrokeLineStyle line-dash-style="2 2" />
    </SelectOption>
    <SelectOption key="4 4">
      <StrokeLineStyle line-dash-style="4 4" />
    </SelectOption>
    <SelectOption key="8 8">
      <StrokeLineStyle line-dash-style="8 8" />
    </SelectOption>
  </Select>
</template>

<script lang='ts' setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
import { SelectOption, Select, } from 'ant-design-vue'
import StrokeLineStyle from './StrokeLineStyle.vue';

const emit = defineEmits(['change', 'update:lineDash'])

const props = defineProps({
  lineDash: {
    type: Array as PropType<number[]>
  }
})

const selectValue = computed({
  get() {
    return props.lineDash?.join(' ') || '0 0'
  },
  set(value) {
    emit('update:lineDash', value.split(' ').map(i => Number(i)))
  }
})

function handleChange(value) {
  emit('change', value)
}

</script>