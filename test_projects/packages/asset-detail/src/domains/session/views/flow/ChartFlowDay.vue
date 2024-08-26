<!--
 * @Name: 每天的资产流量
 * @Description: Do not edit
-->
<template>
  <div class="w-full" ref="dayChartRef" v-if="nameData.length > 0"></div>
  <Empty v-else></Empty>
</template>
<script setup lang="ts">
/* 类型文件 */
import { Ref } from 'vue';
/* 第三方模块 */
import { ref, computed, nextTick } from 'vue';
import dayjs from 'dayjs';
import { Empty } from 'ant-design-vue'
import { useECharts } from '@guolisec/utils/echarts';
import { getColorSchemeMode, onMountedOrActivated, formatToDate } from '@guolisec/utils';
/* 本地模块 */
import { queryAssetTrafficByDayApi } from '../../model';
import { useAssetInfoStore } from '@/entry/store';
import { t } from '@/entry/languages/useLanguage'

const { asset } = useAssetInfoStore()
let nameData = ref<string[]>([]);
let upFlow = ref<number[]>([]);
let downFlow = ref<number[]>([]);

onMountedOrActivated(() => {
  getFlowByDay()
})

// echart初始化
const dayChartRef = ref<HTMLDivElement | null>(null);
const colorScheme = getColorSchemeMode() as ('light' | 'dark')
const { setOptions } = useECharts(dayChartRef as Ref<HTMLDivElement>, colorScheme);

const getFlowByDay = () => {
  let start = dayjs().startOf('month').toISOString();
  let end = dayjs().endOf('month').toISOString();
  queryAssetTrafficByDayApi({
    createTime: [start, end],
    ip: asset.assetIp,
  }).then((res: { key: string; value: [number, number] }[]) => {
    nameData.value = [];
    upFlow.value = [];
    downFlow.value = [];
    if (res && Array.isArray(res)) {
      res.forEach((item) => {
        nameData.value.push(formatToDate(item.key, 'YYYY-MM-DD'));
        downFlow.value.push(item.value[0]);
        upFlow.value.push(item.value[1]);
      });
    }
    nextTick(() => {
      initFlowDayChart();
    })
  });
};

const isBpsUnit = computed(() => {
  const upFlowMax = Math.max(...upFlow.value);
  const downFlowMax = Math.max(...downFlow.value);
  return upFlowMax < 1000 && downFlowMax < 1000;
});

const initFlowDayChart = () => {
  setOptions({
    title: {
      text: t('日流量趋势（当月）'),
      textStyle: {
        fontSize: '12px',
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        if (params.length > 0) {
          let str = params[0].name;
          params.forEach((item) => {
            str += '<br/>' + item.seriesName + '：' + (item.value / 1000) + isBpsUnit.value ? ' bps' : ' Kbps';
          });
          return str;
        } else {
          return '';
        }
      },
    },
    legend: {
      show: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: nameData.value,
      axisLine: {
        show: true,
      },
    },
    yAxis: {
      type: 'value',
      name: isBpsUnit.value ? 'bps' : 'Kbps',
      minInterval: isBpsUnit.value ? 0 : 1000,
      axisLabel: {
        formatter: function (params) {
          let r = params;
          if (params > 999) {
            r = params / 1000;
          }
          return String(r);
        },
      },
      axisLine: {
        show: true,
      },
    },
    series: [
      {
        name: t('下行流量'),
        type: 'line',
        smooth: true,
        data: downFlow.value,
      },
      {
        name: t('上行流量'),
        type: 'line',
        smooth: true,
        data: upFlow.value,
      },
    ],
  });
};
</script>