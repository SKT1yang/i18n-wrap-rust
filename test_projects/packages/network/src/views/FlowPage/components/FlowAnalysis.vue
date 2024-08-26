<!--
 * @Name: 流量分析页面主体
 * @Description: 流量分析页面主体
 * @Author: bwb
-->
<template>
  <div class="flowAnalysis">
    <Form layout="inline" :model="searchForm">
      <FormItem>
        <RangePicker show-time v-model:value="searchForm.dateRange" @change="changeDate" />
      </FormItem>
      <FormItem>
        <Select v-model:value="searchForm.sn" placeholder="请选择设备" @change="handleAssetsSN" style="width: 200px">
          <SelectOption v-for="item in snList" :value="item.sn" :key="item.sn">
            {{ item.key }}
          </SelectOption>
        </Select>
      </FormItem>
      <FormItem>
        <Select v-model:value="searchForm.networkInterface" placeholder="请选择网卡" @change="handleAssetsNetworkInterface"
          style="width: 200px" :title="searchForm.networkInterface">
          <SelectOption v-for="item in networkInterfaces" :value="item.interfaceName"
            :key="item.interfaceName + (item.remark === '' ? '' : '(' + item.remark + ')')"
            :title="item.interfaceName + (item.remark === '' ? '' : '(' + item.remark + ')')">
            {{ item.interfaceName + (item.remark === '' ? '' : '(' + item.remark + ')') }}
          </SelectOption>
        </Select>
      </FormItem>
      <FormItem>
        <Space>
          <Button v-if="false" type="primary" @click="exportPdf" :disabled="disabledExportPdf">导出PDF</Button>
          <Button v-show="searchForm.sn && searchForm.networkInterface" type="primary"
            @click="openSetRemarkModal">设置备注</Button>
        </Space>
      </FormItem>
    </Form>
    <Divider />
    <div id="statistic-flow">
      <Row>
        <Col :span="12">
        <FlowDayChart class="flowDayChart" ref="flowDayChartRef" :searchForm="searchForm" />
        </Col>
        <Col :span="12">
        <FlowHourChart class="flowHourChart" ref="flowHourChartRef" :searchForm="searchForm" />
        </Col>
      </Row>
    </div>

    <Table @change="handleChange" :pagination="pagin1" :columns="columns" :data-source="tableData.list" bordered
      size='small'></Table>

    <FlowSetRemarkModal :ip="ip" :networkInterface="networkInterface" v-model:open="open" :remark="remark"
      @setRemark="setRemark" />
  </div>
</template>
<script setup  lang="ts">
import {
  Form,
  Table,
  FormItem,
  RangePicker,
  Select,
  SelectOption,
  Button,
  Divider,
  Space,
  Row,
  Col,
} from 'ant-design-vue';
import type { TableColumnsType } from "ant-design-vue"
import dayjs from 'dayjs';
import {
  getNetworkCardByTimeApi,
  getLargestTrafficDeviceApi,
  queryTrafficListApi,
} from '../../../model/flow';
import { getPdf } from '../../../utils';

import FlowDayChart from '../../../views/FlowPage/components/FlowDayChart.vue';
import FlowHourChart from '../../../views/FlowPage/components/FlowHourChart.vue';
import FlowSetRemarkModal from '../../../views/FlowPage/components/FlowSetRemarkModal.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { formatToDate } from '@guolisec/utils';

const tableData = reactive<{ list: any[], current: number, pageSize: number, total: number, sort: string }>({ list: [], current: 1, pageSize: 10, total: 0, sort: '@timestamp,desc' })
// 查询表单
const searchForm = reactive<{
  dateRange: [dayjs.Dayjs, dayjs.Dayjs],
  sn: any,
  ip: any,
  networkInterface: any
}>({
  dateRange: [dayjs().startOf('month'), dayjs().endOf('day')], // 查询时间
  sn: undefined, // 设备
  ip: undefined,
  networkInterface: undefined, // 网卡
});

let snList = ref<
  {
    key: string;
    value: { interfaceName: string; remark: string }[];
    sn: string;
  }[]
>([]); // 设备列表
let networkInterfaces = ref<{ interfaceName: string; remark: string }[]>([]); // 网卡列表
let dataTotal = ref<number>(0); // 表格真实条数

const flowDayChartRef = ref();
const flowHourChartRef = ref();

let disabledExportPdf = ref(true);

onMounted(() => {
  getNetworkCardByTime();
  getFlowDataList()
});

