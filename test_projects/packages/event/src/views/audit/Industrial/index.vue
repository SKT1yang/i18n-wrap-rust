<!--
 * @name: 工控事件
 * @description: 工控事件
 * @path: \event\src\views\audit\Industrial\index.vue
-->
<template>
  <div>
    <Form :label-col="{ span: 4 }" :model="form">
      <Row justify="space-between">
        <Col :span="7">
        <FormItem label='时间'>
          <RangePicker show-time allow-clear v-model:value="form.createTime" format='YYYY-MM-DD HH:mm'></RangePicker>
        </FormItem>
        </Col>
        <Col :span="7">
        <FormItem label='事件类型'>
          <Cascader v-show="showEventType" :fieldNames="{ label: 'name', value: 'id', children: 'eventTypes' }"
            expandTrigger='hover' :options="treeData" :changeOnSelect="true" :allowClear='false'
            v-model:value="form.eventTypes" placeholder="请选择事件类型">
          </Cascader>
          <Select mode='multiple' v-model:value="form.eventTypes" placeholder='请选择事件类型'
            :fieldNames="{ label: 'name', value: 'id' }" :allowClear="false" v-show="!showEventType"
            :options="eventTypesOptions"></Select>
        </FormItem>
        </Col>
        <Col :span="7">
        <FormItem label='日志源类型'>
          <Select :options="logSourceTypeOptions" placeholder="请选择日志源类型" v-model:value="form.logSourceType"
            format='YYYY-MM-DD HH:mm'></Select>
        </FormItem>
        </Col>
      </Row>
      <Row justify="space-between">
        <Col :span="7">
        <FormItem label='事件级别'>
          <Select :options="eventOptions" placeholder="请选择事件级别" v-model:value="form.eventLevel"
            format='YYYY-MM-DD HH:mm'></Select>
        </FormItem>
        </Col>
        <Col :span="7" />
        <Col :span="7">
        <FormItem>
          <Button class="float-right" type="primary" @click="() => { tableData.current = 1; getEventList(); }">查询</Button>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <template v-if="false">
      <Row>
        <Col :span="12">
        <EventLevelChart ref="eventLevelChartRef" :start="chartForm.start" :end="chartForm.end" :treat="false"
          style="height: 250px" />
        </Col>
        <Col :span="12">
        <EventBarChart ref="eventNameChartRef" :start="chartForm.start" :end="chartForm.end" :treat="false"
          style="height: 250px" />
        </Col>
      </Row>
    </template>
    <Table @change="handleChange" :loading="loading" bordered rowKey='id' :pagination="pagin"
      :data-source="tableData.list" :columns="setColumns()">
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'srcName'">
          <span @click.stop="changeSrcName" style="cursor: pointer; text-decoration: underline">
            {{ srcHeaderName }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'dstName'">
          <span @click.stop="changeDstName" style="cursor: pointer; text-decoration: underline">
            {{ dstHeaderName }}</span>
        </template>
        <template v-else>
          <span> {{ column.title }}</span>
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'srcName'">
          <div v-if="isScrIp">
            <span>{{ EmptyIpFilter(record.srcIp) }}</span>
          </div>
          <div v-else>{{ EmptyNameFilter(record.srcName) }}</div>
        </template>
        <template v-if="column.dataIndex === 'dstName'">
          <div v-if="isDstIp">
            <span>{{ EmptyIpFilter(record.dstIp) }}</span>
          </div>
          <div v-else>{{ EmptyNameFilter(record.dstName) }}</div>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <Button type="link" @click="handleDetail(record)">详情</Button>
        </template>
      </template>
    </Table>
    <EventsTableRowModal :record="record" v-model:open="open" />
  </div>
</template>
<script setup name="EventsPage" lang="ts">
import { Row, Col, Table, Button, RangePicker, Form, FormItem, Cascader, Select } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { getPagin } from "../../../utils/getPagin"
import { getEventListApi, getEventTypeLevelApi, getSearchAggTermApi, getTreeEventTypeOptsApi } from '../../../model/event';
import { columns, eventOptions } from '../components/industrial.data';
import EventsTableRowModal from '../components/EventsTableRowModal.vue';
import EventLevelChart from '../components/EventLevelChart.vue';
import EventBarChart from '../components/EventBarChart.vue';
import { formatToDate } from '../../../utils/index';
import dayjs from "dayjs"
import { EmptyIpFilter, EmptyNameFilter } from '../../../utils/index';
import { nextTick, onMounted, reactive, ref } from 'vue';

// eventType选框
const showEventType = ref(true)
//table 需要的所有对象以及方法
const { tableData, pagin } = getPagin();
const handleChange = (e) => {
  tableData.current = e.current;
  tableData.pageSize = e.pageSize;
  getEventList()
}
//该值在工控事件分页固定为此值
const eventType = 1001

const form = reactive<{
  createTime?: [dayjs.Dayjs, dayjs.Dayjs],
  eventTypes: any[],
  logSourceType: any,
  eventLevel: any
}>({
  createTime: undefined,
  eventTypes: [],
  logSourceType: undefined,
  eventLevel: undefined
})

// 此段无效 charts被隐藏
const eventNameChartRef = ref();
const eventLevelChartRef = ref();
let chartForm = reactive({
  start: '',
  end: '',
});

// 切换table源名称
let isScrIp = ref(false);
let srcHeaderName = ref('源名称');
// 此切换目前在工控事件无效
let isDstIp = ref(false);
let dstHeaderName = ref('目的名称');

// 路由信息
const { currentRoute } = useRouter();
currentRoute.value.params = history.state.queryTime ? history.state : {};

// select选择器（事件类型）下拉选项
const eventTypesOptions = ref([]);

const setColumns = () => {
  // 目的名称或目的ip被切除 当前页面为工控设备时
  return columns.slice(0, 4).concat(columns.slice(5));
};

const loading = ref(false)

// 获取表格数据
function getEventList() {
  const p: any = {
    ...form,
    eventType,
    page: tableData.current,
    size: tableData.pageSize,
    sort: '@timestamp,desc',
    statusType: 0,
    signDiff: '1',
    logSourceNameTag: '工控事件',
  };

  if (form.createTime) {
    p.createTime = form.createTime.map((item) => {
      return new Date(item as any).toISOString();
    });
  }

  // 更新子组件的props 此段无效 charts被隐藏
  if (p.createTime) {
    chartForm.start = p.createTime[0] as any;
    chartForm.end = p.createTime[1] as any;
  } else {
    chartForm.start = '';
    chartForm.end = '';
  }

  loading.value = true;
  getEventListApi(p).then((res) => {
    res.content.forEach((item) => {
      item['@timestamp'] = formatToDate(item['@timestamp'], 'YYYY-MM-DD HH:mm:ss');
    });
    tableData.list = res.content;
    tableData.total = res.totalElements
    loading.value = false;
  });
}

const changeSrcName = () => {
  isScrIp.value = !isScrIp.value;
  if (isScrIp.value) {
    srcHeaderName.value = '源IP';
  } else {
    srcHeaderName.value = '源名称';
  }
};

// 该栏被切除
const changeDstName = () => {
  isDstIp.value = !isDstIp.value;
  if (isDstIp.value) {
    dstHeaderName.value = '目的IP';
  } else {
    dstHeaderName.value = '目的名称';
  }
};

const treeData = ref()
const logSourceTypeOptions = ref()
// 页面加载时
onMounted(async () => {
  // 首页跳转
  form.createTime = currentRoute.value.params.queryTime as any ?? undefined;
  getEventList()
  // 日志类型下拉框选择内容
  getSearchAggTermApi().then(res => {
    logSourceTypeOptions.value = res.logSourceType.map(value => {
      return { value: value.key, label: value.key }
    })
  })
  // 事件类型为树型时下拉选择框 此选框不在工控事件分页出现
  treeData.value = await getTreeEventTypeOptsApi();
  // 隐藏树型下拉框 展示多选下拉框
  customPageForm();
});

// 工控、IT事件使用select组件进行查询，不是原来的级联组件
const customPageForm = () => {
  nextTick(async () => {
    showEventType.value = false;
    eventTypesOptions.value = await getEventTypeLevelApi(eventType);
    // 路由带参数跳转到工控事件，回显对应事件类型
    const routeParams = currentRoute.value.params;
    if (routeParams.eventType) {
      form.eventTypes = [+routeParams.eventType]
    }
  });
};

const open = ref(false)
const record = ref()

// 点击详情
const handleDetail = (record_p) => {
  record.value = record_p
  open.value = true;
};
</script>