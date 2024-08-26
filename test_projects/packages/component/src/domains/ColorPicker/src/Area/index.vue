<!--
 * @Author: June
 * @Description: Area
-->

<template>
  <div class="flex flex-col px-16px">
    <Picker />

    <GradientPoints v-if="colorPickerState.isGradient" />

    <div class="flex pb-16px">
      <Preview />

      <div class="flex flex-col flex-1">
        <Hue />

        <Alpha />
      </div>
    </div>
  </div>
</template>

<script name="Area" lang="ts" setup>
import { inject } from 'vue';
import Picker from './Picker/index.vue'
import Preview from './Preview/index.vue'
import Hue from './Hue/index.vue'
import Alpha from './Alpha/index.vue'
import GradientPoints from './GradientPoints/index.vue'
import type { IColorState } from '@/domains/ColorPicker/src/types'

const colorPickerState = inject('colorPickerState') as IColorState
</script>
