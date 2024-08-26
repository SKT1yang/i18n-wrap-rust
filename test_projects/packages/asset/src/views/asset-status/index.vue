<template>
  <div class="min-w-350">
    <Row justify="space-between">
      <Col :span="15">
      <div ref="chartdom1" class="h-90"></div>
      </Col>
      <Col :span="8">
      <div ref="chartdom2" class="h-90"></div>
      </Col>
    </Row>
    <StatusTable :hidden-features="hiddenFeatures"></StatusTable>
  </div>
</template>

<script lang='ts' setup>
import { Row, Col } from "ant-design-vue"
import { ref, onMounted, watch, computed, } from "vue"
import type { PropType } from 'vue'
import type { Features } from './context/useStatusContext'
import * as echarts from "echarts"
import { countByAssetGroupStatusAPI, countAssetByStatusAPI } from "@/model/status"
import StatusTable from "./components/StatusTable.vue"
import { useColorSchemeMode, provideContext } from "@guolisec/utils"
import { cssVar } from '@guolisec/utils'

/* 资产健康监测项目中的资产状态只有在线和离线两种状态, 没有闲置状态 */
const props = defineProps({
  status: {
    type: Array as PropType<(1 | 2 | 0)[]>,
    default: () => [0, 1, 2]
  }, // 0: 离线; 1: 在线; 2: 闲置
  hiddenFeatures: {
    type: Object as PropType<Features>,
    default: () => []
  },
})

const hiddenFeatures = computed(() => {
  let result = [...props.hiddenFeatures]
  result = Array.from(new Set(result))
  return result
})

provideContext('assetStatus::statusList', props.status)

const statusList = computed(() => {
  // 按照在线、闲置、离线的顺序显示数据
  return ([1, 2, 0] as (0 | 1 | 2)[]).filter(value => props.status.indexOf(value) > -1)
})

const chartdom1 = ref()
const chartdom2 = ref()
let chart1: echarts.ECharts | null = null
let chart2: echarts.ECharts | null = null

const { colorSchemeMode } = useColorSchemeMode()

let xAxisData: string[] = [];
let offlineArr: number[] = [];
let onlineArr: number[] = [];
let freelineArr: number[] = [];

let assetOnlineCount = 0;
let assetOfflineCount = 0;
let assetFreeCount = 0;

watch(colorSchemeMode, async () => {
  await renderDistribution()
  await renderStatus()
})
onMounted(async () => {
  await renderDistribution()
  await renderStatus()
})


async function renderDistribution() {
  const value = await countByAssetGroupStatusAPI()
  value.forEach((item) => {
    xAxisData.push(item.label);
    offlineArr.push(item.assetStatusList[0].count);
    onlineArr.push(item.assetStatusList[1].count);
    freelineArr.push(item.assetStatusList[2].count);
  })

  chart1 && chart1.dispose()
  chart1 = echarts.init(chartdom1.value, colorSchemeMode.value)
  chart1.setOption(getOption())
}

async function renderStatus() {
  chart2 && chart2.dispose()
  chart2 = echarts.init(chartdom2.value, colorSchemeMode.value)
  const res = await countAssetByStatusAPI()
  res.forEach((e) => {
    if (e.status === 0) {
      assetOfflineCount = e.count;
    } else if (e.status === 1) {
      assetOnlineCount = e.count;
    } else if (e.status === 2) {
      assetFreeCount = e.count;
    }
  });
  chart2.setOption(option2(assetOnlineCount, assetOfflineCount, assetFreeCount))
}

const getOption = () => {
  return {
    color: statusList.value.map(status => {
      if (status === 0) {
        return cssVar('--red-6')
      } else if (status === 1) {
        return cssVar('--green-6')
      } else {
        return cssVar('--color-border')
      }
    }),
    backgroundColor: 'transparent',
    title: {
      text: '资产分布',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: statusList.value.map(status => {
        console.log(status, 'statusList.value')
        if (status === 1) {
          return '在线'
        } else if (status === 0) {
          return '离线'
        } else {
          return '闲置'
        }
      })
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '10%',
      containLabel: true,
    },
    dataZoom: [
      {
        type: 'inside',
        start: 40,
        end: 70,
        maxValueSpan: 9,
      },
      {
        type: 'slider',
        show: true,
        start: 40,
        end: 70,
        height: 20,
        bottom: 10,
        showDataShadow: false,
      },
    ],
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: xAxisData,
      axisLabel: {
        interval: 0,
        width: 90,
        overflow: 'break',
      },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
    },
    series: statusList.value.map(status => {
      console.log(status, 'status')
      if (status === 1) {
        return {
          name: '在线',
          type: 'bar',
          stack: '总量',
          barWidth: '60%',
          data: onlineArr,
        }
      } else if (status === 0) {
        return {
          name: '离线',
          type: 'bar',
          stack: '总量',
          barWidth: '60%',
          data: offlineArr,
        }
      } else {
        return {
          name: '闲置',
          type: 'bar',
          stack: '总量',
          barWidth: '60%',
          data: freelineArr
        }
      }
    })
  }
}

let option2 = (assetOnlineCount, assetOfflineCount, assetFreeCount) => ({
  color: statusList.value.map(status => {
    if (status === 0) {
      return cssVar('--red-6')
    } else if (status === 1) {
      return cssVar('--green-6')
    } else {
      return cssVar('--color-border')
    }
  }),
  backgroundColor: 'transparent',
  title: {
    text: '资产状态',
  },
  tooltip: {
    show: true,
  },
  legend: {
    show: true,
  },
  series: {
    name: '资产状态',
    type: 'pie',
    center: ['50%', '60%'],
    radius: [0, '50%'],
    data: statusList.value.map(status => {
      if (status === 1) {
        return { name: '在线', value: assetOnlineCount }
      } else if (status === 0) {
        return { name: '离线', value: assetOfflineCount }
      } else {
        return { name: '闲置', value: assetFreeCount }
      }
    })
  },
})
</script>