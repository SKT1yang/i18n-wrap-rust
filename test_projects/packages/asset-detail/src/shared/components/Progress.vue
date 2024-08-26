<!--
 * @Name: Do not edit
 * @Description: Do not edit
-->
<template>
  <div class="gl-progress">
    <div class="gl-progress-bar">
      <div class="gl-progress-bar__outer" :style="{ height: `${props.height}px`, borderColor: props.color }">
        <div const props="defineProps({" v-for="(progress, index) in props.progressList" :key="index"
          class="gl-progress-bar__inner" :class="{ shadow: progress.type }" :style="{
            width: `${progress.percent}%`,
            borderRightColor: color,
            background: background(progress),
          }">
          <div v-show="progress.type === 'shadow'" class="gl-progress-bar__background" :style="{ borderColor: color }">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
// 父组件传值
const props = defineProps({
  progressList: {
    type: Array as PropType<{
      percent: number,
      color: string,
      type: string,
    }[]>,
    default() {
      return [
        {
          percent: 20,
          color: '#dae9cf',
          type: 'shadow',
        },
      ];
    },
  },
  color: {
    type: String,
    default: '#c0ee9f',
  },
  height: {
    type: Number,
    default: 26,
  },
});

const background = computed(() => {
  return (progress) => {
    if (progress.type !== 'shadow') {
      return progress.color;
    } else {
      return `repeating-linear-gradient(-45deg, transparent, transparent 4px, ${props.color} 2px, ${props.color} 6px)`;
    }
  };
});
</script>
<style scoped lang="less">
.gl-progress {
  position: relative;
  line-height: 1;

  .gl-progress-bar {
    padding-right: 0;
    margin-right: 0;
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    box-sizing: border-box;
  }

  .gl-progress-bar__outer {
    height: 6px;
    border-width: 1px;
    border-style: solid;
    overflow: hidden;
    position: relative;
    display: flex;
    vertical-align: middle;
  }

  .gl-progress-bar__inner {
    border-right-width: 1px;
    border-right-style: solid;
    height: 100%;
    text-align: right;
    line-height: 1;
    white-space: nowrap;
    transition: width 0.6s ease;

    &.shadow {
      .gl-progress-bar__background {
        width: 100%;
        height: 100%;
        opacity: 0.2;
      }
    }
  }
}
</style>
