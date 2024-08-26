<template>
  <div class="space-y-4">
    <!-- 查询表单 -->
    <Form layout="inline">
      <FormItem>
        <Button @click="handleDownloadTemplate">
          <i class="i-base-download-line align-icon" />
          <span>获取资产核查模板</span>
        </Button>
      </FormItem>
      <FormItem>
        <UploadCompareAsset @refresh="doSearch" />
      </FormItem>
      <FormItem>
        <Button :disabled="selectedRows.length < 1" :loading="loading" danger @click="handleDelete(selectedRows)">
          <i class="i-base-delete align-icon" />
          <span>批量删除</span>
        </Button>
      </FormItem>
    </Form>

    <!-- 表格 -->
    <Table :data-source="dataList" :columns="getColumns()" row-key="id" :pagination="pagination" :loading="loading"
      :row-selection="rowSelectionConfig" @change="handleTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Button type="link" @click="handleview(record)">查看资产核查结果</Button>
          <Button type="text" @click="handleDelete([record])" danger>删除</Button>
        </template>
      </template>
    </Table>

    <!-- 新增资产弹窗 -->
    <ModalCompareDetail v-model:visible="updateVisible" :current="current" @refresh="doSearch" />
  </div>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { Key } from 'ant-design-vue/es/table/interface';
import type { TableRowSelection } from 'ant-design-vue/es/table/interface';
import type { TableProps, ColumnProps } from "ant-design-vue/es/table";
import type { AssetCompareRecord } from '../../model/compare';
/* 第三方模块 */
import { ref, computed, onMounted } from 'vue'
import {
  Button,
  Form,
  FormItem,
  Table,
  Modal,
  message
} from 'ant-design-vue';
import { downloadByData, formatToDateTime } from '@guolisec/utils';
/* 本地模块 */
import ModalCompareDetail from './ModalCompareDetail.vue';
import UploadCompareAsset from './UploadCompareAsset.vue'
import {
  getAssetCompareRecordListApi,
  deleteAssetCompareRecordApi,
  downloadAssetCompareTemplateApi
} from '../../model/compare'

/********************** 外部状态和配置 **********************/

/********************** 初始化状态 **********************/

onMounted(() => {
  getDataList();
});

/********************** 查询表单 **********************/

// 下载资产核查模板
const downloadTemplateLoading = ref(false)
async function handleDownloadTemplate() {
  try {
    downloadTemplateLoading.value = true
    const data = await downloadAssetCompareTemplateApi()
    downloadByData(data, "资产核查模板.xlsx", data.type)
  } finally {
    downloadTemplateLoading.value = false
  }
}

/********************** 表格 **********************/

const dataList = ref<AssetCompareRecord[]>([]);
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
  const columns = ref<ColumnProps<AssetCompareRecord>[]>([
    {
      title: "生成时间",
      dataIndex: "createTime",
      key: "createTime",
      ellipsis: true,
      customRender(opt) {
        return formatToDateTime(opt.record.createTime)
      },
    },
    {
      title: "文件名",
      dataIndex: "fileName",
      key: "fileName",
      ellipsis: true,
    },
    {
      title: "文件大小",
      dataIndex: "sizeStr",
      key: "sizeStr",
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
    },
  ]);
  return columns.value;
}

/**
 * 查询
 */
async function getDataList() {
  loading.value = true;
  try {
    const { content, totalElements } = await getAssetCompareRecordListApi({
      page: currentPage.value,
      size: pageSize.value,
      sort: sort.value,
    });
    dataList.value = content;
    total.value = totalElements;
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
const selectedRows = ref<AssetCompareRecord[]>([]);
const rowSelectionConfig = computed<TableRowSelection<AssetCompareRecord>>(() => {
  return {
    onChange: handleSelectionChange,
    columnWidth: 40,
    selectedRowKeys: selectedRowKeys.value
  }
})
function handleSelectionChange(keys: Key[], rows: AssetCompareRecord[]) {
  selectedRowKeys.value = keys;
  selectedRows.value = rows;
}

// 弹窗状态
const current = ref()
const updateVisible = ref(false)

function handleview(record) {
  current.value = record
  updateVisible.value = true
}

/**
 * 删除
 * @param records 删除项数据
 */
function handleDelete(records) {
  if (records.length < 1) {
    message.warn('请选择要删除的数据')
    return
  }
  Modal.confirm({
    iconType: "warning",
    title: '提示',
    content: '确认删除？',
    async onOk() {
      try {
        loading.value = true
        const ids = records.map(item => item.id)
        const msg: string = await deleteAssetCompareRecordApi({
          idList: ids
        })
        message.success(msg || '删除成功');
        handleSelectionChange([], [])
        doSearch()
      } finally {
        loading.value = false
      }
    },
  })
}
</script>
