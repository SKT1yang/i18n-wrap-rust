<!--
 * @Name: 事件组件-通用
 * @Description: Do not edit
-->
<template>
  <div>
    <Tabs v-model:activeKey="activeKey" @change="getTableData" v-if="eventTypeList.length > 0">
      <TabPane v-for="eventType in eventTypeList" :key="eventType.key" :tab="eventType.value" />
    </Tabs>
    <Table :data-source="dataList" :columns="props.columns" row-key="id" bordered :pagination="pagination"
      :loading="loading" @change="handleTableChange" size="small">
      <template #bodyCell="{ column, index }">
        <!-- 序号 -->
        <template v-if="column.key === 'index'">
          <span>
            {{ ((currentPage < 1 ? 1 : currentPage) - 1) * pageSize + index + 1 }} </span>
        </template>
      </template>
    </Table>
  </div>
</template>

<script name="IcEvent" lang="ts" setup>
/* 类型文件 */
import type { TableProps } from "ant-design-vue/es/table";
import type { PropType } from "vue";
import type { RelationDto } from "../types/event";
import { ColumnProps } from "ant-design-vue/es/table";
import { IEventDetail } from "../types/event";
/* 第三方模块 */
import dayjs from 'dayjs';
import { ref, computed } from 'vue'
import { Tabs, Table } from 'ant-design-vue';
import { onMountedOrActivated } from "@guolisec/utils";
/* 本地模块 */
import { getAssetEventApi } from '../model/event';
import { useAssetInfoStore } from "../../../entry/store";
import { t } from '@/entry/languages/useLanguage'

const props = defineProps({
  eventType: {
    type: String,
    required: true
  },
  api: {
    type: Function as PropType<(params: Partial<RelationDto>) => Promise<any>>,
    required: true
  },
  columns: {
    type: Array as PropType<ColumnProps<IEventDetail>[]>,
    required: true
  }
})

const { asset, relationAsset } = useAssetInfoStore()
const time = ref<[string, string]>([dayjs().startOf('D').toISOString(), dayjs().endOf('D').toISOString()])

onMountedOrActivated(() => {
  getData()
})

const queryForm = ref({
  sort: '@timestamp,desc'
})
const dataList = ref([])
const total = ref<number>(0);
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false)
const dataTotal = ref<number>(0); // 表格真实数据总数
const pagination = computed(() => {
  return {
    total: total.value,
    current: currentPage.value,
    pageSize: pageSize.value,
    defaultPageSize: pageSize.value,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => {
      return dataTotal.value > 10000
        ? `${t('共 {} 条, 仅展示前 10000 条', dataTotal.value)}`
        : `${t('共 {} 条', total)}`;
    },
  };
});

const handleTableChange: TableProps["onChange"] = (pag, _, sorter) => {
  pageSize.value = pag.pageSize || pageSize.value;
  currentPage.value = pag.current || currentPage.value;

  if (!Array.isArray(sorter) && sorter.field) {
    const { field, order } = sorter
    queryForm.value.sort = `${field},${order === 'ascend' ? 'asc' : 'desc'}`
  }
  getDataList();
};

/**
 * 处理tab
 */

const TabPane = Tabs.TabPane;

let eventTypeList = ref<{
  key: number;
  value: string;
}[]>([]);
const activeKey = ref(0);

async function getEventTypeLevel() {
  eventTypeList.value = await props.api({
    srcIp: asset.assetIp,
    dstIp: relationAsset?.assetIp ?? '',
    glAssetsDst: [],
  });
  if (eventTypeList.value.length > 0) {
    activeKey.value = eventTypeList.value[0].key;
  }
}

async function getDataList() {
  const { content, totalElements } = await getAssetEventApi({
    ...queryForm.value,
    page: currentPage.value,
    size: pageSize.value,
    srcIp: asset.assetIp,
    dstIp: relationAsset?.assetIp ?? '',
    eventType: props.eventType,
    createTime: time.value,
    type: activeKey.value,
  })
  dataList.value = content
  dataTotal.value = totalElements
  total.value = totalElements > 10000 ? 10000 : totalElements
}

// 初始化函数
async function getData() {
  await getEventTypeLevel();
  getTableData();
}

function getTableData() {
  currentPage.value = 1;
  getDataList();
}
</script>