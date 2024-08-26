<!--
 * @Name: 右侧echarts
 * @Description: 右侧echarts
 * @Author: bwb
-->
<template>
  <div class="hourChart" ref="hourChartRef"> </div>
</template>
<script setup name="FlowhourChart" lang="ts">
import { computed, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { queryTrafficTrendHourApi } from '../../../model/flow';
import * as echarts from "echarts"
import { formatToDate } from '@guolisec/utils';

// 父组件传值
const props = defineProps({
  searchForm: {
    type: Object,
    default() {
      return {};
    },
  },
});

let nameData = ref<any[]>([]);
let upFlow = ref<any[]>([]);
let downFlow = ref<any[]>([]);

// echart初始化
const hourChartRef = ref<HTMLDivElement | null>(null);
const chart1 = ref();

onMounted(() => {
  chart1.value = echarts.init(hourChartRef.value!)
})

const getFlowByHour = () => {
  let start = dayjs().startOf('day').toISOString();
  let end = dayjs().endOf('day').toISOString();
  queryTrafficTrendHourApi({
    createTime: [start, end],
    sn: props.searchForm.sn,
    networkInterface: props.searchForm.networkInterface,
  }).then((res) => {
    nameData.value = [];
    upFlow.value = [];
    downFlow.value = [];
    if (res) {
      res.forEach((item) => {
        nameData.value.push(formatToDate(item.key, 'HH时'));
        downFlow.value.push(item.value[0]);
        upFlow.value.push(item.value[1]);
      });
    }
    initFlowHourChart();
  });
};

const isBpsUnit = computed(() => {
  const upFlowMax = Math.max(...upFlow.value);
  const downFlowMax = Math.max(...downFlow.value);
  return upFlowMax < 1000 && downFlowMax < 1000;
});

const initFlowHourChart = () => {
  chart1.value.setOption({
    title: {
      text: '时流量趋势(当日)',
      textStyle: {
        fontSize: '12px',
        color: '#fff'
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        if (params.length > 0) {
          let str = params[0].name;
          params.forEach((item) => {
            str += '<br/>' + item.seriesName + '：' + item.value + ' bps';
          });
          return str;
        } else {
          return '';
        }
      },
    },
    legend: {
      show: true,
      textStyle: {
        color: '#fff'
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: nameData.value,
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
    },
    series: [
      {
        name: '下行流量',
        type: 'line',
        smooth: true,
        data: downFlow.value,
      },
      {
        name: '上行流量',
        type: 'line',
        smooth: true,
        data: upFlow.value,
      },
    ],
  });
};

// 暴露变量
defineExpose({
  getFlowByHour,
});
</script>
<style scoped>
.hourChart {
  height: 100%;
  width: 100%;
}
</style>
