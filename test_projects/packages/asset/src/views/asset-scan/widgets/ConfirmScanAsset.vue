<!--
 * @name: 待确认资产
 * @description: 资产经过扫描后，需要手动确认信息
-->
<template>
  <div>
    <div class="text-md font-bold mb-4">待确认资产</div>
    <Tabs v-model:active-key="tabsKey" destroy-inactive-tab-pane type="card">
      <TabPane key="TableStockAsset">
        <template #tab>
          <span>待入库</span>
          <span class="ml-2">{{ stockCount }}</span>
        </template>
        <TableStockAsset @refresh="refreshStock" />
      </TabPane>
      <TabPane key="CardListVerifyAsset" forceRender>
        <template #tab>
          <span>待核实</span>
          <span class="ml-2">{{ verifyCount }}</span>
        </template>
        <CardListVerifyAsset @refresh="refreshVerify" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script lang='ts' setup>
import { ref } from "vue"
import {
  Tabs, TabPane,
} from "ant-design-vue"
import TableStockAsset from '../stock/TableStockAsset.vue'
import CardListVerifyAsset from '../verify/CardListVerifyAsset.vue'

const tabsKey = ref('TableStockAsset') // 值为资产状态

const stockCount = ref(0)
const verifyCount = ref(0)

function refreshStock(total: number) {
  stockCount.value = total
}

function refreshVerify(total: number) {
  verifyCount.value = total
}
</script>