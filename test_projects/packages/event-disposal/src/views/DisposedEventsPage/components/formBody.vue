<!--
 * @name: 待处置事件列表
 * @author: bwb
-->

<template>
  <div class="disposed-events-border">
    <Table
      :columns="columns"
      :data-source="data_disposed!.list"
      @change="handleChange"
      bordered
      :pagination="{
        current: data_disposed.current,
        showSizeChanger: true,
        defaultPageSize: 10,
        total: data_disposed.total,
        showQuickJumper: true,
        showTotal: () => `共${data_disposed.total}条信息`
      }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'eventLevel'">
          <Tag :color="colorTable[record.eventLevel]">
            {{ record.eventLevel }}
          </Tag>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <Row v-for="item of Object.keys(record.details)" :key="item.index">
          <Col :span="4" class="text-start pl-3">
            {{ item }}
          </Col>
          <Col :span="20" class="text-start">
            {{ record.details[item] }}
          </Col>
        </Row>
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import { Table, Tag, Row, Col } from 'ant-design-vue'
import { columns } from './colums'
import { useFormStore } from '../../../model/form'
import { onMounted } from 'vue'

const colorTable = {
  高风险: '#ff3e32',
  中风险: '#ff9432',
  低风险: '#ffcd32',
  信息: '#1890ff',
  成功: '#32ff90'
}
const { data_disposed } = useFormStore()
data_disposed.sort = 'createTime,desc'
const parentFunc = defineEmits(['query'])
const handleChange = (e, _filter, sorter) => {
  data_disposed.current = e.current
  data_disposed.pageSize = e.pageSize
  if (sorter.order != undefined) {
    data_disposed.sort = sorter.field + ',' + (sorter.order as string).match(/(.*)end/)![1]
    parentFunc('query', e.current)
  } else {
    parentFunc('query', e.current)
  }
  data_disposed.current = e.current
}
onMounted(() => {
  data_disposed.current = 1
  data_disposed.pageSize = 10
  data_disposed.sort = 'createTime,desc'
})
</script>
<style scoped>
.disposed-events-border {
  margin: 1vh 2vw;
  padding: 10px;
  left: 30px;
  border-radius: 0.5em;
}
</style>
