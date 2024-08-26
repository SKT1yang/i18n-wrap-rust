<!--
 * @Name: 运行状态
 * @Description: Do not edit
-->
<template>
  <Card :title="t('运行状态')" class="h-full">
    <div class="w-full h-full overflow-auto max-h-[266px] space-y-2 ">
      <div class="w-10/11"
        v-if="(typeof resourceUsage.cpuRate === 'number' && resourceUsage.cpuRate !== -1) || resourceUsage.memRate?.length">
        <div v-if="typeof resourceUsage.cpuRate === 'number' && resourceUsage.cpuRate !== -1" class="mb-2">
          <span class="leading-[22px]"> {{ t('CPU 使用率') }} </span>
          <Progress :percent="resourceUsage.cpuRate" status="normal" />
        </div>
        <div v-if="resourceUsage.memRate.length">
          <div v-for="(mem, index) in resourceUsage.memRate" :key="index" class="mb-2">
            <span class="leading-[22px]">{{ t('内存（{}）使用率', mem.memRateName) }} </span>
            <Progress :percent="mem.memRateValue" status="normal" />
          </div>
        </div>
      </div>
      <Empty v-else />
    </div>

    <template #rightExtra>
      <SwitchTemperature />
    </template>
  </Card>
</template>
<script setup name="CpuRunStatus" lang="ts">
import { ref } from 'vue'
import { Empty, Progress } from 'ant-design-vue';
import { getResourceUsageApi } from '../model/status';
import { onMountedOrActivated } from '@guolisec/utils'
import Card from '@/shared/components/Card.vue';
import { useAssetInfoStore } from '@/entry/store';
import { t } from "@/entry/languages/useLanguage";
import SwitchTemperature from './switch/SwitchTemperature.vue';

const { asset } = useAssetInfoStore()

let resourceUsage = ref<{
  cpuRate?: number | null;
  memRate: { memRateName: string; memRateValue: number }[]
}>({ cpuRate: undefined, memRate: [] });

const getData = () => {
  if (asset.cpuRate === null && asset.memoryRate === null) {
    if (asset.assetIp) {
      getResourceUsage();
    }
  } else {
    resourceUsage.value = {
      cpuRate: asset.cpuRate,
      memRate: []
    };
  }
};

const getResourceUsage = async () => {
  const response = await getResourceUsageApi({
    deviceIp: asset.assetIp,
    deviceMac: asset.assetMac || '',
  });
  resourceUsage.value = response || {};
  resourceUsage.value.memRate = response.memRate?.filter(item => typeof item.memRateValue === 'number' && item.memRateValue !== -1)
};

onMountedOrActivated(() => {
  getData()
})
</script>