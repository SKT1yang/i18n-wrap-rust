<!--
 * @name: 会话分析
 * @author: bwb
 * @description: 会话分析
 * @path: \network\src\views\ConversationPage\index.vue
-->
<template>
  <div class="p-4 conversationAnalysis">
    <Card style="width: 100%">
      <Form layout="inline" :model="searchForm" :rules="rules" ref="formRef">
        <FormItem class="searchMargin" label="时间段：" name="dateRange">
          <DatePicker.RangePicker show-time v-model:value="searchForm.dateRange" />
        </FormItem>
        <FormItem label="设备：" name="sn">
          <Select v-model:value="searchForm.sn" placeholder="请选择设备" style="width: 200px" allow-clear>
            <SelectOption v-for="item in snList" :value="item.sn" :key="item.sn">
              {{ item.name }}
            </SelectOption>
          </Select>
        </FormItem>
        <FormItem label="状态：" name="status">
          <Select v-model:value="searchForm.status" :options="statusList" placeholder="请选择状态" style="width: 200px"
            allow-clear></Select>
        </FormItem>
        <FormItem label="源IP：" name="srcIp">
          <Input v-model:value="searchForm.srcIp" placeholder="请输入源IP" style="width: 200px" allow-clear :maxlength="24" />
        </FormItem>
        <FormItem name="dstIp" label="目的IP：">
          <Input v-model:value="searchForm.dstIp" placeholder="请输入目的IP" style="width: 200px" allow-clear
            :maxlength="24" />
        </FormItem>
        <FormItem label="源端口：" name="srcPort">
          <InputNumber v-model:value="searchForm.srcPort" placeholder="请输入源端口" :controls="false" :min="0" :max="65535"
            style="width: 200px" allow-clear />
        </FormItem>
        <FormItem label="目的端口：" name="dstPort">
          <InputNumber v-model:value="searchForm.dstPort" placeholder="请输入目的端口" :controls="false" :min="0" :max="65535"
            style="width: 200px" allow-clear />
        </FormItem>
        <FormItem label="应用层协议名称：" name="applayerProtocolId">
          <Select v-model:value="searchForm.applayerProtocolId" :options="protocolList" placeholder="应用层协议名称" allow-clear
            style="width: 200px"></Select>
        </FormItem>
        <FormItem>
          <Button @click="resetForm">
            <SearchOutlined />重置
          </Button>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="doSearch">
            <SearchOutlined />查询
          </Button>
        </FormItem>
      </Form>
      <Divider />
      <Row class="m-b-6" :gutter="30">
        <Col :span="6">
        <Card>
          <div class="left">
            <div class="item" v-for="(item, index) in sessionCountList" :key="index">
              <h3>{{ item.num }}</h3>
              <span>{{ item.desc }}</span>
            </div>
          </div>
        </Card>
        </Col>
        <Col :span="18">
        <Card>
          <ConversationChart class="conversationChart" ref="chartRef" :searchForm="searchForm" />
        </Card>
        </Col>
      </Row>

      <Table :loading="loading" :scroll="{ x: 2500 }" :pagination="pagin1" @change="handleChange" bordered size='small'
        :columns="basicColumns" :data-source="tableData.list">
        <template #bodyCell="{ record, column }">
          <template v-if="column.dataIndex == 'operation'">
            <Button type="link" @click="openStatisticsModal(record.statistics)">查看</Button>
          </template>
        </template>
      </Table>

      <StatisticsModal :statistics='statistics' v-model:open="open" />
    </Card>
  </div>
</template>

