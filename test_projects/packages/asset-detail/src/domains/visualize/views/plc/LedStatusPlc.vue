<!--
 * @name: PLC 设备灯显示状态
 * @description: Do not edit
-->
<template>
  <div class="flex flex-col p-t-2 overflow-auto cpu-led-status-container">
    <div v-for="led in props.ledStatus" :key="led.name" class="leading-[20px] mb-1">
      <span class="inline-block h-[16px] w-[8px] mr-1"
        :style="`--led-color: var(--${getLedStatus(led.status, led.flash, led.name, 'color')}-6)`"
        :class="getLedStatus(led.status, led.flash, led.name)"></span>
      <span class="color-$color-bg-base mr-1 align-top">{{ led.name }}</span>
    </div>
  </div>

</template>

<script lang='ts' setup>
import type { PropType } from 'vue';

const props = defineProps({
  ledStatus: {
    type: Object as PropType<{
      flash: 0|1; status: 0|1; name: string
    }[]>,
    required: true
  },
})

/********************** 设备灯 **********************/

function getLedStatus(status: 0 | 1, flash: 0 | 1, name: string, type = 'flick') {
  if (type == 'flick') {
    if (status === 1) {
      return 'bg-$dark-led-color'
    }
    if (flash === 0) {
      return `led-flicker`
    }
    return `led-light`
  } else if (type === 'color') {
    let color = 'red'
    if (name === 'RUN' || name === "DC5V") {
      color = "green"
    } else if (name === 'FRCE' || name === 'STOP' || name === 'MSTR' || name.includes('RACK')) {
      color = 'orange'
    }
    return color
  }
}
</script>

<style scoped>
@keyframes ledFlicker {
  0% {
    background-color: var(--led-color);
  }

  50% {
    background-color: var(--dark-led-color);
  }

  100% {
    background-color: var(--led-color);
  }
}

.cpu-led-status-container {
  --dark-led-color: #ccc;
}


.led-flicker {
  animation: ledFlicker 2s linear infinite alternate;
}

.led-light {
  background-color: var(--led-color);
}
</style>