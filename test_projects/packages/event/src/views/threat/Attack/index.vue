<!--
 * @name: 攻击事件
 * @author: bwb
 * @description: 攻击事件
 * @path: \event\src\views\threat\Attack\index.vue
-->
<template>
  <Form :model="form" class="m-b-24px" :labelCol="{ span: 4 }">
    <Row :justify="'space-between'">
      <Col :span='7'>
      <FormItem label="时间段">
        <RangePicker show-time v-model:value="form.createTime" format='YYYY-MM-DD HH:mm:ss'></RangePicker>
      </FormItem>
      </Col>
      <Col :span='7'>
      <FormItem label="模式">
        <Select allowClear :placeholder="'请选择模式'" :options="options.modes" v-model:value="form.statusType"></Select>
      </FormItem>
      </Col>
      <Col :span='7'>
      <FormItem label="事件名称">
        <Select showSearch :placeholder="'请选择事件名称'" :filterOption="(input, option) => {
          return option!.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }" allowClear :options="options.eventsName" v-model:value="form.name"></Select>
      </FormItem>
      </Col>
    </Row>
    <Row :justify="'space-between'">
      <Col :span='7'>
      <FormItem label="威胁等级">
        <Select placeholder='请选择威胁等级' allowClear :options="options.threatLavel" v-model:value="form.score"></Select>
      </FormItem>
      </Col>
      <Col :span='7'>
      <FormItem label="处置情况">
        <Select placeholder='请选择处置情况' allowClear :options="(options.handle as any)" v-model:value="form.treat"></Select>
      </FormItem>
      </Col>
      <Col :span='7'>
      <FormItem label="攻击源">
        <Input placeholder='请输入攻击源' v-model:value="form.srcIp"></Input>
      </FormItem>
      </Col>
    </Row>
    <Row :justify="'space-between'">
      <Col :span='7'>
      <FormItem label="日志源类型">
        <Select placeholder='请选择日志源类型' allowClear :options="(options.logSourceTypes as any)"
          v-model:value="form.logSourceTypeName"></Select>
      </FormItem>
      </Col>
      <Col :span='7'>
      <FormItem label="日志源名称">
        <Select placeholder='请选择日志源名称' allowClear :options="(options.logSourceNames as any)"
          v-model:value="form.logSourceName"></Select>
      </FormItem>
      </Col>
      <Col :span='7'>
      <Button class="float-right" type="primary"
        @click="() => { tableData.current = 1; getShowUntreatedEventList() }">查询</Button>
      </Col>
    </Row>
  </Form>
  <Table bordered rowKey='id' :dataSource="tableData.list" :pagination="pagin" @change="handleChange" :columns="columns">
  </Table>
</template>

<script name="AttackEvent" lang="tsx" setup>
import { Table, RangePicker, FormItem, Select, Input, Row, Col, Form, Button } from "ant-design-vue"
import { getShowUntreatedEventListApi } from '../../../model/threat';
import { columns } from '../components/event.data';
import { onMounted, reactive } from 'vue';
import { getPagin } from "../../../utils/getPagin";
import {
  getEventNameApi,
  // getIcsEventNameApi,
  // getIcsLogSourceTypeName,
  getLogSourceNameApi,
  getLogSourceTypeNameApi,
} from "../../../model/threat";
import { getOptions } from "../../../utils/tag";
import dayjs from "dayjs";

//table 需要的所有对象以及方法
const { tableData, pagin } = getPagin();
tableData.sort = 'createTime,desc'
const handleChange = (e, _filter, sorter) => {
  tableData.current = e.current;
  tableData.pageSize = e.pageSize;
  tableData.sort = sorter.order ? sorter.field + "," + (sorter.order as string).match(/(.*)end/)![1] : undefined;
  getShowUntreatedEventList()
}

const options = reactive({
  modes: [
    {
      label: '审计',
      value: 0,
    },
    {
      label: '告警',
      value: 1,
    },
    {
      label: '阻断',
      value: 2,
    },
    {
      label: '拒绝',
      value: 3,
    },
    {
      label: '恢复',
      value: 4,
    },
  ],
  eventsName: [],
  threatLavel: [],
  handle: [
    {
      label: '已处置',
      value: true
    },
    {
      label: '未处置',
      value: false
    }
  ],
  logSourceTypes: [],
  logSourceNames: []
})

const form = reactive<{
  createTime: any,
  statusType?: number,
  name: any,
  score: any,
  treat: any,
  srcIp: any,
  logSourceTypeName: any,
  logSourceName: any
}>({
  createTime: [dayjs().startOf('D'), dayjs().endOf('D')],
  statusType: undefined,
  name: undefined,
  score: undefined,
  treat: undefined,
  srcIp: undefined,
  logSourceTypeName: undefined,
  logSourceName: undefined
})

onMounted(async () => {
  options.threatLavel = getOptions('score') as any
  getEventNameApi({
    eventType: 1002,
  }).then((res) => {
    options.eventsName = res.map((val) => {
      return {
        label: val,
        value: val,
      };
    });
    console.log(options.eventsName)
  })
  getLogSourceTypeNameApi({
    eventType: 1002
  }).then(res => {
    options.logSourceTypes = res.map((val) => {
      return {
        label: val,
        value: val,
      };
    })
  })
  getLogSourceNameApi({
    eventType: 1002
  }).then(res => {
    options.logSourceNames = res.map((val) => {
      return {
        label: val,
        value: val,
      };
    })
  })
  const params = history.state;
  if (params.createTime) {
    form.createTime = params.createTime
  }
  if (params.name) {
    form.name = params.name
  }
  if (params.srcIp) {
    form.srcIp = params.srcIp
  }
  if (params.statusType) {
    form.statusType = Number(params.statusType)
  }
  if (['true', 'false'].includes(params.treat as string)) {
    form.treat = params.treat === 'true'
  }
  getShowUntreatedEventList();
});

function getShowUntreatedEventList() {
  // 若清空时间(null)，赋值空数组
  if (!form.createTime) {
    form.createTime = [];
  }
  getShowUntreatedEventListApi({
    page: tableData.current,
    size: tableData.pageSize,
    eventType: 1002,
    sort: tableData.sort,
    ...form,
    createTime: form.createTime.map(v => v.toISOString())
  }).then((res) => {
    let showIndex = 1 + (tableData.current - 1) * tableData.pageSize;
    tableData.list = res.content.map(res => {
      return {
        ...res,
        showIndex: showIndex++
      }
    });
    tableData.total = res.totalElements
  })
}
</script>


<style scoped>
:deep(.ant-form-item) {
  margin-bottom: 5px !important;
}
</style>