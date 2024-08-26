<!--
 * @name: 关联事件分析
 * @author: bwb
 * @description: 关联事件分析
 * @path: \event-analysis\src\views\PeddingRelationEvents\index.vue
-->
<template>
  <div>
    <Form :model="searchForm" layout="inline">
      <FormItem label="时间段：">
        <DatePicker.RangePicker :show-time="{
          defaultValue: [dateUtil('00:00:00', 'HH:mm:ss'), dateUtil('23:59:59', 'HH:mm:ss')]
        }" :allow-clear="false" v-model:value="searchForm.dateRange" @change="getOptionData" style="width: 340px"
          class="mb-4" />
      </FormItem>

      <FormItem label="事件名称：">
        <Select mode="multiple" :max-tag-count="3" v-model:value="searchForm.eventNames" :options="options.eventNames"
          placeholder="事件名称" allow-clear show-search :filter-option="filterOption" style="min-width: 160px"
          class="mb-4" />
      </FormItem>

      <FormItem label="事件级别：">
        <Select mode="multiple" v-model:value="searchForm.eventLevels" :options="options.eventLevels" placeholder="事件级别"
          allow-clear style="min-width: 160px" class="mb-4" />
      </FormItem>

      <FormItem label="源 IP：">
        <Select mode="multiple" :max-tag-count="3" v-model:value="searchForm.srcIps" :options="options.srcIps"
          placeholder="源 IP" allow-clear style="min-width: 160px" class="mb-4" />
      </FormItem>

      <FormItem label="目的 IP：">
        <Select mode="multiple" :max-tag-count="3" v-model:value="searchForm.dstIps" :options="options.dstIps"
          placeholder="目的 IP" allow-clear style="min-width: 160px" class="mb-4" />
      </FormItem>

      <FormItem label="日志源：">
        <Select mode="multiple" :max-tag-count="3" v-model:value="searchForm.logSourceNames"
          :options="options.logSourceNames" placeholder="日志数据源" allow-clear style="min-width: 160px" class="mb-4" />
      </FormItem>

      <FormItem>
        <Button type="primary" @click="doSearch" :loading="loadingSearch">查 询</Button>
      </FormItem>
    </Form>
    <div class="m-b-2">关联事件</div>
    <Table rowKey='id' bordered :columns="columns" :pagination="pagin" :data-source="tableData.list"
      @change="handleChange">
    </Table>
  </div>
</template>

<script name="PendingRelationEvent" lang="ts" setup>
import { Form, FormItem, DatePicker, Button, Select, message, Table } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';
import { columns } from './relation.data';
import { getEsLogDataApi, getAggregationApi, getEndEventComposeApi, getSocDictionaryApi } from '../../model/peddingRelationEvents';
import { formatToDate, dateUtil } from '../../utils/dateUtil';
import { getPagin } from "../../utils/getPagin"

const { pagin, tableData } = getPagin();
tableData.sort = '@timestamp,desc'
const handleChange = (e, _filter, sorter) => {
  tableData.current = e.current;
  tableData.pageSize = e.pageSize;
  tableData.sort = sorter.order ? sorter.field + "," + (sorter.order as string).match(/(.*)end/)![1] : undefined;
  query();
}

let socDictionary = ref({});

const searchForm = reactive<{
  dateRange: any,
  logSourceNames?: string,
  eventNames?: string,
  eventLevels?: number,
  eventNameTabs: string[],
  srcIps?: string,
  dstIps?: string
}>({
  dateRange: [dateUtil().startOf('day'), dateUtil().endOf('day')], // 查询时间
  logSourceNames: undefined, // 日志源名称
  eventNames: undefined, // 事件名称
  eventLevels: undefined, // 事件级别
  eventNameTabs: [], // 事件名称
  srcIps: undefined, // 源IP
  dstIps: undefined, // 目的IP
});

const options = reactive({
  logSourceNames: [],
  // eventTypes: [],
  eventNames: [],
  eventLevels: [
    { label: '高风险', value: 10 },
    { label: '中风险', value: 5 },
    { label: '低风险', value: 2 },
    { label: '信息', value: 0 },
  ],
  srcIps: [],
  dstIps: [],
});

let loadingSearch = ref(false);

let dataTotal = ref<number>(0); // 表格真实条数

function query() {
  loadingSearch.value = true;
  return getEsLogDataApi({
    eventNames: [searchForm.eventNames!],
    logSourceNames: [searchForm.logSourceNames!],
    logSourceNameTag: '关联事件',
    dstIps: [searchForm.dstIps!],
    srcIps: [searchForm.srcIps!],
    scores: [searchForm.eventLevels!],
    // eventType: searchForm.eventType,
    // 规定：eventNameTabs 为空数组时候就传 '1'
    eventNameTabs: searchForm.eventNameTabs.length > 0 ? searchForm.eventNameTabs : '1',
    page: tableData.current,
    size: tableData.pageSize,
    sort: tableData.sort,
    createTime: [
      dateUtil(searchForm.dateRange[0]).toISOString(),
      dateUtil(searchForm.dateRange[1]).toISOString(),
    ],
  }).then((res) => {
    loadingSearch.value = false;
    dataTotal.value = res.totalElements;
    res.content.forEach((item) => {
      item['@timestamp'] = formatToDate(item['@timestamp'], 'YYYY-MM-DD HH:mm:ss');
    });
    res = {
      content: res.content,
      totalElements: res.totalElements > 10000 ? 10000 : res.totalElements,
    };
    return res;
  });
}

onMounted(() => {
  // const { params } = useRoute(); 暂时没有发现跳转到这个页面的页面 10/8
  getEndEventCompose();
  getSocDictionary();
});

// 查询合并后的事件名称
const getEndEventCompose = () => {
  getEndEventComposeApi().then((res) => {
    searchForm.eventNameTabs = res;
    doSearch();
    getOptionData();
  });
};

// 查询
const doSearch = () => {
  if (searchForm.dateRange == null) {
    message.warning('请选择时间');
  } else {
    tableData.current = 1;
    query();
  }
};

const getOptionData = () => {
  getAggregation('logSourceName', 'logSourceNames', {});
  getAggregation('eventName', 'eventNames', {});
  getAggregation('srcIp', 'srcIps', { srcIpNotNull: '111' });
  getAggregation('dstIp', 'dstIps', { dstIpNotNull: '111' });
};

/**
 * aggregation: 聚合字段
 * fieldName: 表单和下拉框字段
 * otherForm: 自定义查询条件
 */
const getAggregation = (aggregation, fieldName, otherForm) => {
  searchForm[fieldName] = undefined;
  getAggregationApi(
    Object.assign(
      {
        createTime: searchForm.dateRange
          ? [
            dateUtil(searchForm.dateRange[0]).toISOString(),
            dateUtil(searchForm.dateRange[1]).toISOString(),
          ]
          : [],
        aggregation: aggregation + '.keyword',
        indexName: 'logstash*',
        eventNameTabs: searchForm.eventNameTabs,
      },
      otherForm,
    ),
  ).then((res) => {
    options[fieldName] = res.map((item) => {
      if (item.key.length > 50) {
        return {
          value: item.key,
          label: item.key.substring(0, 50) + '...',
        };
      } else {
        return { value: item.key, label: item.key };
      }
    });
  });
};

const getSocDictionary = () => {
  getSocDictionaryApi().then((res) => {
    socDictionary.value = res;
  });
};

const filterOption = (input, option) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
</script>

<style scoped lang="less">
.pendingRelationEvent {
  :deep {
    .ant-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>
