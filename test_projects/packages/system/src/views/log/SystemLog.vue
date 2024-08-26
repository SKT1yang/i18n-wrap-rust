<template>
  <!-- 表格 -->
  <Table :data-source="dataList" :columns="getColumns()" row-key="id" :pagination="pagination" :loading="loading"
    @change="handleTableChange">
    <template #bodyCell="{ column, index }">
      <template v-if="column.key === 'index'">
        {{ (currentPage - 1) * pageSize + index + 1 }}
      </template>
    </template>
  </Table>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { TableProps, ColumnProps } from "ant-design-vue/es/table";
import type { Log } from './type';
/* 第三方模块 */
import { ref, computed, onMounted } from 'vue'
import {
  Table,
} from 'ant-design-vue';
import { formatToDate } from '@guolisec/utils';
/* 本地模块 */
import { getSystemLogsApi } from '../../model/log'


/********************** 外部状态和配置 **********************/

const props = defineProps({
  searchForm: {
    type: Object,
    default() {
      return {
        username: '', // 用户名
        description: '', // 描述
      }
    }
  }
});

/********************** 初始化状态 **********************/

onMounted(() => {
  getDataList();
});

/********************** 查询表单 **********************/

const queryForm = ref<{
  username: string;
  description: string;
  browserNull: string;
}>({
  username: '', // 用户名
  description: '', // 描述
  browserNull: 'any', // 系统日志传任意值
});


/********************** 表格 **********************/

const dataList = ref<Log[]>([]);
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
    showQuickJumper: true,
    showTotal: () => `共 ${total.value} 条数据,共${Math.ceil(total.value / pageSize.value)}页`
  };
});

/**
 * 获取表格列的配置描述
 */
function getColumns() {
  const columns = ref<ColumnProps<Log>[]>([
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      ellipsis: true,
      width: 80,
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      sorter: true,
      width: 180,
      customRender: ({ text }) => {
        return text ? formatToDate(text, 'YYYY-MM-DD HH:mm:ss') : '-';
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 260,
      customRender: ({ text }) => {
        return text ? text : '-';
      },
    },
    {
      title: '详情',
      dataIndex: 'message',
      ellipsis: true,
      customRender: ({ text }) => {
        return text ? text : '-';
      },
    },
  ]);
  return columns.value;
}

/**
 * 查询首页
 */
function doSearch() {
  currentPage.value = 1;
  getDataList();
}

/**
 * 查询
 */
async function getDataList() {
  loading.value = true;
  queryForm.value.username = props.searchForm.username
  queryForm.value.description = props.searchForm.description
  try {
    const { content, totalElements } = await getSystemLogsApi({
      ...queryForm.value,
      page: currentPage.value,
      size: pageSize.value,
      sort: sort.value,
    });
    dataList.value = content;
    total.value = totalElements;
  } finally {
    loading.value = false;
  }
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

defineExpose({
  doSearch,
});
</script>
