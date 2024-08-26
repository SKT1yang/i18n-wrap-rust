<!--
 * @Author: June
 * @Description: 渐变
 * @Date: 2023-09-27 14:13:04
 * @LastEditors: June
 * @LastEditTime: 2023-10-03 16:18:01
-->
<template>
  <GradientControls />

  <Area />

  <Preview />
</template>

<script name="Gradient" lang="ts" setup>
import Area from '@/domains/ColorPicker/src/Area/index.vue'
import Preview from '@/domains/ColorPicker/src/Preview/index.vue'
import GradientControls from '@/domains/ColorPicker/src/GradientControls/index.vue'
</script>
