<template>
  <div class="flex items-center">
    <input type="color" @change="handleChange" :value="color" />
    <div class="text-xs text-slate-600 p-2 cursor-pointer" @click="handleReset">重置</div>
    <div class="text-xs text-slate-600 p-2 cursor-pointer" @click="handleClear">清空</div>
  </div>
</template>

<script lang='ts' setup>
import { onMounted } from 'vue';
let initColor
const color = defineModel<string>('value')

const emit = defineEmits(['change'])

function handleChange(e) {
  if (e.target.value) {
    color.value = e.target.value
    emit('change', color.value)
  }
}

onMounted(() => {
  initColor = color.value
})

function handleReset() {
  color.value = initColor
  emit('change', color.value)
}

function handleClear() {
  color.value = ''
  emit('change', color.value)
}

</script>