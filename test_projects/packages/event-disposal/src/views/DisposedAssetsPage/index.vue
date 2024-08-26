<!--
 * @name: 已处置资产
 * @author: bwb
-->

<template>
  <Form :model="form" :rules="rules" class="w-[100%]">
    <Row justify="space-between" class="p-x-10">
      <Col :span="6">
        <FormItem label="IP 地址" name="ip">
          <Input
            v-model:value="form.ip"
            :placeholder="'请输入IP 地址'"
            :maxlength="30"
            :autocomplete="'off'"
          />
        </FormItem>
      </Col>
      <Col :span="8" />
      <Col :span="7" align="end">
        <Button @click="clear()" style="color: gray" class="m-r-2">重置</Button>
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
  <div class="disposed-assets-pos w-[100%]">
    <Table
      :loading="loading"
      :data-source="data.list"
      :columns="columns"
      :pagination="pagin"
      :size="'small'"
      @change="handleChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'oparetion'">
          <Button type="link" @click="toHandleModal(record)">详情</Button>
          <Button type="link" @click="handleTurnTo(record)">已处置事件</Button>
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
import { onMounted, reactive, ref } from 'vue'
import { Form, Row, Col, FormItem, Input, Button, Table, Tag } from 'ant-design-vue'
import { getDealAssetPage } from '../../service/assets'
import { columns } from './colums'
import { getRules } from '../../utils/formRules'
import { getPagin } from '../../utils/pagination'
import { listType } from '../../types/disposedAssetType'
import { useRouter } from '@guolisec/routerable'

const parentFunc = defineEmits(['handleGo', 'update:content'])
const handleTurnTo = (record) => {
  parentFunc('update:content', record.assetIp + '-' + record.assetMac)
  parentFunc('handleGo')
}
const form = reactive<{ ip: string | undefined }>({ ip: undefined })
const disable = ref(false)
const loading = ref(false)
const rules = getRules(disable)
const colorTable = ['#ff4d4f', '#52c41a', '#faad14']
const query = () => {
  loading.value = true
  getDealAssetPage({
    page: data.current,
    size: data.pageSize,
    sort: 'createTime,desc',
    treat: true,
    ip: form.ip
  }).then((res) => {
    data.total = res.totalElements
    let indexShow = data.pageSize * (data.current - 1) + 1
    loading.value = false
    data.list = res.content.map((value) => {
      return {
        indexShow: indexShow++,
        index: value.id ?? 'undefined',
        name: value.name ?? '-',
        assetIp: value.assetIp ?? '-',
        assetMac: value.assetMac ?? '-',
        assetTypeName: value.assetTypeName ?? '-',
        assetSeriesName: value.assetSeriesName ?? '-',
        // 更改获取方式 与详情同步
        assetField: value?.assetField?.name ?? '-',
        label: value.assetGroup.label ?? '-',
        runStatus: value.runStatus ?? '-'
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
const clear = () => {
  form.ip = undefined
}
const data = reactive<{ list: listType[]; current: number; total: number; pageSize: number }>({
  list: [],
  current: 1,
  total: 0,
  pageSize: 10
})
const pagin = getPagin(data)
onMounted(() => {
  query()
})
const handleChange = (e) => {
  data.pageSize = e.pageSize
  data.current = e.current
  query()
}
</script>

<style scoped>
.disposed-assets-pos {
  width: 96%;
  position: relative;
  left: 2%;
}
</style>
