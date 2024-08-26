<!--
 * @Name: 待入库资产
 * @Description: 扫描扫出来，但没有入库（数据库）的资产
 * @Author: ygd
-->
<template>
  <div class="space-y-4">
    <!-- 查询表单 -->
    <Form layout="inline" :model="queryForm">
      <FormItem>
        <Input v-model:value="queryForm.deviceIp" placeholder="IP 地址" allowClear />
      </FormItem>
      <FormItem>
        <Input v-model:value="queryForm.deviceMac" placeholder="MAC 地址" allowClear />
      </FormItem>
      <FormItem>
        <Button @click="doSearch">
          查询
        </Button>
      </FormItem>
      <FormItem>
        <Button :disabled="selectedRows.length < 1" :loading="loading" type="primary"
          @click="handleStock(selectedRows)">
          <span>批量入库</span>
        </Button>
      </FormItem>
      <FormItem>
        <Button :disabled="selectedRows.length < 1" :loading="loading" danger @click="handleDeny(selectedRows)">
          <span>批量忽略</span>
        </Button>
      </FormItem>
    </Form>

    <!-- 表格 -->
    <Table :data-source="dataList" :columns="getColumns()" row-key="id" :pagination="pagination" :loading="loading"
      :row-selection="rowSelectionConfig" @change="handleTableChange" :scroll="{ y: 'calc(100vh - 410px)' }">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ (currentPage - 1) * pageSize + index + 1 }}
        </template>

        <template v-if="column.key === 'action'">
          <Button type="link" @click="handleStock([record])">入库</Button>
          <Button type="text" @click="handleDeny([record])" danger>忽略</Button>
        </template>
      </template>
    </Table>
  </div>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { Key } from 'ant-design-vue/es/table/interface';
import type { TableRowSelection } from 'ant-design-vue/es/table/interface';
import type { TableProps, ColumnProps } from "ant-design-vue/es/table";
/* 第三方模块 */
import { ref, computed, onMounted } from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Table,
  Modal,
  message
} from 'ant-design-vue';
import { useRouter } from '@guolisec/routerable';
/* 本地模块 */
import {
  type StockAsset,
  getWaitStockAssetApi,
  denyWaitStockAssetApi,
} from './model/stock'

/********************** 外部状态和配置 **********************/

const emit = defineEmits(['refresh']);

/********************** 初始化状态 **********************/

onMounted(() => {
  /**
   * 实现从资产批量入库页返回查询条件、页数、页码不变，取出跳转批量入库页前的存储在 localStorage 中的内容。
   */
  const router = useRouter()
  const fromDetailPageInfo = localStorage.getItem('asset-stock::page-info')
  const backPath = router?.options?.history?.state?.forward

  // 如果上一个页面是详情页，且 localStorage 中有内容，将数据赋值给查询变量等
  if (backPath === '/asset/stock-batch' && fromDetailPageInfo) {
    const fromDetailPageInfoObject = JSON.parse(fromDetailPageInfo)
    const { queryData, page, size } = fromDetailPageInfoObject

    queryForm.value = { ...queryForm.value, ...queryData }
    currentPage.value = page
    pageSize.value = size
  }
  // 清空 localStorage 中的内容
  localStorage.removeItem('asset-stock::page-info')

  getDataList();
});

/********************** 查询表单 **********************/

const queryForm = ref<{
  deviceIp: string;
  deviceMac: string;
}>({
  deviceIp: '',
  deviceMac: ''
});

/********************** 表格 **********************/

