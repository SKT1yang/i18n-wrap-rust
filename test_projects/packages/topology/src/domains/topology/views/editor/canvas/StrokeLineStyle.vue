<template>
  <svg v-if="!props.lineDashStyle" xmlns="http://www.w3.org/2000/svg" width="110" height="1" viewBox="0 0 110 1"
    fill="none">
    <rect width="110" height="1" fill="black" fill-opacity="0.88" />
  </svg>
  <svg v-else xmlns="http://www.w3.org/2000/svg" width="110" height="1" viewBox="0 0 110 1" fill="none">
    <line y1="0.5" x2="110" y2="0.5" :stroke="colorSchemeMode === 'light' ? 'black' : 'white'"
      :stroke-dasharray="props.lineDashStyle" />
  </svg>
</template>

<script setup lang="ts">
import { useColorSchemeMode } from '@guolisec/utils'
const props = defineProps({
  lineDashStyle: {
    type: String,
  }
})
const { colorSchemeMode } = useColorSchemeMode()
</script>