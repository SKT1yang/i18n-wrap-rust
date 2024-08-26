<!--
 * @name: 永久忽略资产
 * @description: Do not edit
 * @date: 2023-02-16 09:19:15
 * @path: \feature-vue\platform\front\asset\src\views\asset-scan\verify\ModalPermonentDenyList.vue
-->
<template>
  <Modal v-model:open="dialogVisible" :width="900" @cancel="closeModal" :footer="null" :mask-closable="false">
    <template #title>
      <span class="text-md font-bold">永久忽略</span>
      <span class="text-sm font-normal ml-4 text-slate-400">资产的静态信息变化将会忽略，以人为配置信息为准</span>
    </template>
    <div class="space-y-4 mt-6">
      <!-- 查询表单 -->
      <Form layout="inline" :model="queryForm">
        <FormItem>
          <Input v-model:value="queryForm.deviceIp" placeholder="请输入IP地址" allowClear />
        </FormItem>
        <FormItem>
          <Input v-model:value="queryForm.deviceMac" placeholder="请输入MAC地址" allowClear />
        </FormItem>
        <FormItem>
          <Button @click="doSearch">
            查询
          </Button>
        </FormItem>
      </Form>

      <!-- 表格 -->
      <Table :data-source="dataList" :columns="getColumns()" row-key="id" :pagination="pagination" :loading="loading"
        @change="handleTableChange">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ (currentPage - 1) * pageSize + index + 1 }}
          </template>

          <template v-if="column.key === 'action'">
            <Button type="link" @click="handleCancelDeny([record])">不再忽略</Button>
          </template>
        </template>
      </Table>
    </div>
  </Modal>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue';
import type { TableProps, ColumnProps } from "ant-design-vue/es/table";
/* 第三方模块 */
import { ref, watch, computed } from 'vue'
import { Modal, Table, Form, FormItem, Input, Button, message } from 'ant-design-vue';
import { useVModel } from '@guolisec/utils';
import {
  type StockAsset,
  getDenyedAssetListApi,
  cancelDenyAssetPermanentApi
} from '../stock/model/stock'

// 父组件传值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  mode: {
    type: String as PropType<'create' | 'modify'>,
    default: 'create'
  },
});

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)

const queryForm = ref<{
  deviceIp: string;
  deviceMac: string;
}>({
  deviceIp: '',
  deviceMac: ''
});

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      queryForm.value = {
        deviceIp: '',
        deviceMac: ''
      }
      doSearch()
    }
  },
)

/********************** 表格 **********************/

const dataList = ref<StockAsset[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const sort = ref('')
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
      align: "center",
      ellipsis: true,
      width: 60,
    },
    {
      title: "IP地址",
      dataIndex: "deviceIp",
      key: "deviceIp",
      ellipsis: true,
    },
    {
      title: "MAC地址",
      dataIndex: "deviceMac",
      key: "deviceMac",
      ellipsis: true,
    },
    // {
    //   title: "资产类型",
    //   dataIndex: "assetTypeName",
    //   ellipsis: true,
    //   customRender({ record }) {
    //     return record?.assetTypeName ?? "-";
    //   },
    // },
    // {
    //   title: "资产品牌",
    //   dataIndex: "trademarkName",
    //   key: "trademarkName",
    //   ellipsis: true,
    //   customRender({ record }) {
    //     return record?.trademarkName ?? "-";
    //   },
    // },
    // {
    //   title: "资产系列",
    //   dataIndex: "assetSeriesCode",
    //   ellipsis: true,
    //   customRender({ record }) {
    //     return record?.assetSeriesName || "-"
    //   },
    // },
    // {
    //   title: "资产型号",
    //   dataIndex: "deviceModel",
    //   key: "deviceModel",
    //   ellipsis: true,
    //   customRender({ record }) {
    //     return record?.deviceModel || "-"
    //   },
    // },
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
    const { content, totalElements } = await getDenyedAssetListApi({
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

function handleCancelDeny(records) {
  if (records.length < 1) {
    message.warn('请选择要取消忽略的资产')
    return
  }
  Modal.confirm({
    iconType: "warning",
    title: '提示',
    content: '确认取消忽略？',
    async onOk() {
      try {
        loading.value = true
        const ids = records.map(item => item.id)
        const msg: string = await cancelDenyAssetPermanentApi(ids)
        message.success(msg || '取消忽略成功');
        doSearch()
      } finally {
        loading.value = false
      }
    },
  })
}

function closeModal() {
  dialogVisible.value = false
  emit('refresh');
}
</script>