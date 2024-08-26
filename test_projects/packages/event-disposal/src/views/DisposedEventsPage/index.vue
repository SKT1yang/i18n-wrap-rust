<!--
 * @name: 已处置事件
 * @author: bwb
-->

<template>
  <div id="disposed-evemts-container">
    <FormHead v-model:selectedObj="selectedObj" :treat="true" @query="query" />
    <FormBody @query="query" />
  </div>
</template>

<script lang="ts" setup>
import FormHead from './components/FormHead.vue'
import FormBody from './components/formBody.vue'
import { reactive, onMounted } from 'vue'
import { showUnTreatEvent, pageType } from '../../service/Form'
import { dateUtil } from '../../utils/index'
import { useFormStore } from '../../model/form'
import { useRoute } from '@guolisec/routerable'
import { SelectedObj } from '../../types/disposedEventType'
import { clearBrowserUrlQuery } from '@guolisec/utils'

const route = useRoute()
const { data_disposed } = useFormStore()
const query = () => {
  const scoreTable = { 高风险: 10, 中风险: 5, 低风险: 2, 信息: 0 }
  const params: pageType = {
    size: data_disposed.pageSize,
    page: data_disposed.current,
    sort: data_disposed.sort,
    treat: true,
    score: selectedObj.threat ? scoreTable[selectedObj.threat] : undefined,
    ip: selectedObj.ip,
    dstIp: selectedObj.targetIP,
    srcIps: selectedObj.IP,
    mac: selectedObj.MAC,
    logSourceName: selectedObj.logSourceName,
    unionId: selectedObj.assetSearchID,
    logSourceTypeName: selectedObj.logSourceType,
    eventType: selectedObj.mulitMode,
    name: selectedObj.event ?? undefined,
    statusType: selectedObj.statusType
  }
  // 接口要求没有时间时候不要有key
  if (selectedObj.time && selectedObj.time.length > 0) {
    params.createTime = selectedObj.time!
  }
  showUnTreatEvent(params).then((res) => {
    let index = 1 + data_disposed.pageSize * (data_disposed.current - 1)
    data_disposed.total = res.totalElements
    data_disposed.list = res.content.map((value) => {
      let timeReg = /(.{10})T(.{8})\./
      let createTime =
        value.createTime.match(timeReg)![1] + ' ' + value.createTime.match(timeReg)![2]
      return {
        ...value,
        key: value.id,
        index: index++,
        createTime,
        logSourceTypeName: value.logSourceTypeName ?? '-',
        logSourceName: value.logSourceName ?? '-',
        srcAssetName: value.srcAssetName ?? '-',
        eventName: value.eventName ?? '-',
        eventLevel: value.eventLevel ?? '-',
        naturalLanguageDescription: value.naturalLanguageDescription ?? '-',
        details: value.details ?? '-',
        dstIp: value.dstIp ?? '-'
      }
    })
  })
}

let selectedObj = reactive<SelectedObj>({
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
  statusType: undefined,
  threatLevel: undefined
})

onMounted(() => {
  selectedObj.threat = (route.query.level as string) ?? undefined
  selectedObj.assetSearchID = (route.query.content as string) ?? undefined
  query()
  clearBrowserUrlQuery('hash')
  //这个页面可能可以从其他页面跳转
})
</script>
<style scoped>
#disposed-evemts-container {
  margin: 0;
  padding: 0;
  max-width: 100%;
}
</style>
