<!--
 * @Name: 批量修改资产
 * @Description: 带查询表格
 * @Author: ygd
-->
<template>
  <div class="space-y-4">
    <div class="mb-4 w-full flex justify-between">
      <div class="font-semibold text-[16px] leading-[24px]">
        资产批量入库
      </div>
      <Button size="small" @click="handlePropertyShow">
        <i class="i-base-setting align-icon"></i>
      </Button>
    </div>
    <!-- 资产表格 -->
    <Table :data-source="dataList" :columns="columns" bordered :pagination="pagination" :loading="loading" size="small"
      :style="{
        minWidth: '100%',
        width: `${columsFilter.length * 250}px`
      }">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">
          {{ (currentPage - 1) * pageSize + index + 1 }}
        </template>
        <template v-if="column.key === 'name'">
          <Tooltip :title="record.name ? '' : '资产名称必填'">
            <Input v-model:value.trim="record.name" :maxlength="30" :status="record.name ? '' : 'error'"
              placeholder="请输入资产名称" autocomplete="off" allowClear />
          </Tooltip>
        </template>
        <template v-if="column.key === 'assetTypeCode'">
          <SelectAssetType v-model:value="record.assetTypeCode" class="w-full" />
        </template>
        <template v-if="column.key === 'assetGroupId'">
          <SelectTreeAssetGroup v-model:value="record.assetGroupId" />
        </template>
        <template v-if="column.key === 'trademarkCode'">
          <SelectAssetTrademark v-model:trademarkCode="record.trademarkCode" :options="trademarkOptions" />
        </template>
        <template v-if="column.key === 'assetSeriesCode'">
          <SelectAssetSeries v-model:trademarkCode="record.trademarkCode" :options="trademarkOptions"
            v-model:assetSeriesCode="record.assetSeriesCode" style="width: 100%" />
        </template>
        <template
          v-if="column.key === 'sn' && record.assetTypeCode && [8, 10, 11, 12, 13, 16, 19, 23, 27, 28, 29, 45].includes(record.assetTypeCode)">
          <Input v-model:value.trim="record.sn" :maxlength="30" placeholder="请输入硬件序列号" autocomplete="off" />
        </template>
        <template v-if="column.key === 'assetIp'">
          <Input v-model:value.trim="record.assetIp" disabled :maxlength="30" placeholder="请输入资产IP" autocomplete="off" />
        </template>
        <template v-if="column.key === 'assetMac'">
          <Input v-model:value.trim="record.assetMac" disabled :maxlength="30" placeholder="请输入资产Mac地址"
            autocomplete="off" />
        </template>
        <template
          v-if="column.key === 'softwareVersion' && record.assetTypeCode && ![1, 2, 17, 30, 3, 25].includes(record.assetTypeCode)">
          <Input v-model:value.trim="record.softwareVersion" :maxlength="100" placeholder="请输入软件版本" autocomplete="off" />
        </template>
        <template v-if="column.key === 'assetLocation'">
          <Input v-model:value.trim="record.assetLocation" :maxlength="30" placeholder="请输入所处位置" autocomplete="off" />
        </template>
        <template v-if="column.key === 'runStatus'">
          <SelectRunStatus v-model:value="record.runStatus" />
        </template>
        <template v-if="column.key === 'createTime'">
          <DatePicker class="w-95" show-time v-model:value="record.createTime" value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择入网时间" />
        </template>
        <template v-if="column.key === 'hardwareModel' && (record.assetTypeCode === 1 || record.assetTypeCode === 45)">
          <Input v-model:value.trim="record.hardwareModel" :maxlength="30" placeholder="请输入资产型号" autocomplete="off" />
        </template>
        <template v-if="column.key === 'importance'">
          <SelectAssetImportance v-model:value="record.importance" v-if="record.assetTypeCode === 1" />
          <div v-else></div>
        </template>
        <template v-if="column.key === 'security'">
          <Input v-model:value.trim="record.security" :maxlength="30" placeholder="请输入责任部门" autocomplete="off" />
        </template>
        <template v-if="column.key === 'os' && record.assetTypeCode && [3, 25].includes(record.assetTypeCode)">
          <SelectAssetOs v-model:value="record.os" />
        </template>
        <template v-if="column.key === 'fieldId'">
          <SelectAssetField v-model:value="record.fieldId" />
        </template>
        <template v-if="column.key === 'port'">
          <InputNumber class="w-95" v-model:value="record.port" :min="0" :max="65535" placeholder="请输入http端口"
            v-if="record.assetTypeCode && [11].includes(record.assetTypeCode)" />
          <div v-else></div>
        </template>
      </template>
    </Table>
    <div class="flex justify-center space-x-4 mt-4">
      <Button @click="handleBack">
        放弃修改
      </Button>
      <Button type="primary" @click="hanldeStock">
        确认入库
      </Button>
    </div>

    <PropertyFilter v-model:visible="propertyVisible" :current="columsFilter" @refresh="handleProperty" />
  </div>
