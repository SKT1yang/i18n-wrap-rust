<!--
 * @Name: 拓扑清单
 * @Description: 
 * @Author: ygd
-->

<template>
  <div class="space-y-4">
    <div class="font-bold">网络拓扑</div>
    <div>
      <Form layout="inline" :model="queryForm">
        <FormItem>
          <Button type="primary" @click="handleCreateTopology">
            新增拓扑
          </Button>
        </FormItem>
        <!-- <FormItem>
          <Button @click="handleImportTopology">
            导入拓扑
          </Button>
        </FormItem> -->
        <FormItem>
          <Input v-model:value="queryForm.name" placeholder="拓扑图名称" allowClear />
        </FormItem>
        <FormItem>
          <Button @click="doSearch">
            查询
          </Button>
        </FormItem>
      </Form>
      <!-- <div></div> -->
    </div>
    <Table :data-source="dataList" size="small" :columns="getColumns()" :pagination="pagination" :loading="loading"
      @change="handleTableChange" :scroll="{ x: 1500 }">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ (currentPage - 1) * pageSize + index + 1 }}
        </template>

        <template v-if="column.key === 'action'">
          <Button type="link" @click="handleViewDetail(record)">详情</Button>
          <Button type="link" @click="handleDeleteTopology([record])" :disabled="record.mainTopo" danger
            :loading="loading">删除</Button>
        </template>
      </template>
    </Table>
    <ModalUpdateTopologyInfo v-model:visible="updateVisible" :current="current" mode="create" @refresh="doSearch" />
  </div>
</template>

<script lang='ts' setup>
/* 类型文件 */
import type { TableProps } from "ant-design-vue/es/table";
import type { TopologyInfo } from "../../types";
/* 第三方模块 */
import { reactive, onMounted, computed, ref } from 'vue';
import { Button, Form, FormItem, Input, Table, message, Modal } from 'ant-design-vue'
import { useRouter } from "@guolisec/routerable";
import { downloadByData } from '@guolisec/utils'
/* 本地模块 */
// 组件
import ModalUpdateTopologyInfo from './ModalUpdateTopologyInfo.vue'
import { getColumns } from './topology.data'
import { getTopoInformationListApi, deleteTopoInformationApi } from '../../model/list'
import { getTopoInformationById } from "../../service/getTopologyInfo";

/********************** 外部状态或配置 **********************/

/********************** 初始化状态 **********************/

onMounted(() => {
  getDataList();
});

/********************** 查询表单 **********************/

const queryForm = reactive({
  name: "", // 拓扑图名称
});

/********************** 表格 **********************/

const dataList = ref<TopologyInfo[]>([]);
const total = ref();
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref<boolean>(false);
const sort = ref('updateTime,desc')

const pagination = computed(() => {
  return {
    total: total.value,
    current: currentPage.value,
    pageSize: pageSize.value,
    defaultPageSize: 10,
    showSizeChanger: true,
    showTotal: () => `共 ${total.value} 项 `
  };
});


async function getDataList() {
  const { content, totalElements } = await getTopoInformationListApi({
    ...queryForm,
    page: currentPage.value,
    size: pageSize.value,
    sort: sort.value
  });
  dataList.value = content;
  total.value = totalElements;
}

function doSearch() {
  currentPage.value = 1;
  getDataList();
}

const handleTableChange: TableProps["onChange"] = (pag, _filters, sorter: any) => {
  pageSize.value = pag.pageSize || pageSize.value;
  currentPage.value = pag.current || currentPage.value;

  const { order, field } = sorter
  switch (order) {
    case 'ascend':
      sort.value = `${field},asc`
      break
    case 'descend':
      sort.value = `${field},desc`
      break
    default:
      sort.value = ''
  }

  getDataList();
};

/********************** 操作按钮 **********************/

const updateVisible = ref(false)
const current = ref<TopologyInfo>()
const mode = ref('create')

async function handleCreateTopology() {
  current.value = undefined
  mode.value = 'create'
  updateVisible.value = true
}

async function handleImportTopology() {

}

async function handleViewDetail(record) {
  const router = useRouter()
  router.push({
    name: 'TopologyView',
    query: {
      id: record.id
    }
  })
}

async function handleExportTopology(record) {
  const info = await getTopoInformationById(record.id)
  const blob = new Blob([info.information], {
    type: 'application/json'
  })
  downloadByData(blob, `拓扑图.json`)
}

async function handleDeleteTopology(records) {
  if (records.length < 1) {
    message.warn('请选择要删除的数据')
    return
  }
  Modal.confirm({
    iconType: "warning",
    title: '提示',
    content: '确认删除该拓扑？',
    async onOk() {
      try {
        loading.value = true
        const ids = records.map(item => item.id)
        const msg: string = await deleteTopoInformationApi({
          ids: ids
        })
        message.success(msg || '删除成功');
        doSearch()
      } finally {
        loading.value = false
      }
    },
  })
}
</script>