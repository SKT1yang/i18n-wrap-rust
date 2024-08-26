<!--
 * @Name: 资产详情-会话信息
 * @Description: 目前在事件那边展示
-->
<template>
  <Table :data-source="dataList" :columns="sessionEventColumns" row-key="id" bordered :pagination="pagination"
    :loading="loading" @change="handleTableChange" size="small">
    <template #bodyCell="{ column, index }">
      <!-- 序号 -->
      <template v-if="column.key === 'index'">
        <span>
          {{ ((currentPage < 1 ? 1 : currentPage) - 1) * pageSize + index + 1 }} </span>
      </template>
    </template>
  </Table>
</template>

<script name="AssetSession" lang="ts" setup>
import type { TableProps } from "ant-design-vue/es/table";
import { ref, computed } from 'vue'
import {
  Table
} from "ant-design-vue"
import { sessionEventColumns } from './session.data';
import { getSessionInformationApi } from "../model";
import dayjs from 'dayjs';
import { onMountedOrActivated } from "@guolisec/utils";
import { useAssetInfoStore } from "@/entry/store";
import { t } from '@/entry/languages/useLanguage'

const { asset, relationAsset } = useAssetInfoStore()

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

function getDataList() {
  const ip = asset.assetIp;
  if (ip) {
    let createTimeTemp: [string, string] = [dayjs().startOf('D').toISOString(), dayjs().endOf('D').toISOString()];
    return getSessionInformationApi({
      ...queryForm.value,
      page: currentPage.value,
      size: pageSize.value,
      srcIp: asset.assetIp,
      dstIp: relationAsset?.assetIp ?? '',
      createTime: createTimeTemp,
      glAssetsDst: [],
    }).then((res) => {
      total.value = res.totalElements > 10000 ? 10000 : res.totalElements;
      dataTotal.value = res.totalElements;
      dataList.value = res.content;
    });
  } else {
    return Promise.resolve({
      content: [],
      totalElements: 0,
    });
  }
}

function getData() {
  currentPage.value = 1;
  getDataList();
}
</script>
