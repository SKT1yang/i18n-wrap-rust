<!--
 * @name: 资产 CPU 内存 使用率历史曲线
 * @description: Do not edit
-->
<template>
  <Card>
    <div class="flex items-center justify-between mb-4">
      <div>
        <span class="font-bold text-[16px]">{{ t('资产历史曲线') }} </span>
        <Segmented v-model:value="historyType" class="ml-4" :options="['CPU', t('内存')]" />
      </div>
      <RangePicker value-format="YYYY-MM-DD HH:mm:ss" show-time v-model:value="time" @open-change="handleChange"
        :allow-clear="false" />
    </div>

    <div class="h-[200px]">
      <ChartCpuHistoryUsage :time="time" v-if="historyType === 'CPU'" />
      <ChartRamHistoryUsage :time="time" v-else />
    </div>

  </Card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Card, RangePicker, Segmented } from 'ant-design-vue'
import dayjs from 'dayjs';
import ChartCpuHistoryUsage from './ChartCpuHistoryUsage.vue'
import ChartRamHistoryUsage from './ChartRamHistoryUsage.vue'
import { t } from "@/entry/languages/useLanguage";

const historyType = ref<'CPU' | '内存'>('CPU')

const time = ref<[string, string]>([dayjs().subtract(3, 'month').startOf('day').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('D').format('YYYY-MM-DD HH:mm:ss')])

function handleChange() {

}
</script>