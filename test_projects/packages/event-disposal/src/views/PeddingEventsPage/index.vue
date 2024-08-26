<!--
 * @name: 待处置事件
 * @author: bwb
 * @description: 待处置事件
-->

<template>
  <div id="pedding-event-container" class="min-w-[1200px]">
    <FormHead v-model:selectedObj="selectedObj" @query="query" />
    <div style="margin-top: 10px">
      <FormBody @query="query" :map1="map1.length" :map2="map2.length" :map3="map3.length" />
    </div>
  </div>
</template>

<script lang="ts" setup>
/* 类型文件 */

/* 第三方模块 */
import { reactive, onMounted, ref } from 'vue'
import { useRoute } from '@guolisec/routerable'
import * as echarts from 'echarts'
import { clearBrowserUrlQuery } from '@guolisec/utils'
/* 本地模块 */
import FormHead from './components/FormHead.vue'
import FormBody from './components/FormBody.vue'
import {
  showUnTreatEvent,
  countUntreatedEventByEventNameReport,
  countUntreatedEventByEventLevelReport,
  countUntreatedEventBySrcIpReport
} from '../../service/Form'
import { dateUtil } from '../../utils/index'
import { useFormStore } from '../../model/form'
import { option, option2, option3 } from './options4echarts'

let { data } = useFormStore()
let selectedObj = reactive({
  time: [
    dateUtil(new Date().toString()).format('YYYY-MM-DD ') + '00:00:00',
    dateUtil(new Date().toString()).format('YYYY-MM-DD ') + '23:59:59'
  ],
  mode: undefined,
  mulitMode: undefined,
  mulitModeValue: undefined,
  event: undefined,
  threat: undefined,
  IP: undefined,
  targetIP: undefined,
  ip: undefined,
  MAC: undefined,
  assetSearchID: undefined,
  logSourceType: undefined,
  logSourceName: undefined,
  statusType: undefined
})
type resultType = { count: number; eventName: string }[]
type resultType2 = { count: number; srcIp: string }[]
let map1 = ref<resultType>([])
let map2 = ref<resultType>([])
let map3 = ref<resultType2>([])

type dom = null | HTMLDivElement | echarts.ECharts
type Echarts = null | echarts.ECharts
let dom: dom = null,
  dom2: dom = null,
  dom3: dom = null,
  myChart: Echarts = null,
  myChart2: Echarts = null,
  myChart3: Echarts = null

const query = async () => {
  const scoreTable = { 高风险: 10, 中风险: 5, 低风险: 2, 信息: 0 }
  const mulitMode = selectedObj.mulitMode
  const eventType = mulitMode ? mulitMode[mulitMode.length - 1] : undefined
  showUnTreatEvent({
    size: data.pageSize,
    page: data.current,
    sort: data.sort,
    treat: false,
    createTime: selectedObj.time! as string[],
    score: selectedObj.threat ? scoreTable[selectedObj.threat] : undefined,
    ip: selectedObj.ip,
    dstIp: selectedObj.targetIP,
    srcIps: selectedObj.IP,
    mac: selectedObj.MAC,
    logSourceName: selectedObj.logSourceName,
    unionId: selectedObj.assetSearchID,
    logSourceTypeName: selectedObj.logSourceType,
    eventType: eventType,
    name: selectedObj.event ?? undefined,
    statusType: selectedObj.statusType
  }).then((res) => {
    data.list = []
    let index = 1 + data.pageSize * (data.current - 1)
    data.total = res.totalElements
    data.list = res.content.map((value) => {
      let timeReg = /(.{10})T(.{8})\./
      let time = value.createTime.match(timeReg)![1] + ' ' + value.createTime.match(timeReg)![2]
      return {
        key: value.id,
        index: index++,
        time,
        eventName: value.eventName ?? '-',
        threatLeval: value.eventLevel ?? '-',
        eventLevel: value.eventLevel ?? '-',
        eventDetail: value.naturalLanguageDescription ?? '-',
        eventSource: value.srcAssetName ?? '-',
        eventTarget: value.dstAssetName ?? '-',
        logSource: value.logSourceIp ?? '-',
        // 决定是否展示合并详情按钮
        compose: value.compose ?? '-',
        details: value.details ?? '-'
      }
    })
    Promise.all([
      countUntreatedEventByEventLevelReport({
        start: selectedObj.time[0],
        end: selectedObj.time[1],
        treat: false
      }),
      countUntreatedEventByEventNameReport({
        start: selectedObj.time[0],
        end: selectedObj.time[1],
        treat: false
      }),
      countUntreatedEventBySrcIpReport({
        start: selectedObj.time[0],
        end: selectedObj.time[1],
        treat: false,
        filterZero: true
      })
    ]).then(([res1, res2, res3]) => {
      map1.value = res1
      map2.value = res2
      map3.value = res3
      initEacharts(map1, map2, map3)
    })

    clearBrowserUrlQuery('hash')
  })
}
onMounted(() => {
  // 处理其他页面跳转传参
  const route = useRoute()
  if (route) {
    const query = route.query
    if (query.statusType !== undefined) {
      selectedObj.statusType = Number(query.statusType) as any
    }
  }
  query()
  dom = document.getElementById('pie') as HTMLDivElement
  dom2 = document.getElementById('pie2') as HTMLDivElement
  dom3 = document.getElementById('pie3') as HTMLDivElement
  myChart = echarts.init(dom, undefined, {
    renderer: 'canvas',
    useDirtyRect: false
  })
  myChart2 = echarts.init(dom2, undefined, {
    renderer: 'canvas',
    useDirtyRect: false
  })
  myChart3 = echarts.init(dom3, undefined, {
    renderer: 'canvas',
    useDirtyRect: false
  })
})

const initEacharts = (map1, map2, map3) => {
  let mapdata1: { name: string; value: number }[] = []
  let mapdata2: { eventName: string[]; count: number[] } = { eventName: [], count: [] }
  let mapdata3: { eventName: string[]; count: number[] } = { eventName: [], count: [] }
  const riskTable = ['高风险', '中风险', '低风险', '信息']
  map1.value.forEach((value) => {
    mapdata1.push({ name: riskTable[value.eventLevel - 1], value: value.count })
  })
  mapdata2.count = []
  mapdata2.eventName = []
  map2.value.forEach((value) => {
    mapdata2.count.push(value.count)
    mapdata2.eventName.push(value.eventName)
  })
  mapdata2.count.reverse()
  mapdata2.eventName.reverse()
  mapdata3.count = []
  mapdata3.eventName = []
  map3.value.forEach((value) => {
    mapdata3.count.push(value.count)
    mapdata3.eventName.push(value.srcIp)
  })
  // 使得数据从大到小
  mapdata3.count.reverse()
  mapdata3.eventName.reverse()
  myChart!.setOption(option(mapdata1))
  myChart2!.setOption(option2(mapdata2))
  myChart3!.setOption(option3(mapdata3))
  window.addEventListener('resize', () => {
    myChart!.resize()
    myChart2!.resize()
    myChart3!.resize()
  })
}
</script>
<style scoped>
#pedding-event-container {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-y: auto;
}
</style>
