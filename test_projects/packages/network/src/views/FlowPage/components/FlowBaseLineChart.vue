<!--
 * @Name: 迁移时未使用
 * @Description: 迁移时未使用
 * @Author: bwb
-->
<template>
  <div class="flowChart" ref="flowChartRef"> </div>
</template>
<script setup name="FlowBaseLineChart" lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import dayjs from 'dayjs';
import {
  queryTrafficTrendHourApi,
  queryAssetTrafficByHourApi,
  queryProtocolTrendByHourApi,
} from '../../../model/flow';
import { formatToDate } from '@guolisec/utils';
import * as echarts from "echarts"

const props = defineProps({
  params: {
    type: Object,
    default: () => {
      return { createTime: [], sn: '', networkInterface: '' };
    },
  },
  flowName: {
    type: String,
    default: 'trend',
  },
});

// 获取流量趋势-小时-平均
const getQueryTrafficTrendHour = (params?) => {
  return queryTrafficTrendHourApi(params).then((res) => {
    return res;
  });
};

const getData = () => {
  getDayData();
};

const getDayData = async () => {
  const yesterdayTime = [
    dayjs().startOf('day').subtract(1, 'day').toISOString(),
    dayjs().endOf('day').subtract(1, 'day').toISOString(),
  ];
  let yesterday = null;
  let today = null;
  if (props.flowName === 'trend') {
    yesterday = await getQueryTrafficTrendHour({
      ...props.params,
      createTime: yesterdayTime,
    });
    today = await getQueryTrafficTrendHour(props.params);
  } else if (props.flowName === 'asset') {
    yesterday = await queryAssetTrafficByHourApi({
      ...props.params,
      createTime: yesterdayTime,
    });
    today = await queryAssetTrafficByHourApi(props.params);
  } else if (props.flowName === 'protocol') {
    yesterday = await queryProtocolTrendByHourApi({
      ...props.params,
      createTime: yesterdayTime,
    });
    today = await queryProtocolTrendByHourApi(props.params);
  }

  getFlowData(yesterday, today, 'HH:mm');
};

// echart初始化
const flowChartRef = ref<HTMLDivElement | null>(null);

let nameDataY = ref<any[]>([]);
let nameDataT = ref<any[]>([]);
let upFlowY = ref<any[]>([]);
let downFlowY = ref<any[]>([]);
let upFlowT = ref<any[]>([]);
let downFlowT = ref<any[]>([]);
let upFlowMax = ref(0);
let downFlowMax = ref(0);

const isBpsUnit = computed(() => {
  upFlowMax.value = Math.max(...upFlowT.value);
  downFlowMax.value = Math.max(...downFlowT.value);
  return upFlowMax.value < 1000 && downFlowMax.value < 1000;
});

// 获取流量数据
const getFlowData = (yesterdayData, todayData, formatStr) => {
  nameDataY.value = [];
  nameDataT.value = [];
  upFlowY.value = [];
  downFlowY.value = [];
  upFlowT.value = [];
  downFlowT.value = [];
  let yData = yesterdayData;
  if (yData) {
    yData.forEach((item) => {
      nameDataY.value.push(formatToDate(item.key, formatStr));
      downFlowY.value.push(item.value[0]);
      upFlowY.value.push(item.value[1]);
    });
  }
  let tData = todayData;
  if (tData) {
    tData.forEach((item) => {
      nameDataT.value.push(formatToDate(item.key, formatStr));
      downFlowT.value.push(item.value[0]);
      upFlowT.value.push(item.value[1]);
    });
  }
  initFlowChart();
};

const initFlowChart = () => {
  const opt = {
    grid: {
      left: '8%',
      right: '10%',
      bottom: '15%',
      top: '22%',
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const v1 = params[0]?.value !== undefined ? params[0]?.value : '-';
        const v2 = params[1]?.value !== undefined ? params[1]?.value : '-';
        const v3 = params[2]?.value !== undefined ? params[2]?.value : '-';
        const v4 = params[3]?.value !== undefined ? params[3]?.value : '-';
        return (
          params[0]?.name +
          '<br/>昨日下行流量：' +
          v1 +
          ' bps<br/>' +
          '昨日上行流量：' +
          v2 +
          ' bps' +
          '<br/>今日下行流量：' +
          v3 +
          ' bps<br/>' +
          '今日上行流量：' +
          v4 +
          ' bps'
        );
      },
    },
    legend: {
      show: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: nameDataY.value,
      axisLine: {
        lineStyle: {
          color: '#ffffff',
          opacity: 0.2,
        },
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
        lineStyle: {
          color: '#ffffff',
          opacity: 0.2,
        },
      },
    },
    series: [
      {
        name: '昨日下行流量',
        type: 'line',
        smooth: true,
        data: downFlowY.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(318, 217, 188, 1)',
            },
            {
              offset: 1,
              color: 'rgba(288, 300, 88, 0.1)',
            },
          ]),
        },
      },
      {
        name: '昨日上行流量',
        type: 'line',
        smooth: true,
        data: upFlowY.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(198, 198, 255, 1)',
            },
            {
              offset: 1,
              color: 'rgba(198, 98, 255, 0.1)',
            },
          ]),
        },
      },
      {
        name: '今日下行流量',
        type: 'line',
        smooth: true,
        data: downFlowT.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(118, 217, 188, 1)',
            },
            {
              offset: 1,
              color: 'rgba(118, 217, 188, 0.1)',
            },
          ]),
        },
      },
      {
        name: '今日上行流量',
        type: 'line',
        smooth: true,
        data: upFlowT.value,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(98, 198, 255, 1)',
            },
            {
              offset: 1,
              color: 'rgba(98, 198, 255, 0.1)',
            },
          ]),
        },
      },
    ],
  };
  if (upFlowMax.value < 2 && downFlowMax.value < 2) {
    // @ts-ignore
    opt.yAxis.max = function (value) {
      return value.max + 5;
    };
  }
  chart1.value.setOptions(opt)
};
const chart1 = ref();
onMounted(() => {
  chart1.value = echarts.init(flowChartRef.value as HTMLDivElement)
})
watchEffect(() => {
  getData();
});
</script>
<style scoped>
.flowChart {
  width: 100%;
  height: 200px;
}
</style>
