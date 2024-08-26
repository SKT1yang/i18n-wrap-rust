<template>
  <div class="space-y-4">
    <!-- 查询表单 -->
    <Form class="flex justify-between" layout="inline" :model="queryForm">
      <div class="flex">
        <FormItem>
          <Input v-model:value="queryForm.deviceIp" placeholder="IP 地址" allowClear />
        </FormItem>
        <FormItem>
          <Button @click="doSearch" type="primary">
            查询
          </Button>
        </FormItem>
      </div>

      <div>
        <Button @click="handleShowPermanentDenyList">
          <span>永久忽略列表</span>
        </Button>
      </div>

    </Form>

    <div v-if="runningTaskNumber">
      <Alert message="当前有正在执行的任务，品牌信息可能不准确，请在任务结束后进行核实" show-icon type="info" />
    </div>

    <!-- 卡片 -->
    <div class="grid grid-cols-3 grid-rows-3 gap-4">
      <Card v-for="record in dataList" :key="record.id" :title="record.name">
        <template #extra>
          <Button type="link" @click="handleModify([record])">更新信息</Button>
          <Button type="text" @click="handleDeny([record])" danger>忽略一次</Button>
          <Dropdown>
            <i class="i-base-more-line"></i>
            <template #overlay>
              <Menu @click="({ key }) => {
                handleMenuClick(key, record)
              }">
                <MenuItem key="permonentDeny">永久忽略</MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </template>
        <table class="table-fixed w-full">
          <tr>
            <td>MAC 地址:</td>
            <td>{{ record.compareMap?.assetMac?.key ?? '' }}</td>
            <td class="text-green-500">
              <i class="i-base-arrow-right-line" v-if="record.compareMap?.assetMac.value !== null"></i>
              {{ record.compareMap?.assetMac.value ?? '' }}
            </td>
          </tr>
          <tr>
            <td>资产类型:</td>
            <td>{{ record.compareMap?.assetTypeName?.key ?? '' }}</td>
            <td class="text-green-500">
              <i class="i-base-arrow-right-line" v-if="record.compareMap?.assetTypeName.value !== null"></i>
              {{ record.compareMap?.assetTypeName?.value ?? '' }}
            </td>
          </tr>
          <tr>
            <td>资产品牌:</td>
            <td>{{ record.compareMap?.tradeMarkName?.key ?? '' }}</td>
            <td class="text-green-500 flex items-center">
              <i class="i-base-arrow-right-line" v-if="record.compareMap?.tradeMarkName.value !== null"></i>
              {{ record.compareMap?.tradeMarkName?.value ?? '' }}
            </td>
          </tr>
          <tr>
            <td>资产系列:</td>
            <td>{{ record.compareMap?.assetSeriesName?.key ?? '' }}</td>
            <td class="text-green-500 flex items-center">
              <i class="i-base-arrow-right-line" v-if="record.compareMap?.assetSeriesName.value !== null"></i>
              {{ record.compareMap?.assetSeriesName?.value ?? '' }}
            </td>
          </tr>
          <tr>
            <td>资产型号:</td>
            <td>{{ record.compareMap?.hardwareModel?.key ?? '' }}</td>
            <td class="text-green-500">
              <i class="i-base-arrow-right-line" v-if="record.compareMap?.hardwareModel.value !== null"></i>
              {{ record.compareMap?.hardwareModel?.value ?? '' }}
            </td>
          </tr>
        </table>
      </Card>
    </div>
    <Pagination size="small" v-model:current="currentPage" :total="total" v-model:pageSize="pageSize" v-show="total"
      @change="handleChange" show-quick-jumper :show-total="(t) => `共 ${t} 条`" style="float: right; margin-top: 16px" />

    <Empty v-if="total === 0" />
    <!-- 新增资产弹窗 -->
    <ModalPermonentDenyList v-model:visible="dialogVisible" :mode="mode" @refresh="getDataList" />
  </div>
</template>
<script setup lang="ts">
/* 类型文件 */
/* 第三方模块 */
import { ref, onMounted } from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Card,
  Dropdown,
  Menu,
  MenuItem,
  Pagination,
  Modal,
  message,
  Alert,
  Empty
} from 'ant-design-vue';
/* 本地模块 */
import ModalPermonentDenyList from './ModalPermonentDenyList.vue'
import {
  type VerifyAsset,
  stockAssetApi,
  denyWaitStockAssetApi,
  getAssetVerificationAssetApi,
  denyAssetPermanentApi,
  countRunningTaskNumberApi
} from '../stock/model/stock'

/********************** 外部状态和配置 **********************/

const emit = defineEmits(['refresh']);

/********************** 初始化状态 **********************/

onMounted(() => {
  getDataList();
  getCountRunningTaskNumber()
});

/********************** 查询表单 **********************/

const queryForm = ref<{
  deviceIp: string;
}>({
  deviceIp: ""
});

/********************** 表格 **********************/

const dataList = ref<VerifyAsset[]>([]);
const currentPage = ref(1);
const pageSize = ref(9);
const total = ref(0);
const loading = ref<boolean>(false);

/**
 * 查询
 */
async function getDataList() {
  loading.value = true;
  try {
    const { content, totalElements } = await getAssetVerificationAssetApi({
      ...queryForm.value,
      page: currentPage.value,
      size: pageSize.value,
    });
    // 要求更新、忽略、永久忽略后，仍停留在当前页，防止以上操作完成后，当前页面没有数据
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
    loading.value = false;
  }
}

const runningTaskNumber = ref(0)
async function getCountRunningTaskNumber() {
  runningTaskNumber.value = await countRunningTaskNumberApi()
}

/**
 * 查询首页
 */
function doSearch() {
  currentPage.value = 1;
  getDataList();
}


function handleChange(current, size) {
  currentPage.value = current
  pageSize.value = size
  getDataList();
}

// 弹窗状态
const mode = ref<'create' | 'modify'>('create')
const dialogVisible = ref(false)

function handleShowPermanentDenyList() {
  dialogVisible.value = true
}

/**
 * 更新入库信息
 * @param records 待入库资产
 */
function handleModify(records) {
  if (records.length < 1) {
    message.warn('请选择要更新入库的资产')
    return
  }
  Modal.confirm({
    iconType: "warning",
    title: '提示',
    content: '确认更新信息？',
    async onOk() {
      try {
        loading.value = true
        const ids = records.map(item => item.id)
        const msg: string = await stockAssetApi(ids)
        message.success(msg || '更新信息成功');
        getDataList()
      } finally {
        loading.value = false
      }
    },
  })
}

/**
 * 批量忽略
 * @param records 忽略待核查资产
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
        getDataList()
      } finally {
        loading.value = false
      }
    },
  })
}

function handleMenuClick(key, record) {
  switch (key) {
    case 'permonentDeny':
      handlePermanentDeny([record])
      break;
    default:
      break;
  }
}

function handlePermanentDeny(records) {
  if (records.length < 1) {
    message.warn('请选择要永久忽略的资产')
    return
  }
  Modal.confirm({
    iconType: "warning",
    title: '提示',
    content: '确认永久忽略？',
    async onOk() {
      try {
        loading.value = true
        const ids = records.map(item => item.id)
        const msg: string = await denyAssetPermanentApi(ids)
        message.success(msg || '永久忽略成功');
        getDataList()
      } finally {
        loading.value = false
      }
    },
  })
}
</script>