<script setup name="ConversationAnalysis" lang="ts">
import {
  Card,
  Form,
  FormItem,
  DatePicker,
  Select,
  SelectOption,
  Button,
  Divider,
  Row,
  Col,
  Input,
  InputNumber,
  Table,
  message
} from 'ant-design-vue';
import { basicColumns } from "./columns"
import { SearchOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

import { getDeviceBySessionApi } from '../../model/conversation';
import { querySessionListApi, querySessionCountApi, getAppProtocolApi } from '../../model/conversation';

import ConversationChart from '../../views/ConversationPage/components/ConversationChart.vue';
import StatisticsModal from '../../views/ConversationPage/components/StatisticsModal.vue';
import { computed, onMounted, reactive, ref } from 'vue';

const formRef = ref();
function isIp(s: string) {
  return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
    s,
  );
}
const rules = {
  srcIp: [{
    validator: (_rule, value) => {
      if (value) {
        if (!isIp(value)) {
          return Promise.reject('请输入正确的IP地址');
        } else {
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    }
  }],
  dstIp: [{
    validator: (_rule, value) => {
      if (value) {
        if (!isIp(value)) {
          return Promise.reject('请输入正确的IP地址');
        } else {
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    }
  }],
};

// 查询表单
const searchForm = reactive<{
  dateRange: [dayjs.Dayjs, dayjs.Dayjs],
  sn: any,
  status: any,
  srcIp: any,
  dstIp: any,
  dstPort: any,
  srcPort: any,
  applayerProtocolId: any,
}>({
  dateRange: [dayjs().startOf('month'), dayjs().endOf('day')], // 查询时间
  sn: undefined, // 设备
  status: undefined, // 会话状态
  srcIp: undefined,
  dstIp: undefined,
  dstPort: undefined,
  srcPort: undefined,
  applayerProtocolId: undefined,
});

let snList = ref<
  {
    name: string;
    ip: string;
    sn: string;
  }[]
>([]); // 设备列表
let statusList = ref([
  { label: '已新建', value: 0 },
  { label: '已连接', value: 1 },
  { label: '已断开', value: 2 },
  { label: '已超时', value: 4 },
]); // 状态列表
let dataTotal = ref<number>(0); // 表格真实条数

let sessionCountList = ref([
  {
    num: 0,
    desc: '在线会话数',
  },
  {
    num: 0,
    desc: '协议数',
  },
]);

let protocolList = ref<
  {
    value: number;
    label: string;
  }[]
>([]); // 协议列表

const chartRef = ref();

onMounted(async () => {
  getSessionDataList();
  // 协议必须先请求，后面要用到
  await getProtocolList();
  getParamsByRoute();
  getNetworkCardByTime();
  doSearch();
});

// 按时间获取设备及对应网卡
const getNetworkCardByTime = () => {
  let start = dayjs().startOf('month').toISOString();
  let end = dayjs().endOf('month').toISOString();
  getDeviceBySessionApi({
    createTime: [start, end],
  }).then((res) => {
    snList.value = res;
  });
};

// 获取协议列表
async function getProtocolList() {
  const res = await getAppProtocolApi();
  protocolList.value = res.map((item) => {
    return { label: item.appProtocol, value: item.id };
  });
}

const tableData = reactive<{ list: any[], current: number, pageSize: number, total: number, sort: string }>({ list: [], current: 1, pageSize: 10, total: 0, sort: '@timestamp,desc' })

const pagin1 = computed(() => ({
  current: tableData.current,
  showSizeChanger: true,
  defaultPageSize: tableData.pageSize,
  total: tableData.total > 10000 ? 10000 : tableData.total,
  showQuickJumper: true,
  showTotal: (total) => {
    return tableData.total > 10000
      ? `命中 ${tableData.total} 条, 展示10000条`
      : `共 ${total} 条`;
  }
}))

const handleChange = (e, _filter, sorter) => {
  if (sorter.order) {
    tableData.sort = sorter.field + "," + (sorter.order as string).match(/(.*)end/)![1]
  }
  tableData.current = e.current;
  tableData.pageSize = e.pageSize;
  getSessionDataList();
}

const loading = ref(false)
function getSessionDataList() {
  loading.value = true;
  return querySessionListApi({
    page: tableData.current,
    size: tableData.pageSize,
    sort: tableData.sort,
    srcIp: searchForm.srcIp,
    srcPort: searchForm.srcPort,
    dstIp: searchForm.dstIp,
    dstPort: searchForm.dstPort,
    sn: searchForm.sn,
    status: searchForm.status,
    applayerProtocolId: searchForm.applayerProtocolId,
    createTime: [searchForm.dateRange[0].toISOString(), searchForm.dateRange[1].toISOString()],
  }).then((res) => {
    loading.value = false;
    dataTotal.value = res.totalElements;
    tableData.total = res.totalElements;
    tableData.list = res.content
    res = {
      content: res.content,
      totalElements: res.totalElements > 10000 ? 10000 : res.totalElements,
    };
    return res;
  });
}

// 会话协议与状态数量查询
const querySessionCount = () => {
  querySessionCountApi({
    createTime: [searchForm.dateRange[0].toISOString(), searchForm.dateRange[1].toISOString()],
    sn: searchForm.sn,
  }).then((res) => {
    sessionCountList.value[0].num = res.numberOfSessions;
    sessionCountList.value[1].num = res.numberOfProtocols;
  });
};

// 查询
const doSearch = () => {
  if (searchForm.dateRange) {
    tableData.current = 1;
    getSessionDataList();
    chartRef.value.getData();
    querySessionCount();
  } else {
    message.warning('请选择查询时间!');
  }
};

const open = ref(false);
const statistics = ref(undefined)

// 查看功能码
const openStatisticsModal = (statistics_p) => {
  console.log('isON')
  statistics.value = statistics_p
  open.value = true;
};

// 如果有的话，获取路由中的时间
const getParamsByRoute = () => {
  const params = history.state;
  const createTime = params.queryTime;
  const protocolName = params.protocolName;
  if (createTime) {
    searchForm.dateRange = createTime.map((item, index) => {
      return index === 0 ? dayjs(item).hour(0).minute(0).second(0) : dayjs(item).endOf('day');
    });
  }
  if (protocolName) {
    const protocol = protocolList.value.find((p) => {
      return p.label === protocolName;
    });
    if (protocol) {
      searchForm.applayerProtocolId = protocol.value;
    }
  }
};

const resetForm = () => {
  formRef.value.resetFields();
};
</script>
<style scoped>
.conversationChart {
  height: 220px;
}

.item {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 35px;
}

.left {
  display: flex;
  padding: 20px;
  height: 220px;
}

.left h3 {
  font-size: 20px;
  margin-bottom: 8px;
}

.searchMargin {
  margin-bottom: 10px;
}
</style>
