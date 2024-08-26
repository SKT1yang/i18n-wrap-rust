<!--
 * @name: 异常网络事件
 * @author: bwb
 * @description: 异常网络事件
 * @path: \event\src\views\threat\Network\index.vue
-->
<template>
  <div>
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
        <Button class="float-right" type="primary" @click="handleSearch()">查询</Button>
        </Col>
      </Row>
    </Form>
    <Tabs v-model:activeKey="activeKey" type="card" @change="handleTabChange">
      <TabPane :key="1004" tab="全部" />
      <TabPane v-for="eventType in eventTypeList" :key="eventType.id" :tab="eventType.name" />
    </Tabs>
    <Table :data-source="dataSource" :columns="columns.slice(1)" @change="handleTableChange" :pagination="{
      current: page,
      total,
      pageSize: size,
      showQuickJumper: true,
      showTotal: (total) => `共 ${total} 条数据`,
      showSizeChanger: true,
    }"></Table>
  </div>
</template>

<script name="AttackEvent" lang="tsx" setup>
import { Table, RangePicker, FormItem, Select, Input, Row, Col, Form, Button, Tabs } from "ant-design-vue"
import { columns } from '../components/event.data';
import { getIcsTabApi, getShowUntreatedEventListApi } from '../../../model/threat';
import { onMounted, reactive, ref } from 'vue';
import {
  getEventNameApi,
  getIcsEventNameApi,
  getIcsLogSourceTypeName,
  getLogSourceNameApi,
  getLogSourceTypeNameApi,
} from "../../../model/threat";
import dayjs from 'dayjs';
import { getOptions } from "../../../utils/tag";
import { getEventTypeLevelApi } from "../../../model/event";
let eventTypeIn = ref<any[]>([]);

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


function handleSearch() {
  page.value = 1;
  getDataSource();
}

/**
 * 处理tab
 */

const TabPane = Tabs.TabPane;

let eventTypeList = ref<any[]>([]);
const activeKey = ref(1004);

async function getEventTypeLevel() {
  eventTypeList.value = await getEventTypeLevelApi(1004);
  eventTypeIn.value = [];
  eventTypeList.value.forEach((item: any) => {
    eventTypeIn.value.push(item.id);
  });
  getDataSource();
}

function handleTabChange() {
  getDataSource();
}

/**
 * 处理表格
 * 数据源
 */
const dataSource = ref([]);
let page = ref(1);
let size = ref(10);
let total = ref(0);
let sort = ref('createTime,desc');

onMounted(() => {
  options.threatLavel = getOptions('score') as any
  getEventNameApi({
    eventType: 1004,
  }).then((res) => {
    options.eventsName = res.map((val) => {
      return {
        label: val,
        value: val,
      };
    });
  })
  getLogSourceTypeNameApi({
    eventType: 1004
  }).then(res => {
    options.logSourceTypes = res.map((val) => {
      return {
        label: val,
        value: val,
      };
    })
  })
  getLogSourceNameApi({
    eventType: 1004
  }).then(res => {
    options.logSourceNames = res.map((val) => {
      return {
        label: val,
        value: val,
      };
    })
  })
  const historyParams = history.state;
  if (historyParams.createTime) {
    form.createTime = historyParams.createTime
  }
  if (historyParams.name) {
    form.name = historyParams.name
  }
  if (historyParams.srcIp) {
    form.srcIp = historyParams.srcIp
  }
  if (historyParams.statusType) {
    form.statusType = Number(historyParams.statusType)
  }
  if (['true', 'false'].includes(historyParams.treat as string)) {
    form.treat = historyParams.treat === 'true'
  }
  const params = history.state;
  if (params.createTime) {
    form.createTime = params.createTime
  }
  if (['true', 'false'].includes(params.treat as string)) {
    form.treat = params.treat === 'true'
  }
  if (params.statusType) {
    form.statusType = Number(params.statusType)
  }
  if (params.activeKey) {
    activeKey.value = Number(params.activeKey);
  }
  getEventTypeLevel();
});

async function getDataSource() {
  // 若清空时间(null)，赋值空数组
  let form_copy = JSON.parse(JSON.stringify(form));
  if (!form_copy.createTime) {
    form_copy.createTime = [];
  }

  if (activeKey.value === 1004) {
    form_copy.eventTypeIn = eventTypeIn.value;
  } else {
    form_copy.eventType = activeKey.value;
  }
  const res = await getShowUntreatedEventListApi({
    page: page.value,
    size: size.value,
    sort: sort.value,
    ...form_copy,
  });
  dataSource.value = res.content;
  total.value = res.totalElements;
}

function handleTableChange(e, _filters, sorter) {
  sort.value = `${sorter.field ?? 'count'},${(sorter.order ?? 'descend').split('end')[0]}`;
  page.value = e.current;
  size.value = e.pageSize;
  getDataSource();
}
</script>
