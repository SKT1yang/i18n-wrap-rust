<!--
 * @Name: 资产详情-漏洞信息
 * @Description: Do not edit
-->
<template>
  <Card class="min-h-190">
    <Table :data-source="dataList" :columns="vulColumns" row-key="id" bordered :pagination="pagination" :loading="loading"
      @change="handleTableChange" size="small">
      <template #bodyCell="{ column, index }">
        <!-- 序号 -->
        <template v-if="column.key === 'index'">
          <span> {{ ((currentPage < 1 ? 1 : currentPage) - 1) * pageSize + index + 1 }} </span>
        </template>
      </template>
    </Table>
  </Card>
</template>

<script name="AssetVulList" lang="ts" setup>
import type { TableProps } from "ant-design-vue/es/table";
import { ref, computed } from 'vue'
import {
  Table,
  Card
} from "ant-design-vue"
import { vulColumns } from './vul.data';
import { getVulListApi } from '../model/vul';
import { onMountedOrActivated } from '@guolisec/utils'
import { useAssetInfoStore } from '../../../entry/store';
import { t } from '@/entry/languages/useLanguage'

const { asset } = useAssetInfoStore()

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

async function getDataList() {
  const { content, totalElements } = await getVulListApi({
    assetId: asset.id,
    page: currentPage.value,
    size: pageSize.value
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
