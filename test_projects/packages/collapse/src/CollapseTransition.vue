<!--
 * @name: 折叠过渡动画组件
 * @description: Do not edit
 * @date: 2023-06-07 19:30:58
 * @path: \collapse\src\CollapseTransition.vue
-->
<template>
  <Transition v-on="collapseAnimation">
    <slot></slot>
  </Transition>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { useCollapseAnimation } from './useCollapseAnimation';
import { Orientation } from './type';
const props = defineProps({
  orientation: {
    type: String as PropType<Orientation>,
    default: 'vertical'
  },
  animationDuration: {
    type: String,
    default: '.3s'
  },
  easing: {
    type: String,
    default: 'ease-in-out'
  }
});
const collapseAnimation = useCollapseAnimation({
  orientation: props.orientation,
  animationDuration: props.animationDuration,
  easing: props.easing
});
</script>
