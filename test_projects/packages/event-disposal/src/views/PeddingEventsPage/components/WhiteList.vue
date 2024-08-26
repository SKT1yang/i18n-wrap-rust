<!--
 * @name: 白名单弹窗内容
 * @author: bwb
 * @description: 白名单弹窗内容
-->

<template>
  <Form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <Row justify="space-between">
      <Col :span="10">
        <FormItem label="事件名称">
          <Input v-model:value="eventName" :maxlength="30" autocomplete="off" />
        </FormItem>
      </Col>
      <Col>
        <Button @click="eventName = ''">重置</Button>
        <Button type="primary" @click="doquery" class="m-l-2">查询</Button>
        <Button
          type="default"
          @click="showDeleteInfo()"
          :disabled="selectedRowkeys.length == 0"
          class="m-l-2"
          >批量删除</Button
        >
      </Col>
    </Row>
  </Form>
  <Table
    ref="tableDom"
    :row-key="(row) => row.id"
    :row-selection="{
      selectedRowKeys: selectedRowkeys,
      onChange: (e) => {
        selectedRowkeys = e
      }
    }"
    :columns="columns"
    :data-source="data.list"
    bordered
    @change="handleChange"
    :pagination="pagin1"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'oparetion'">
        <Button type="text" danger @click="showDeleteInfo(record)">删除</Button>
      </template>
    </template>
  </Table>
</template>

<script lang="ts" setup>
import { Form, FormItem, Input, Table, Row, Col, Button, Modal, message } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { ref, onMounted, reactive, createVNode } from 'vue'
import { eventWhitelist, deleteEventWhitelist } from '../../../service/Form'
import { getPagin } from '../../../utils/pagination'
import type { TableColumnType } from 'ant-design-vue'

const tableDom = ref()
const selectedRowkeys = ref<any[]>([])
const eventName = ref('')
const columns: TableColumnType[] = [
  { title: '序号', dataIndex: 'index', width: '10%', align: 'center' },
  { title: '事件名称', dataIndex: 'eventName', width: '30%', align: 'center' },
  {
    title: '时间',
    dataIndex: 'createTime',
    defaultSortOrder: 'descend',
    sorter: true,
    width: '35%',
    align: 'center'
  },
  { title: '操作', dataIndex: 'oparetion', width: '10%', align: 'center' }
]
interface content {
  createTime: string
  eventId?: number
  eventName?: string
  id: number
}
const data = reactive<{ pageSize: number; total: number; current: number; list: content[] }>({
  pageSize: 10,
  total: 0,
  current: 1,
  list: []
})
const currentSort = ref<string | undefined>('createTime,desc')
const handleChange = (e, _filter, sorter) => {
  currentSort.value =
    sorter.order != undefined
      ? sorter.field + ',' + (sorter.order as string).match(/(.*)end/)![1]
      : undefined
  data.current = e.current
  data.pageSize = e.pageSize
  if (sorter.order != undefined) {
    query(eventName.value, sorter.field + ',' + (sorter.order as string).match(/(.*)end/)![1])
  } else {
    query(eventName.value)
  }
}
const pagin1 = getPagin(data)
const query = (keyword: string, sorter?) => {
  let index = 1 + (data.current - 1) * data.pageSize
  eventWhitelist({
    page: data.current,
    size: data.pageSize,
    eventName: keyword,
    sort: sorter
  }).then((res) => {
    data.list = res.content.map((value) => {
      //转换时间格式 iso-》YYYY-MM-DD hh:mm:ss
      let timeReg = /(.{10})T(.{8})\./
      let createTime =
        value.createTime.match(timeReg)![1] + ' ' + value.createTime.match(timeReg)![2]
      // 特殊处理 后端传递数据为空内容
      if (value.eventName == '') {
        value.eventName = undefined
      }
      return { id: value.id, index: index++, eventName: value.eventName ?? '-', createTime }
    })
    data.total = res.totalElements
  })
}
const showDeleteInfo = (row?: any) => {
  Modal.confirm({
    content: `确定要删除${row ? row.eventName : '选中内容'}吗?`,
    icon: createVNode(ExclamationCircleOutlined),
    onOk: () => {
      deleteEventWhitelist(row ? [row.id] : selectedRowkeys.value)
        .then((_) => {
          doquery()
          message.success('删除成功！')
        })
        .finally(() => {
          selectedRowkeys.value.length = 0
        })
    },
    okText: '确定',
    cancelText: '取消'
  })
}
onMounted(() => {
  eventName.value = ''
  query('', 'createTime,desc')
})
const doquery = () => {
  data.current = 1
  query(eventName.value, currentSort.value)
}
</script>
