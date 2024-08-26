<!--
 * @Name: 交换机设备温度
 * @Description: Do not edit
-->
<template>
  <div v-if="asset.assetTypeCode === 8">
    <span class="color-$color-text-tertiary">{{ t('温度') }}</span>
    {{ switchTemperature > 0 ? switchTemperature : '-' }} ℃
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { onMountedOrActivated } from '@guolisec/utils'
import { useAssetInfoStore } from '@/entry/store';
import { t } from "@/entry/languages/useLanguage";
import { getSwitchInfoApi } from '@/domains/port/model/switch';

const { asset } = useAssetInfoStore()

const switchTemperature = ref(-1)
async function getSwitchTemperatureData() {
  const { switchInfoVO } = await getSwitchInfoApi({
    assetIp: asset.assetIp,
    assetMac: asset.assetMac
  })
  switchTemperature.value = switchInfoVO.sysInfo.temperature
}

onMountedOrActivated(() => {
  if (asset.assetTypeCode === 8) {
    getSwitchTemperatureData()
  }
})
</script>