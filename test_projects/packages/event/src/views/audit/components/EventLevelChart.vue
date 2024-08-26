<!--
 * @name: 工控事件图表
 * @author: bwb
 * @description: 迁移时没有被使用
 * @path: \event\src\views\audit\components\EventLevelChart.vue
-->
<template>
  <div style="width: 100%; height: 100%">
    <div v-show="chartData.length > 0" class="eventLevelChart" ref="chartRef"> </div>
    <Empty v-show="chartData.length === 0" :image="simpleImage" class="emptyStyle" />
  </div>
</template>
<script setup name="EventLevelChart" lang="ts">
import { nextTick, ref, watchEffect, onMounted } from 'vue';
import { Empty } from 'ant-design-vue';
import * as echarts from "echarts";

import { getCountUntreatedEventByEventLevelReportApi } from '../../../model/event';

// 父组件传值
const props = defineProps({
  start: {
    type: String,
    default() {
      return '';
    },
  },
  end: {
    type: String,
    default() {
      return '';
    },
  },
  treat: {
    type: Boolean,
    default() {
      return false;
    },
  },
  api: {
    type: Function,
    default() {
      return () => { };
    },
  },
});

const chartRef = ref<HTMLDivElement | null>(null);
const mychart = ref()

onMounted(() => {
  mychart.value = echarts.init(chartRef.value!)
})
// 暂无数据图片
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

let chartData = ref<
  {
    eventLevel: number;
    count: number;
  }[]
>([]);

const getData = () => {
  getCountUntreatedEventByEventLevelReport();
  props.api();
};

const getCountUntreatedEventByEventLevelReport = () => {
  getCountUntreatedEventByEventLevelReportApi({
    start: props.start,
    end: props.end,
    treat: props.treat,
  }).then((res) => {
    const arr = res.sort((a, b) => {
      return b.eventLevel - a.eventLevel;
    });
    chartData.value = arr;
    nextTick(() => {
      if (chartData.value.length > 0) {
        initChart();
      }
    });
  });
};

const initChart = () => {
  let data: any[] = [];
  chartData.value.forEach((item) => {
    const arr = ['高风险', '中风险', '低风险', '信息'];
    data.push({
      name: arr[Number(item.eventLevel) - 1],
      value: item.count,
    });
  });

  mychart.value.setOption(
    {
      color: ['#85ffdb', '#ffe38c', '#ffbc8c', '#ff938c'],
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return (
            params.marker +
            params.name +
            "<span style='font-weight: bolder;margin-left: 8px;'>" +
            params.value +
            '个' +
            '</span>'
          );
        },
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: '数量',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          minAngle: 10,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#151515',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    },
    false,
  );
};

// 暴露变量
defineExpose({
  // getData,
});

watchEffect(() => {
  getData();
});
</script>

<style scoped>
.eventLevelChart {
  width: 100%;
  height: 100%;
}

.emptyStyle {
  margin: 0px;
  padding-top: 10%;
}
</style>
