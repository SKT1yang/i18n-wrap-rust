<!--
 * @name: Do not edit
 * @description: Do not edit
 * @path: \device\src\views\DevicePage\index.vue
-->
<template>
  <div class="device-page-border">
    <Row>
      <div class="device-page-title">设备管理</div>
    </Row>
    <Divider />
    <Tabs v-model:active-key="activeKey" tab-position="left">
      <template v-for="item in tabPanes" :key="item.assetSeriesCode">
        <TabPane :accesskey="item.assetSeriesCode" :tab="item.assetSeriesName">
          <template v-if="normalOneCode.includes(item.assetSeriesCode)">
            <NormalTable :parent-page="'device'" @query="query" v-model:searchForm="searchForm" />
          </template>
          <template v-else>
            <Hostgroup />
          </template>
        </TabPane>
      </template>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { Row, Divider, Tabs, TabPane } from 'ant-design-vue'
import { type, typeBack } from '../../service/devicePage'
import NormalTable from './components/NormalTable.vue'
import { queryAsset } from '../../model/device'
import { useStore } from '../../model/deviceStore'
import Hostgroup from './components/Hostgroup/Hostgroup.vue'

const { data } = useStore()
const normalOneCode = [
  2303488, 2303234, 2299904, 2298624, 2297856, 2296832, 2296576, 2296320, 2295808, 2295040
]
const activeKey = ref(1)
const searchForm = ref<any>({})
const tabPanes = ref<typeBack[]>([])
onMounted(() => {
  type().then((res) => {
    //当获取长度大于1的tabPanel 则选择第一个
    if (res.length > 0) {
      activeKey.value = res[0].assetSeriesCode
    }
    tabPanes.value = res
  })
})

const query = () => {
  queryAsset({
    ...searchForm.value,
    signP: 'null',
    assetModuleFlag: true,
    page: data.current,
    size: data.pageSize,
    sort: data.sort,
    register: 1,
    trademarkCode: activeKey.value === 2295808 ? undefined : 35,
    assetSeriesCodes: activeKey.value === 2295808 ? undefined : activeKey.value,
    assetTypeCode: activeKey.value === 2295808 ? 8 : undefined,
    sourceSeriesNotEqual: 'CSMP1000'
  }).then((res) => {
    data.list = res.content
    data.total = res.totalElements
  })
}

watch(
  activeKey,
  () => {
    data.key = activeKey.value
    // 切换清空表单
    Object.keys(searchForm.value).forEach((value) => {
      searchForm.value[value] = undefined
    })
    query()
  },
  {
    immediate: true
  }
)
</script>
<style scoped>
.device-page-title {
  font-weight: 600;
  font-size: 16px;
}

.device-page-border {
  border-radius: 1em;
  margin: 20px;
  padding: 1em;
}
</style>
