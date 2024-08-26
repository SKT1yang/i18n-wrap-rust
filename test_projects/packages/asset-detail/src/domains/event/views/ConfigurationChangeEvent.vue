<!--
 * @Name: 组态变更事件
 * @Description: Do not edit
-->
<template>
  <Card class="min-h-190">
    <Table :data-source="dataList" :columns="configurationChangeEventColumns" row-key="id" bordered
      :pagination="pagination" :loading="loading" @change="handleTableChange" size="small">
      <template #bodyCell="{ column, index }">
        <!-- 序号 -->
        <template v-if="column.key === 'index'">
          <span>
            {{ ((currentPage < 1 ? 1 : currentPage) - 1) * pageSize + index + 1 }} </span>
        </template>
      </template>
    </Table>
  </Card>
</template>

<script name="BaselineModifyTable" lang="ts" setup>
import { IEventRecord } from '../types/event';
import { ref, computed } from 'vue'
import {
  Table,
  Card
} from "ant-design-vue"
import type { TableProps } from "ant-design-vue/es/table";
import { configurationChangeEventColumns } from './event.data';
import { getUnTreatEventListApi } from '../model/event';
import dayjs from 'dayjs';
import { onMountedOrActivated } from "@guolisec/utils";
import { useAssetInfoStore } from "@/entry/store";
import { t } from '@/entry/languages/useLanguage'

const { asset } = useAssetInfoStore()

onMountedOrActivated(() => {
  getData()
})

const queryForm = ref({
  sort: 'createTime,desc'
})
const dataList = ref<IEventRecord[]>([])
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

const time = ref<[string, string]>([dayjs().startOf('D').toISOString(), dayjs().endOf('D').toISOString()])

async function getDataList() {
  const { content, totalElements } = await getUnTreatEventListApi({
    ...queryForm.value,
    createTime: time.value,
    ip: asset.assetIp,
    eventIds: [
      5003001, 5003002, 5003003, 5003004, 5003005, 5003006, 5003007, 5003008, 5003009, 5003010,
    ],
  });

  dataList.value = content
  dataTotal.value = totalElements
  total.value = totalElements > 10000 ? 10000 : totalElements
}

function getData() {
  currentPage.value = 1;
  getDataList();
}
</script>