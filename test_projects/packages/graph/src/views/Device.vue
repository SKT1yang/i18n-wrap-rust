<!--
 * @name: Do not edit
 * @description: Do not edit
 * @path: \graph\lib\views\Device.vue
-->
<template>
  <i :class="[map[props.assetTypeCode] || 'i-base-host']" :style="style"></i>
</template>

<script lang='ts' setup>
import { computed } from 'vue'
import { type PropType } from 'vue';
const props = defineProps({
  // 资产类型 默认主机
  assetTypeCode: {
    type: Number,
    default: 3
  },
  runStatus: {
    type: Number as PropType<0 | 1 | 2>,
    default: 1
  },
  color: {
    type: String
  }
})

const map = {
  0: 'i-base-other',
  1: 'i-base-plc',
  2: 'i-base-dcs',
  3: 'i-base-host',
  4: 'i-base-hmi',
  5: 'i-base-gateway',
  6: 'i-base-opc-server',
  7: 'i-base-opc-client',
  8: 'i-base-switch',
  9: 'i-base-router',
  10: 'i-base-network-audit',
  11: 'i-base-firewall',
  12: 'i-base-intrusion-detection',
  13: 'i-base-gap',
  14: 'i-base-camera',
  15: 'i-base-camera-platform',
  16: 'i-base-controller-monitor',
  17: 'i-base-sis',
  18: 'i-base-smart-meter',
  19: 'i-base-controller-protection',
  20: 'i-base-operation-audit',
  21: 'i-base-database-audit',
  22: 'i-base-log-analysis',
  23: 'i-base-one-way-input',
  24: 'i-base-management-platform',
  25: 'i-base-server',
  26: 'i-base-ethernet-io',
  27: 'i-base-control-isolation',
  28: 'i-base-threats-tracing',
  29: 'i-base-vulnerability-scan',
  30: 'i-base-workstation',
  31: 'i-base-operator-station',
  32: 'i-base-industrial-gateway',
  33: 'i-base-frequency-transformer',
  34: 'i-base-wireless-bridge',
  35: 'i-base-rtu',
  36: 'i-base-ntp-server',
  37: 'i-base-asset-monitor',
  38: 'i-base-secure-isolation',
  39: 'i-base-situation-awareness',
  40: 'i-base-flow-simulation',
  41: 'i-base-vulnerability-mining',
  42: 'i-base-video-recorder',
  43: 'i-base-host-platform',
  44: 'i-base-operator-station',
  99: 'i-base-public-cloud',
}

const style = computed(() => {
  return {
    color: props.color ? props.color : `var(--color-${['error', 'primary', 'warning'][props.runStatus]})`
  }
})

</script>