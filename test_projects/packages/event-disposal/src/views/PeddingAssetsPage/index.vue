<!--
 * @name: 待处置资产
 * @author: bwb
-->

<template>
  <Form :rules="rules" :model="form" class="w-[100%]">
    <Row justify="space-between" class="p-x-10">
      <Col :span="6">
        <FormItem label="IP 地址" name="ip">
          <Input
            v-model:value="form.ip"
            :placeholder="profix + 'IP 地址'"
            :maxlength="30"
            :autocomplete="'off'"
          />
        </FormItem>
      </Col>
      <Col :span="6">
        <!-- <FormItem label="事件威胁等级">
        <Select v-model:value="levelIn" :placeholder="profix + '事件威胁等级'" mode="multiple" :options="types">
        </Select>
      </FormItem> -->
      </Col>
      <Col :span="6" :align="'end'" class="line">
        <Button @click="clear()" class="m-r-2" style="color: gray">重置</Button>
        <Button
          type="primary"
          @click="
            () => {
              data.current = 1
              query()
            }
          "
          :disabled="disable"
          size="middle"
          >查询</Button
        >
      </Col>
    </Row>
  </Form>
  <div class="pedding-assets-border w-[100%]">
    <Table
      :loading="loading"
      :size="'small'"
      :columns="columns"
      :data-source="data.list"
      :pagination="pagin"
      @change="handlePage"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'oparetion'">
          <Button type="link" @click="toHandleModal(record)">详情</Button>
          <Button type="link" @click="handleTurnTo(record)">待处置事件</Button>
        </template>
        <template v-if="column.dataIndex === 'runStatus'">
          <Tag :color="colorTable[record.runStatus]">
            {{ ['离线', '在线', '闲置'][record.runStatus] }}
          </Tag>
        </template>
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { Form, FormItem, Row, Col, Input, Button, Table, Tag } from 'ant-design-vue'
import { getDealAssetPage } from '../../service/assets'
import { getRules } from '../../utils/formRules'
import { columns } from './colums'
import { getPagin } from '../../utils/pagination'
import { useRouter } from '@guolisec/routerable'

const loading = ref(false)
const colorTable = ['#ff4d4f', '#52c41a', '#faad14']
const parentFunc = defineEmits(['handleGo', 'update:content'])
const handleTurnTo = (record) => {
  parentFunc('update:content', record.assetIp + '-' + record.assetMac)
  parentFunc('handleGo')
}
const profix = '请输入'
const levelIn = ref(),
  disable = ref(false)
const rules = getRules(disable)
const form = reactive<{ ip: string | undefined }>({ ip: undefined })
const table4Level = ['高风险', '中风险', '低风险', '信息']
// const types = [
//   { value: "高风险", label: "高风险" },
//   { value: "中风险", label: "中风险" },
//   { value: "低风险", label: "低风险" },
//   { value: "信息", label: "信息" }
// ]
const clear = () => {
  form.ip = undefined
  levelIn.value = []
}
const data = reactive<{ list: any[]; pageSize: number; current: number; total: number }>({
  list: [],
  pageSize: 10,
  current: 1,
  total: 0
})
const query = async (sorter?: string) => {
  let tempLevel = null
  loading.value = true
  if (levelIn.value != undefined) {
    tempLevel = levelIn.value.map((value) => {
      value = table4Level.indexOf(value) + 1
      return value
    })
  }
  form.ip = form.ip || undefined
  getDealAssetPage({
    page: data.current,
    size: data.pageSize,
    sort: sorter ?? undefined,
    treat: false,
    levelIn: tempLevel,
    ip: form.ip
  }).then((res) => {
    data.total = res.totalElements
    let showIndex = 1 + (data.current - 1) * data.pageSize
    loading.value = false
    data.list = res.content.map((value) => {
      return {
        index: value.id ?? 'undefined',
        name: value.name ?? '-',
        assetIp: value.assetIp ?? '-',
        assetMac: value.assetMac ?? '-',
        assetTypeName: value.assetTypeName ?? '-',
        assetSeriesName: value.assetSeriesName ?? '-',
        assetField: value?.assetField?.name ?? '-',
        assetGroup: value.assetGroup?.label ?? '-',
        runStatus: value.runStatus ?? '-',
        showIndex: showIndex++
      }
    })
  })
}
const toHandleModal = (row: any) => {
  const router = useRouter()
  router.push({
    name: 'AssetDetail',
    state: {
      id: row.index
    }
  })
}
const pagin = getPagin(data)
const handlePage = async (e, _fliter, sorter) => {
  data.pageSize = e.pageSize
  data.current = e.current
  if (sorter.order != undefined) {
    await query(sorter.field + ',' + (sorter.order as string).match(/(.*)end/)![1])
  } else {
    await query()
  }
}
onMounted(() => {
  query()
})
</script>
<style scoped>
.pedding-assets-border {
  width: 96%;
  position: relative;
  left: 2%;
}
</style>
