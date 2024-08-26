<template>
  <!-- todo 还在斟酌，目前没有完美的方案 -->
  <!-- 1. 好处：边距也会跟着滚动，滚动条位于底部； 坏处：router-view 的height：100%失效，相当于高度传递链在此刻失效 -->
  <div v-if="props.type === 'full'" class="margin-page-wrapper w-fit min-w-full h-full overflow-y-auto"
    :class="[props.hasMargin ? 'p-6' : '']">
    <div class="margin-page-content w-fit min-w-full h-fit min-h-full overflow-auto"
      :class="[props.hasBg ? 'bg-$color-bg-base' : '', props.hasMargin ? 'rounded-2 shadow-sm' : '']">
      <router-view />
    </div>
  </div>
  <!-- 1. 好处：router-view 的高度链正常； 坏处：滚动条位于底部上面一点点 感觉在个框里，影响用户感觉体验 -->
  <div v-else class="margin-page-wrapper w-full h-full" :class="[props.hasMargin ? 'p-6' : '']">
    <div class="margin-page-content w-full h-full overflow-auto"
      :class="[props.hasBg ? 'bg-$color-bg-base' : '', props.hasMargin ? 'rounded-2 shadow-sm' : '']">
      <slot />
    </div>
  </div>
</template>

<script lang='ts' setup>
import type { PropType } from 'vue'
const props = defineProps({
  hasMargin: {
    type: Boolean,
    default: true
  },
  hasBg: {
    type: Boolean,
    default: true
  },
  type: {
    type: String as PropType<'full' | 'window'>,
    default: 'window'
  }
})

</script>

<style scoped>
.margin-page-wrapper {
  background-color: rgba(0, 0, 0, 0.03);
}

.margin-page-content::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
</style>