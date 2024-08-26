<!--
 * @name: 交换机端口可视化单元
 * @description: 基本单元
-->

<template>
  <span class="asset-image" :style="{ width: `${props.size}px`, height: `${props.size}px` }">
    <svg :style="{ width: `${props.size}px`, height: `${props.size}px` }" viewBox="0 0 28 28">
      <defs>
        <g id="port-on">
          <rect width="28" height="24" fill="#DCDFE6" />
          <rect x="3" y="6" width="22" height="14" fill="#414141" />
          <rect x="6" y="4" width="16" height="2" fill="#414141" />
          <rect x="8" y="2" width="12" height="2" fill="#414141" />
          <rect x="5" y="8" width="18" height="10" fill="#2DA641" />
          <rect x="8" y="6" width="12" height="2" fill="#2DA641" />
          <rect x="10" y="4" width="8" height="2" fill="#2DA641" />
        </g>
      </defs>
      <defs>
        <g id="port-off">
          <rect width="28" height="24" fill="#DCDFE6" />
          <rect x="3" y="6" width="22" height="14" fill="#414141" />
          <rect x="6" y="4" width="16" height="2" fill="#414141" />
          <rect x="8" y="2" width="12" height="2" fill="#414141" />
          <rect x="7" y="10" width="2" height="8" fill="#DCDFE6" />
          <rect x="11" y="10" width="2" height="8" fill="#DCDFE6" />
          <rect x="15" y="10" width="2" height="8" fill="#DCDFE6" />
          <rect x="19" y="10" width="2" height="8" fill="#DCDFE6" />
        </g>
      </defs>
      <use v-if="props.status === 'connect'" xlink:href="#port-on"
        :transform="props.direction === 'top' ? `rotate(180,14,12)` : ''" :width="props.size" :height="props.size" />
      <use v-else xlink:href="#port-off" :transform="props.direction === 'top' ? `rotate(180,14,12)` : ''
        " :width="props.size" :height="props.size" />
    </svg>
  </span>
</template>
<script setup lang="ts">

// 父组件传值
const props = defineProps({
  status: {
    type: String,
    default: 'connect',
  },
  direction: {
    type: String,
    default: 'top',
  },
  size: {
    type: Number,
    default: 30,
  },
});
</script>