</template>

<script name="AssetList" lang="ts" setup>
/* 类型文件 */
import type { ColumnProps } from "ant-design-vue/es/table";
import type { IAsset, IAssetTrademark } from '@guolisec/types';
/* 第三方模块 */
import {
  Table, Button, Input, DatePicker, InputNumber, Tooltip
} from "ant-design-vue"
import { ref, computed } from 'vue'
import { useRouter } from '@guolisec/routerable';
import { onMountedOrActivated, Asset } from '@guolisec/utils'
import { message } from '@guolisec/toast'
/* 本地模块 */
/* 组件 */
import SelectAssetField from '@/views/form/SelectAssetField.vue';
import SelectAssetType from '@/views/form/SelectAssetType.vue';
import SelectRunStatus from '@/views/form/SelectRunStatus.vue';
import SelectAssetImportance from '@/views/form/SelectAssetImportance.vue';
import SelectTreeAssetGroup from '@/views/form/SelectTreeAssetGroup.vue';
import SelectAssetOs from "@/views/form/SelectAssetOs.vue";
import SelectAssetTrademark from '@/views/form/SelectAssetTrademark.vue';
import SelectAssetSeries from '@/views/form/SelectAssetSeries.vue';
import PropertyFilter from './PropertyFilter.vue';
import {
  type StockAsset,
  getWaitStockAssetApi,
  denyWaitStockAssetApi
} from './model/stock'
import { PROPERTY_FILTER_DEFAULT } from "./model/stock.data";
import { getAssetBrandsApi, createAssetBatchApi } from '@/model/list'

/********************** props、context、event处理 **********************/

/********************** 初始化状态 **********************/

let ids: number[] = []

onMountedOrActivated(() => {
  const state = history.state
  console.log('state', state)
  if (state.ids) {
    ids = state.ids
  } else {
    ids = []
  }
  getDataList();
  getAssetBrands()
})

/********************** 表格查询 **********************/

const dataList = ref<IAsset[]>([])
const total = ref<number>(0);
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false) // 表格loading

