<!--
 * @name: 潜在危害分析
 * @author: bwb
 * @description: 潜在危害分析
 * @path: \event-analysis\src\views\Potential\index.vue
-->
<template>
  <div>
    <Form :model="form">
      <Row justify="space-between">
        <Col :span="5">
        <FormItem label="时间">
          <RangePicker show-time format="YYYY-MM-DD HH:mm:ss" v-model:value="form.dateRange"></RangePicker>
        </FormItem>
        </Col>
        <Col :span="5">
        <FormItem label="事件名称">
          <Select :options="nameOptions.list" showSearch v-model:value="form.name" placeholder="请选择事件名称" allowClear
            :filterOption="(input, option) => {
              return option!.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }"></Select>
        </FormItem>
        </Col>
        <Col :span="5">
        <FormItem label="事件类型">
          <Cascader v-model:value="form.typeId" :options="eventTypeTree" change-on-select expand-trigger="hover"
            :field-names="{ label: 'name', value: 'id', children: 'eventTypes' }" placeholder="请选择事件类型"
            :display-render="displayRender" />
        </FormItem>
        </Col>
        <Col :span="7">
        <FormItem>
          <Button type="primary" @click="() => { tableData.current = 1; query() }">查询</Button>
        </FormItem>
        </Col>
      </Row>
    </Form>

    <Table :loading="loading" :columns="columns" :data-source="tableData.list" :pagination="pagin" @change="handleChange"
      rowKey='id' bordered>
    </Table>
  </div>
</template>

<script name="PotentialAnalysis" lang="ts" setup>
import { Cascader, Table, Form, FormItem, RangePicker, Row, Col, Select, Button } from 'ant-design-vue';
import { columns } from './potential.data';
import { getPagin } from "../../utils/getPagin"
import { getPotentialDataApi, getEventStoreTreeApi, getPotentialEventNameApi } from '../../model/potential';
import { onMounted, reactive, ref } from 'vue';
import { dateUtil } from '../../utils/dateUtil';

// 事件类型树
let eventTypeTree = ref([]);
const loading = ref(false)

const { pagin, tableData } = getPagin();
tableData.sort = 'endDate,desc';
const handleChange = (e) => {
  tableData.current = e.current;
  tableData.pageSize = e.pageSize;
  query();
}

const form = reactive<{
  dateRange: any,
  name?: string,
  typeId?: any
}>({
  dateRange: [dateUtil().startOf("month"), dateUtil().endOf("day")],
  name: undefined,
  typeId: undefined
});

function query() {
  loading.value = true;
  let start = '';
  let end = '';
  if (form.dateRange != null) {
    start = dateUtil(form.dateRange[0]).toISOString();
    end = dateUtil(form.dateRange[1]).toISOString();
  }
  let indexShow = 1 + tableData.pageSize * (tableData.current - 1)
  getPotentialDataApi({
    name: form.name || undefined,
    eventTypeId: form.typeId ? form.typeId[form.typeId.length - 1] : undefined,
    endDate: start && end ? [start, end] : [],
    page: tableData.current,
    size: tableData.pageSize,
    sort: tableData.sort,
  }).then((res) => {
    tableData.list = res.content.map(value => {
      return { indexShow: indexShow++, ...value }
    });
    tableData.total = res.totalElements
    loading.value = false;
  })
}

const nameOptions = reactive({ list: [] });

onMounted(() => {
  getEventTypeTree();
  query();
  getPotentialEventNameApi().then(res => {
    nameOptions.list = res.map((val) => {
      return {
        label: val,
        value: val,
      };
    });
  })
});

// 获取事件类型树
const getEventTypeTree = () => {
  getEventStoreTreeApi().then((res) => {
    eventTypeTree.value = res;
  });
};

// 事件类型选中展示文本自定义
const displayRender = ({ labels }) => {
  return labels[labels.length - 1];
};
</script>