const dataList = ref<StockAsset[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const sort = ref('createTime,desc')
const loading = ref<boolean>(false);

const pagination = computed(() => {
  return {
    pageSize: pageSize.value,
    current: currentPage.value,
    total: total.value,
    defaultPageSize: 10,
    showSizeChanger: true,
    showTotal: () => `共 ${total.value} 项`
  };
});

/**
 * 获取表格列的配置描述
 */
function getColumns() {
  const columns = ref<ColumnProps<StockAsset>[]>([
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      ellipsis: true,
      width: 80,
    },
    {
      title: "IP地址",
      dataIndex: "deviceIp",
      key: "deviceIp",
      ellipsis: true,
      width: 200
    },
    {
      title: "MAC地址",
      dataIndex: "deviceMac",
      key: "deviceMac",
      ellipsis: true,
      width: 200
    },
    {
      title: "资产类型",
      dataIndex: "assetTypeName",
      ellipsis: true,
      width: 200,
      customRender({ record }) {
        return record?.assetTypeName ?? "-";
      },
    },
    {
      title: "资产品牌",
      dataIndex: "trademarkName",
      key: "trademarkName",
      ellipsis: true,
      width: 200
    },
    {
      title: "资产系列",
      dataIndex: "assetSeriesCode",
      ellipsis: true,
      width: 200,
      customRender({ record }) {
        return record?.assetSeriesName || "-"
      },
    },
    {
      title: "资产型号",
      dataIndex: "deviceModel",
      key: "deviceModel",
      ellipsis: true,
      customRender({ record }) {
        return record?.deviceModel || "-"
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      ellipsis: true,
      width: 200,
    },
  ])
  return columns.value;
}

/**
 * 查询
 */
async function getDataList() {
  loading.value = true;
  try {
    const { content, totalElements } = await getWaitStockAssetApi({
      ...queryForm.value,
      page: currentPage.value,
      size: pageSize.value,
      sort: sort.value,
    });
    // 要求入库、忽略后，仍停留在当前页，防止以上操作完成后，当前页面没有数据
    if (content.length === 0 && totalElements > 0) {
      const lastPage = Math.round(totalElements / pageSize.value)
      currentPage.value = lastPage
      getDataList()
    } else if (currentPage.value !== 1 && totalElements === 0) {
      currentPage.value = 1
      getDataList()
    } else {
      dataList.value = content;
      total.value = totalElements;
      emit('refresh', total.value)
    }
  } finally {
    handleSelectionChange([], [])
    loading.value = false;
  }
}

/**
 * 查询首页
 */
function doSearch() {
  currentPage.value = 1;
  getDataList();
}

// 分页变化
const handleTableChange: TableProps["onChange"] = (pag, _, sorter) => {
  pageSize.value = pag.pageSize || pageSize.value;
  currentPage.value = pag.current || currentPage.value;
  if (!Array.isArray(sorter) && sorter.field) {
    const { field, order } = sorter;
    sort.value = `${field},${order === 'ascend' ? 'asc' : 'desc'}`
  }
  getDataList();
};

// 选中项配置
const selectedRowKeys = ref<Key[]>([]);
const selectedRows = ref<StockAsset[]>([]);
const rowSelectionConfig = computed<TableRowSelection<StockAsset>>(() => {
  return {
    onChange: handleSelectionChange,
    columnWidth: 40,
    selectedRowKeys: selectedRowKeys.value
  }
})
function handleSelectionChange(keys: Key[], rows: StockAsset[]) {
  selectedRowKeys.value = keys;
  selectedRows.value = rows;
}

/**
 * 批量入库
 * @param records 待入库资产
 */
function handleStock(records) {
  if (records.length < 1) {
    message.warn('请选择要入库的资产')
    return
  }
  const ids = records.map(item => item.id)
  const router = useRouter()

  // 存储页面的查询条件、页码、页数
  localStorage.setItem('asset-stock::page-info', JSON.stringify({
    queryData: queryForm.value,
    page: currentPage.value,
    size: pageSize.value,
  }))

  router.push({
    name: 'StockAssetBatch',
    state: {
      ids
    }
  })
}

/**
 * 批量忽略
 * @param records 忽略待入库资产
 */
function handleDeny(records) {
  if (records.length < 1) {
    message.warn('请选择要忽略的资产')
    return
  }
  Modal.confirm({
    iconType: "warning",
    title: '提示',
    content: '确认忽略？',
    async onOk() {
      try {
        loading.value = true
        const ids = records.map(item => item.id)
        const msg: string = await denyWaitStockAssetApi(ids)
        message.success(msg || '忽略成功');
        handleSelectionChange([], [])
        getDataList()
      } finally {
        loading.value = false
      }
    },
  })
}
</script>