const columsFilter = ref<(string | number)[]>(PROPERTY_FILTER_DEFAULT)
const columns = computed(() => {
  const cfg: ColumnProps<IAsset>[] = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      align: "center",
      ellipsis: true,
      width: 80,
    },
    {
      title: "资产名称",
      dataIndex: "name",
      key: "name",
      width: 180
    },
    {
      title: "IP 地址",
      dataIndex: "assetIp",
      key: "assetIp",
      width: 180
    },
    {
      title: "MAC 地址",
      dataIndex: "assetMac",
      key: "assetMac",
      width: 200
    },
    {
      title: "资产类型",
      dataIndex: "assetTypeCode",
      key: "assetTypeCode",
      width: 140
    },
    {
      title: "资产品牌",
      dataIndex: "trademarkCode",
      key: "trademarkCode",
      width: 140
    },
    {
      title: "资产系列",
      dataIndex: "assetSeriesCode",
      key: "assetSeriesCode",
      width: 160
    },
    {
      title: "硬件型号",
      dataIndex: "hardwareModel",
      key: "hardwareModel",
      width: 200
    },
    {
      title: "资产组",
      dataIndex: "assetGroupId",
      key: "assetGroupId",
      width: 160
    },
    {
      title: "层级",
      dataIndex: "layer",
      key: "layer",
      width: 120
    },
    {
      title: "资产域",
      dataIndex: "fieldId",
      key: "fieldId",
      width: 160
    },
    {
      title: "硬件序列号",
      dataIndex: "sn",
      key: "sn",
      width: 200
    },
    {
      title: "软件版本",
      dataIndex: "softwareVersion",
      key: "softwareVersion",
      width: 160
    },
    {
      title: "所处位置",
      dataIndex: "assetLocation",
      key: "assetLocation",
      width: 160
    },
    {
      title: "运行状态",
      dataIndex: "runStatus",
      key: "runStatus",
      width: 160
    },
    {
      title: "入网时间",
      dataIndex: "createTime",
      key: "createTime",
      width: 160
    },
    {
      title: "重要程度",
      dataIndex: "importance",
      key: "importance",
      width: 160
    },
    {
      title: "责任部门",
      dataIndex: "security",
      key: "security",
      width: 160
    },
    {
      title: "操作系统",
      dataIndex: "os",
      key: "os",
      width: 160
    },
    {
      title: "HTTP 端口",
      dataIndex: "port",
      key: "port",
      width: 120
    },
  ]
  return cfg.filter((i) => {
    return i.key && columsFilter.value.includes(i.key)
  })
})

const pagination = computed(() => {
  return {
    total: total.value,
    showTotal: () => `共 ${total.value} 项`,
  };
});


/**
 * 获取待入库资产原始数据并转换成新增资产所需数据结构
 */
async function getDataList() {
  loading.value = true;
  try {
    const { content, totalElements } = await getWaitStockAssetApi({
      ids,
      page: 1,
      size: 1000000,
    });
    dataList.value = transferStockAssetList(content);
    total.value = totalElements
  } finally {
    loading.value = false;
  }
}

function transferStockAssetList(stockAssetList: StockAsset[]) {
  return stockAssetList.map(stockAsset => {
    const asset = new Asset()
    asset.assetIp = stockAsset.deviceIp
    asset.assetMac = stockAsset.deviceMac
    asset.trademarkCode = stockAsset.trademarkCode
    asset.assetTypeCode = stockAsset.assetTypeCode
    asset.assetSeriesCode = stockAsset.assetSeriesCode
    asset.runStatus = stockAsset.runStatus
    asset.name = stockAsset.name
    asset.createTime = stockAsset.createTime
    asset.os = stockAsset.os
    asset.hardwareModel = stockAsset.hardwareModel
    asset.deviceModel = stockAsset.deviceModel
    asset.id = stockAsset.id
    asset.softwareVersion = stockAsset.softwareVersion
    // todo
    // @ts-ignore
    asset.osDict = stockAsset.osDict
    // @ts-ignore
    asset.sn = stockAsset.sn || undefined
    asset.assetLocation = stockAsset.assetLocation

    return asset
  })
}

async function hanldeStock() {
  for (let i = 0; i < dataList.value.length; i++) {
    const record = dataList.value[i]
    if (!record.name) {
      return
    }
  }

  const dataListForm = dataList.value.map(i => {
    const { id, ...data } = i
    return data
  })
  await createAssetBatchApi(dataListForm)

  await denyWaitStockAssetApi(dataList.value.map(item => item.id))

  message.success("入库成功")
  handleBack()
}

/********************** 资产品牌 **********************/

const trademarkOptions = ref<IAssetTrademark[]>([])

async function getAssetBrands() {
  const { content } = await getAssetBrandsApi()
  trademarkOptions.value = content
}

/********************** 自定义表单项 **********************/

const propertyVisible = ref(false)

function handleProperty(value) {
  columsFilter.value = value
}

function handlePropertyShow() {
  propertyVisible.value = true
}

function handleBack() {
  const router = useRouter()
  router.back()
}
</script>