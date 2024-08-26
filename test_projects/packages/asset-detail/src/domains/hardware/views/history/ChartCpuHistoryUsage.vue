<!--
 * @name: 资产cpu历史使用率
 * @description: 通用，只要资产有cpu
-->

<template>
  <div v-if="showChart" class="h-50" ref="cpuChartRef"> </div>
  <Empty v-else />
</template>
<script setup lang="ts">
/* 类型文件 */
import type { CPURate } from '../../types/history'
/* 第三方模块 */
import { reactive, ref, nextTick, markRaw, PropType, watch, } from 'vue'
import { formatToDateTime, cssVar } from '@guolisec/utils';
import { Empty } from 'ant-design-vue';
import * as echarts from 'echarts';
/* 本地模块 */
import { queryResourceUsageApi } from '../../model/history';
import { useAssetInfoStore } from '@/entry/store';
import { t } from "@/entry/languages/useLanguage";

const props = defineProps({
  time: {
    type: Object as PropType<[string, string]>,
    default: () => []
  }
})

watch(() => props.time, () => {
  nextTick(() => {
    getData()
  })
}, { immediate: true })

// echarts实例对象在vue3中不能为响应式，reactive搭配markRaw使用，或者ref()改为shallowRef()，或者定义一个没有响应式的对象
const chart = reactive({
  cpuChart: null as any,
});
const cpuChartRef = ref()

let showChart = ref(false);

const { asset } = useAssetInfoStore()

// 获取 CPU 使用率
const getData = () => {
  let dateTime = [
    formatToDateTime(props.time[0]),
    formatToDateTime(props.time[1])
  ]
  const { assetIp, assetMac } = asset
  queryResourceUsageApi({
    assetIp, assetMac, dateTime,
  }).then((res) => {
    // 遍历 CPU 使用率，如果有有效值，渲染图表，否则不渲染图表
    let hasEffectiveValue = false
    const cpuList = res.map((cpu) => {
      if (typeof cpu.cpuRate === 'number' && cpu.cpuRate !== -1) {
        hasEffectiveValue = true
        return cpu
      } else {
        return { ...cpu, cpuRate: undefined }
      }
    })
    if (hasEffectiveValue) {
      showChart.value = true;
      nextTick(() => {
        initEcharts(cpuList);
      });
    } else {
      showChart.value = false;
    }
  });
};


const initEcharts = (data: Partial<CPURate>[]) => {
  let xAxisData = [] as any;
  let cpuSeriesData = [] as any;
  data.forEach((item) => {
    xAxisData.push(formatToDateTime(item.dateTime, 'YYYY-MM-DD HH:mm:ss'));
    cpuSeriesData.push(item.cpuRate);
  });
  if (chart.cpuChart) {
    chart.cpuChart.clear()
  }
  chart.cpuChart = markRaw(echarts.init(cpuChartRef.value));

  const color = cssVar('--blue-6')
  chart.cpuChart.setOption(
    getCommomOption(
      color,
      xAxisData,
      cpuSeriesData,
    ),
    false,
  );
};

const getCommomOption = (color, xAxisData, seriesData) => {
  return {
    color: color,
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: function (params) {
        const data = params[0];
        return (
          data.name +
          '<br>' +
          data.marker +
          "<span style='margin-left: 8px;'>" +
          'CPU 使用率'
          +
          '</span>'
          +
          "<span style='font-weight: bolder;margin-left: 16px;'>" +

          (typeof data.value === 'number' ? data.value +
            ' %' : t('暂无数据')) +
          '</span>'
        );
      },
    },
    grid: {
      top: 20,
      bottom: 50,
      right: 40,
    },
    xAxis: {
      type: 'category',
      nameGap: 50,
      data: xAxisData,
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value'
    },
    dataZoom: xAxisData.length > 60 ? [
      {
        type: 'inside',
        start: 90,
        end: 100,

      }, {
        start: 80,
        end: 100,
        height: 10,
        bottom: '15'
      }
    ] : undefined,
    series: {
      type: 'line',
      smooth: true,
      // symbol: 'none',
      data: seriesData,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: cssVar('--blue-4'),
            },
            {
              offset: 1,
              color: cssVar('--color-bg-layout'),
            },
          ],
        },
      },
      // markLine: {
      //   silent: true,
      //   symbol: 'none',
      //   lineStyle: {
      //     color: 'red',
      //     type: 'solid',
      //   },
      //   data: [
      //     {
      //       yAxis: markValue,
      //     },
      //   ],
      // },
    },
  };
};
</script>