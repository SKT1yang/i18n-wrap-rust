<!--
 * @name: 高性能版折叠动画组件
 * @description: 优点：使用transform，不会造成重绘和回流；缺点：相邻组件不会跟随动画变化
 * @date: 2023-06-07 19:30:58
 * @path: \collapse\src\CollapseTransitionPerformance.vue
-->
<template>
  <Transition v-on="collapseAnimation">
    <slot></slot>
  </Transition>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { useCollapseAnimation } from './useCollapseAnimation';
import { TransformOrigin, Orientation } from './type';
const props = defineProps({
  orientation: {
    type: String as PropType<Orientation>,
    default: 'vertical'
  },
  transformOrigin: {
    type: String as PropType<TransformOrigin>,
    default: 'top'
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
  transformOrigin: props.transformOrigin,
  animationDuration: props.animationDuration,
  easing: props.easing
});
</script>
