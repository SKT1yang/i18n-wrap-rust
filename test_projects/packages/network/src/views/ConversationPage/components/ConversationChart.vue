<!--
 * @Name: 协议绘画TOP10
 * @Description: 右侧柱状图
 * @Author: bwb
-->
<template>
  <div class="barChart" ref="barChartRef"> </div>
</template>
<script setup name="FlowDayChart" lang="ts">
import { onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { querySessionTop10Api } from '../../../model/conversation';
import * as echarts from "echarts"

// 父组件传值
const props = defineProps({
  searchForm: {
    type: Object,
    default() {
      return {};
    },
  },
});

let xAxisData = ref<any[]>([]);
let seriesData = ref<any[]>([]);

// echart初始化
const barChartRef = ref<HTMLDivElement | null>(null);
const chart1 = ref();
onMounted(() => {
  chart1.value = echarts.init(barChartRef.value!)
})
const getData = () => {
  querySessionTop10Api({
    createTime: [
      dayjs(props.searchForm.dateRange[0]).format(),
      dayjs(props.searchForm.dateRange[1]).format(),
    ],
    sn: props.searchForm.sn,
  }).then((res) => {
    xAxisData.value = [];
    seriesData.value = [];
    for (let item of res) {
      xAxisData.value.push(item.key);
      seriesData.value.push(item.value);
    }
    initFlowDayChart();
  });
};

const initFlowDayChart = () => {
  chart1.value.setOption({
    title: {
      text: '协议会话数Top10',
      textStyle: {
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      name: '协议',
      type: 'category',
      data: xAxisData.value,
      axisLabel: {
        interval: 0,
        rotate: 15,
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '20%',
    },
    yAxis: {
      type: 'value',
      name: '单位(个)',
      scale: true,
      axisLine: {
        show: true,
      },
    },
    series: {
      type: 'bar',
      data: seriesData.value,
      barWidth: 40,
      itemStyle: {
        color: (params) => {
          const colorList = [
            '#2ec7c9',
            '#d87a80',
            '#ffb980',
            '#5abaef',
            '#b6a2de',
            '#44d886',
            '#ffa335',
            '#5cab00',
            '#fd6934',
            '#2ea1f3',
          ];
          return colorList[params.dataIndex];
        },
      },
    },
  });
};

// 暴露变量
defineExpose({
  getData,
});
</script>
<style scoped lang="less">
.dayChart {
  height: 100%;
  width: 100%;
}
</style>
