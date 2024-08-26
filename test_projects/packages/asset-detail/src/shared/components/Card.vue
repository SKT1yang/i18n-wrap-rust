<template>
  <div class="bg-$color-bg-container p-6 rounded-lg">
    <div class="flex justify-between align-center mb-4">
      <div class="text-base font-bold " v-if="props.title">{{ props.title }}</div>
      <div v-if="!props.title">
        <slot name="title"></slot>
      </div>

      <slot name="rightExtra"></slot>
    </div>

    <slot></slot>
  </div>
</template>

<script lang='ts' setup>
const props = defineProps({
  title: {
    type: String,
  }
})
</script>