// 按时间获取设备及对应网卡
const getNetworkCardByTime = () => {
  let start = dayjs().startOf('month').toISOString();
  let end = dayjs().endOf('month').toISOString();
  getNetworkCardByTimeApi({
    createTime: [start, end],
  }).then((res) => {
    snList.value = res;
    getLargestTrafficDevice();
  });
};

// 获取流量最大设备
const getLargestTrafficDevice = () => {
  let start = dayjs().startOf('month').toISOString();
  let end = dayjs().endOf('month').toISOString();
  getLargestTrafficDeviceApi({
    createTime: [start, end],
  }).then((res) => {
    searchForm.sn = res.assetName;
    handleAssetsSN(res.sn);
    searchForm.networkInterface = res.networkInterface;
    doSearch();
    disabledExportPdf.value = false;
  });
};

// 选择设备
const handleAssetsSN = (sn) => {
  snList.value.forEach((item) => {
    if (item.sn === sn) {
      searchForm.sn = item.sn;
      searchForm.ip = item.key;
      networkInterfaces.value = item.value;
      searchForm.networkInterface = undefined;
    }
  });
};

// 选择网卡
const handleAssetsNetworkInterface = (networkInterface) => {
  searchForm.networkInterface = networkInterface;
  doSearch();
};

// 选择时间
const changeDate = () => {
  tableData.current = 1;
  getFlowDataList();
};

const pagin1 = computed(() => ({
  current: tableData.current,
  showSizeChanger: true,
  defaultPageSize: tableData.pageSize,
  total: tableData.total,
  showQuickJumper: true,
  showTotal: (total) => {
    return tableData.total > 10000
      ? `命中 ${tableData.total} 条, 展示10000条`
      : `共 ${total} 条`;
  }
}))

const handleChange = (e, _filter, sorter) => {
  tableData.sort = sorter.field + "," + (sorter.order as string).match(/(.*)end/)![1]
  tableData.current = e.current;
  tableData.pageSize = e.pageSize;
  getFlowDataList();
}

const columns: TableColumnsType = [
  {
    title: '设备名称',
    dataIndex: 'name',
    align: 'center',
    customRender: ({ record }) => {
      return record.name ? record.name : record.ip;
    },
  },
  {
    title: '上行流量',
    dataIndex: 'upTrafficRate',
    align: 'center',
  },
  {
    title: '下行流量',
    dataIndex: 'downTrafficRate',
    align: 'center',
  },
  {
    title: '网口',
    dataIndex: 'networkInterface',
    align: 'center',
  },
  {
    title: '时间',
    dataIndex: '@timestamp',
    align: 'center',
    sorter: true,
    defaultSortOrder: "descend",
    customRender: ({ text }) => {
      return formatToDate(text, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];

function getFlowDataList() {
  let form = {
    page: tableData.current,
    size: tableData.pageSize,
    sort: tableData.sort,
    sn: searchForm.sn,
    networkInterface: searchForm.networkInterface,
  };
  if (searchForm.dateRange) {
    form['createTime'] = [
      searchForm.dateRange[0].toISOString(),
      searchForm.dateRange[1].toISOString(),
    ];
  }
  return queryTrafficListApi(form).then((res) => {
    dataTotal.value = res.totalElements;
    tableData.total = res.totalElements;
    tableData.list = res.content;
    res = {
      content: res.content,
      totalElements: res.totalElements > 10000 ? 10000 : res.totalElements,
    };
    return res;
  });
}

// 查询
const doSearch = () => {
  tableData.current = 1;
  getFlowDataList();
  flowDayChartRef.value.getFlowByDay();
  flowHourChartRef.value.getFlowByHour();
};

// 导出PDF
const exportPdf = () => {
  getPdf(
    `流量报表(资产IP_${searchForm.ip} 网口_${searchForm.networkInterface})`,
    '#statistic-flow',
  );
};

const ip = ref();
const networkInterface = ref();
const remark = ref();
const open = ref(false);
const openSetRemarkModal = () => {
  let remark_p = '';
  networkInterfaces.value.forEach((e) => {
    if (e.interfaceName === searchForm.networkInterface) {
      remark_p = e.remark;
    }
  });
  ip.value = searchForm.ip
  networkInterface.value = searchForm.networkInterface
  remark.value = remark_p
  open.value = true;
};

// 修改备注后不去刷新数据，动态修改当前修改的备注
const setRemark = (remark) => {
  networkInterfaces.value.forEach((e) => {
    if (e.interfaceName === searchForm.networkInterface) {
      e.remark = remark;
    }
  });
};
</script>
<style scoped>
.flowDayChart {
  height: 250px;
}

.flowHourChart {
  height: 250px;
}
</style>
