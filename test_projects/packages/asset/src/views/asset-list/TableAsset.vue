<!--
 * @Name: 资产表格列表
 * @Description: 带查询
-->
<template>
  <div class="shrink">
    <!-- 查询表单 -->
    <div class="flex justify-between">
      <Form class="gap-y-4" layout="inline">
        <FormItem v-if="isShowByFeature('asset::create', hiddenFeatures)">
          <Button @click="handleCreate" type="primary">
            {{ t("新增") }}
          </Button>
        </FormItem>
        <!-- 导入资产 -->
        <FormItem v-if="isShowByFeature('asset::import::merge-import', hiddenFeatures)">
          <UploadAsset @refresh="handleRefreshListAndAssetGroup" />
        </FormItem>
        <template v-if="!showPreSearchPanel">
          <FormItem>
            <Input class="w-40" v-model:value="queryForm.name" autocomplete="off" :placeholder="t('资产名称')" allowClear />
          </FormItem>
          <FormItem>
            <Input class="w-40" v-model:value="queryForm.assetIp" :placeholder="t('IP 地址')" allowClear />
          </FormItem>
          <FormItem>
            <SelectAssetType v-model:value="queryForm.assetTypeCode" allowClear />
          </FormItem>
          <FormItem v-if="false">
            <SelectTreeAssetGroup v-model:value="queryForm.assetGroupId" />
          </FormItem>
          <FormItem v-if="isShowByFeature('asset-field', hiddenFeatures)">
            <SelectAssetField v-model:value="queryForm.fieldId" />
          </FormItem>
          <FormItem v-if="isShowByFeature('asset::importance', hiddenFeatures)">
            <SelectAssetImportance v-model:value="queryForm.importance" />
          </FormItem>
          <FormItem v-if="isShowByFeature('asset::run-status', hiddenFeatures)">
            <SelectRunStatus v-model:value="queryForm.runStatus" />
          </FormItem>
          <FormItem>
            <Button @click="doSearch">
              {{ t("查询") }}
            </Button>
          </FormItem>
        </template>

        <FormItem v-if="isShowByFeature('asset::modify::batch', hiddenFeatures)">
          <Button @click="handleBulkEdit(selections)" :disabled="selections.length === 0">
            {{ t("批量编辑") }}
          </Button>
        </FormItem>
        <FormItem>
          <Button @click="handleDelete(selections)" :loading="loading" danger :disabled="selections.length === 0">
            {{ t("批量删除") }}
          </Button>
        </FormItem>
        <FormItem>
          <Dropdown>
            <Button :loading="downloadAssetListLoading">
              {{ t("更多") }}
              <i class="i-base-more-fill align-icon ml-1"></i>
            </Button>
            <template #overlay>
              <Menu @click="handleDropdownMenu">
                <MenuItem key="downloadAssetList" :disabled="downloadAssetListLoading"
                  v-if="isShowByFeature('asset::export', hiddenFeatures)">
                <i class="i-base-download-line align-icon"></i>
                {{ t("导出资产") }}
                </MenuItem>
                <MenuItem key="downloadTemplate"
                  v-if="isShowByFeature('asset::export::download-template', hiddenFeatures)">
                <i class="i-base-file-download-line align-icon"></i>
                {{ t("下载模板") }}
                </MenuItem>
                <MenuItem key="groupAsset" :disabled="selections.length === 0">
                <i class="i-base-file-copy-line align-icon"></i>
                {{ t("批量分组") }}
                </MenuItem>
                <MenuItem key="baseline" v-if="isShowByFeature('asset-scan::update-baseline', hiddenFeatures)">
                <i class="i-base-database-line align-icon"></i>
                {{ t("更新基线") }}
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </FormItem>

      </Form>

      <div v-if="isShowByFeature('asset::pro-search', hiddenFeatures)">
        <Button type="link" @click="showPreSearchPanel = true">{{ t("高级查询") }}</Button>
      </div>

    </div>

    <ProSearchPanel v-model:show-panel="showPreSearchPanel" v-model:value="queryForm" @refresh="doSearch" />

    <!-- 资产表格 -->
    <Table :data-source="dataList" :columns="columns" row-key="id" :scroll="{ x: 1650 }" class="mt-4"
      :pagination="pagination" :loading="loading" @change="handleTableChange" :row-selection="{
        onChange:
          handleSelectionChange,
        columnWidth: 40,
        selectedRowKeys: selectedKeys
      }" size="small">

      <!-- 网口资产（展开） -->
      <template #expandedRowRender="{ record }" v-if="isShowByFeature('asset::merge', hiddenFeatures)">
        <ExpandedRow :networkAssetList="record.networkAssetList" />
      </template>
      <template #bodyCell="{ column, record, index }">
        <!-- 序号 -->
        <template v-if="column.key === 'index'">
          {{ (currentPage - 1) * pageSize + index + 1 }}
        </template>
        <!-- 操作 -->
        <template v-if="column.key === 'action'">
          <Button type="link" @click="handleView(record)">{{ t("详情") }}</Button>
          <Button type="link" @click="handleEdit(record)">{{ t("修改") }}</Button>
          <Button type="link" @click="handleMerge(record)" v-if="isShowByFeature('asset::merge', hiddenFeatures)">
            <span>{{ t("合并") }}</span>
            <span class="ml-1 w-5 h-5 rounded-full text-$color-text-base bg-$color-text-placeholder"
              v-show="networkAssetCount(record) > 1">{{
                networkAssetCount(record)
              }}</span>
          </Button>
          <Popconfirm :title="t('是否确认删除')" @confirm="handleDelete([record])">
            <Button type="text" danger>{{ t("删除") }}</Button>
          </Popconfirm>
        </template>
      </template>
    </Table>

    <!-- 新增/修改资产弹窗 -->
    <ModalUpdateAsset v-model:visible="updateVisible" :asset="currentAsset" :mode="updateMode"
      @refresh="handleRefreshListAndAssetGroup" :importance="importance" />
    <!-- 资产合并弹窗 -->
    <ModalMergeAsset v-model:visible="mergeVsible" :asset="currentAsset" @refresh="getDataList" />
    <!-- 资产分组弹窗 -->
    <ModalGroupAsset v-model:visible="groupVsible" :asset-ids="selectedKeys"
      @refresh="handleRefreshListAndAssetGroup" />
    <!-- 批量编辑 -->
    <ModalBulkEditAssets v-model:visible="bulkEditVisible" :assets="bulkEditAssets" @refresh="getDataList" />
  </div>
</template>

<script name="AssetList" lang="ts" setup>
/* 类型文件 */
import type { Ref, PropType } from 'vue'
import type { TableProps } from "ant-design-vue/es/table";
import type { IAsset, IAssetGroupTreeItem } from '@guolisec/types';
/* 第三方模块 */
import {
  Table, Button, Popconfirm, Form, FormItem, Input, Modal, Dropdown, Menu, MenuItem
} from "ant-design-vue"
import { ref, computed, inject, watch, onMounted, h } from 'vue'
import { downloadByData } from '@guolisec/utils'
import { message } from '@guolisec/toast'
import { useRouter } from '@guolisec/routerable';
/* 本地模块 */
import { getColumns } from '../../controller/list';
import { provideAssetListContext, type Features } from './context/useListContext';
import {
  getAssetListApi,
  exportAssetTableApi,
  downloadAssetTemplateApi,
  deleteAssetApi,
  downloadAnGangExcelApi,
  downloadAnGangExcelTempleApi,
  checkAssetScanTaskApi
} from '../../model/list';
import { setAllAssetBaseLineApi } from '../../model/baseline'
import { emitter, EMITTER_TOPICS } from '../../utils/emitter'
import { t } from '@/languages/useLanguage'
import { isShowByFeature } from './context/useListContext';
/* 组件 */
import UploadAsset from './UploadAsset.vue'
import ExpandedRow from './ExpandedRow.vue';
import SelectAssetField from '../../views/form/SelectAssetField.vue'
import SelectAssetImportance from '../../views/form/SelectAssetImportance.vue'
import SelectRunStatus from '../../views/form/SelectRunStatus.vue'
import SelectAssetType from '../../views/form/SelectAssetType.vue'
import SelectTreeAssetGroup from "../../views/form/SelectTreeAssetGroup.vue";
import ModalUpdateAsset from "./ModalUpdateAsset.vue";
import ModalBulkEditAssets from "./ModalBulkEditAssets.vue";
import ModalMergeAsset from "../../views/asset-merge/ModalMergeAsset.vue";
import ModalGroupAsset from "../asset-group/ModalGroupAsset.vue";
import ProSearchPanel from './ProSearchPanel.vue';

/********************** props、context、event处理 **********************/

const props = defineProps({
  runStatus: {
    type: Number
  },
  importance: {
    type: Number as PropType<0 | 1>
  },
  hiddenFeatures: {
    type: Array as PropType<Features>,
    default() {
      return []
    }
  },
  closeFeatures: {
    type: Array as PropType<Features>,
    default() {
      return []
    }
  }
})

// 合并props和context的隐藏配置项
const hiddenFeatures = computed(() => {
  return props.hiddenFeatures
})

provideAssetListContext({
  hiddenFeatures: props.hiddenFeatures,
  closeFeatures: props.closeFeatures,
})

/********************** 初始化 **********************/

// 排序
const sortedInfo = ref()
const columns = computed(() => {
  const sorted = sortedInfo.value || {}

  return getColumns(sorted).value
})

/**
 * 页面加载后，assetGroupId 会被注入的数据赋值。
 * 如果从详情页跳转到该页面，携带的页面信息在对 assetGroupId 赋值后会被重新赋值。
 * 定义取消赋值变量，当值为 true 时，不对注入的数据进行赋值。
 */
const cancelAssignAssetGroupId = ref(false)

onMounted(() => {
  queryForm.value.runStatus = props.runStatus
  queryForm.value.importance = props.importance
  const params = history.state;
  // todo 判断太复杂，想办法简化，核心保证是一个合法的assetTypeCode
  if ((params.assetTypeCode || params.assetTypeCode === 0 || params.assetTypeCode === '0') && !isNaN(Number(params.assetTypeCode))) {
    queryForm.value.assetTypeCode = Number(params.assetTypeCode)
  }
  if (params.importance !== undefined) {
    queryForm.value.importance = Number(params.importance)
  }

  /**
   * 实现从资产详情页返回查询条件、页数、页码不变，取出跳转详情页前的存储在 localStorage 中的内容。
   */
  const router = useRouter()
  const fromDetailPageInfo = localStorage.getItem('asset-list::page-info')
  const backPath = router?.options?.history?.state?.forward

  // 如果上一个页面是详情页，且 localStorage 中有内容，将数据赋值给查询变量等
  if (backPath === '/asset/detail' && fromDetailPageInfo) {
    const fromDetailPageInfoObject = JSON.parse(fromDetailPageInfo)
    const { queryData, page, size } = fromDetailPageInfoObject

    queryForm.value = { ...queryForm.value, ...queryData }
    currentPage.value = page
    pageSize.value = size

    // 还原排序
    const sort = queryForm.value.sort
    if (sort.length > 1) {
      const sorted = sort[0].split(',')
      sortedInfo.value = {
        field: sorted[0],
        order: sorted[1] === 'desc' ? 'descend' : 'ascend'
      }
    }
    cancelAssignAssetGroupId.value = true
  }
  // 清空 localStorage 中的内容
  localStorage.removeItem('asset-list::page-info')

  getDataList();
})

/********************** 表格查询 **********************/

type AssetQuery = {
  signP: 'null';
  sort: string[];
  assetModuleFlag: true;
  name?: string;
  fieldId?: string;
  assetTypeCode?: number;
  assetGroupId?: string;
  assetIp: string;
  runStatus?: number;
  importance?: number;
  assetMac?: string;
  trademarkCode?: number;
  ports?: number[]
}

const queryForm = ref<AssetQuery>({
  signP: 'null',
  sort: ['id,desc'],
  assetModuleFlag: true,
  name: undefined,
  fieldId: undefined,
  assetTypeCode: undefined,
  assetGroupId: undefined,
  assetIp: '',
  runStatus: undefined,
  importance: undefined,
  ports: []
})
const dataList = ref<IAsset[]>([])
const total = ref<number>(0);
const currentPage = ref(1);
const pageSize = ref(10);
const loading = ref(false) // 表格loading

const pagination = computed(() => {
  return {
    total: total.value,
    current: currentPage.value,
    pageSize: pageSize.value,
    defaultPageSize: pageSize.value,
    showSizeChanger: true,
    showTotal: () => `共 ${total.value} 项`,
  };
});

const handleTableChange: TableProps["onChange"] = (pag, _, sorter: any) => {
  pageSize.value = pag.pageSize || pageSize.value;
  currentPage.value = pag.current || currentPage.value;

  const { order, field } = sorter
  if (field && order) {
    queryForm.value.sort = [`${field},${order === 'descend' ? 'desc' : 'asc'}`, 'id,desc']
  } else {
    queryForm.value.sort = ['id,desc']
  }
  sortedInfo.value = sorter

  getDataList();
};

const currentPageElementNumber = ref(0) // 当前页展示条数
const totalPages = ref(0) // 总页数

async function getDataList() {
  loading.value = true
  try {
    const { content, totalElements, numberOfElements, totalPages: pages } = await getAssetListApi({
      page: currentPage.value,
      size: pageSize.value,
      ...queryForm.value
    })
    dataList.value = content
    total.value = totalElements
    currentPageElementNumber.value = numberOfElements || 0
    totalPages.value = pages || 0
  } finally {
    handleSelectionChange([], [])
    loading.value = false
  }
}

function doSearch() {
  currentPage.value = 1;
  getDataList();
}

// 资产列表选中项
const selections = ref<IAsset[]>([]) // 选中的场景id
const selectedKeys = ref<number[]>([])
function handleSelectionChange(selectionRowKeys, selectionRows: IAsset[]) {
  selectedKeys.value = selectionRowKeys
  selections.value = selectionRows
}

/********************** 高级查询 **********************/

const showPreSearchPanel = ref(false)

/********************** 资产组逻辑 **********************/

const assetGroupInject = inject<{
  assetGroup?: Ref<IAssetGroupTreeItem>
}>('assetGroup')

const assetGroup = ref()

watch(() => assetGroupInject?.assetGroup?.value, () => {
  if (cancelAssignAssetGroupId.value) {
    cancelAssignAssetGroupId.value = false
    return
  }
  if (assetGroupInject?.assetGroup?.value) {
    queryForm.value.assetGroupId = assetGroupInject.assetGroup.value.id
    assetGroup.value = assetGroupInject.assetGroup.value
  } else {
    queryForm.value.assetGroupId = undefined
    assetGroup.value = undefined
  }
})

watch(() => queryForm.value.assetGroupId, () => {
  getDataList();
})

/**
 * 资产分组
 */
const groupVsible = ref(false)
async function handleGroup() {
  groupVsible.value = true
}

// 资产分组后需要刷新左边资产组树（假如有）的数据
function groupRefresh() {
  emitter.emit(EMITTER_TOPICS.refreshGroupTree, null)
}

function handleRefreshListAndAssetGroup() {
  getDataList()
  groupRefresh()
}

/********************** 资产操作逻辑 **********************/

/**
 * 新增/修改资产
 */
const updateVisible = ref(false)
const currentAsset = ref<IAsset>()
const updateMode = ref<'create' | 'modify'>('create')

async function handleCreate() {
  currentAsset.value = undefined
  updateMode.value = 'create'
  updateVisible.value = true
}

async function handleEdit(record) {
  currentAsset.value = record
  updateMode.value = 'modify'
  updateVisible.value = true
}

/**
 * 删除资产
 */
const showAssetScan = ref(isShowByFeature('asset-scan::check-asset-scan-task', hiddenFeatures.value))

function handleDelete(selections) {
  if (selections.length > 0) {
    if (showAssetScan) {
      // 不使用 async-await 是因为，PopConfirm 弹窗会延迟关闭
      checkAssetsInScanTask(selections).then(() => {
        deleteAsset(selections)
      })
    } else {
      deleteAsset(selections)
    }
  } else {
    message.warning(t('请选择要批量删除的资产'));
  }
}

/**
 * 查找要删除的资产是否在监测任务被使用
 */
async function checkAssetsInScanTask(selections) {
  const ids = selections.map((i) => i.id);
  const { baseLine, scan } = await checkAssetScanTaskApi({ assetIds: ids })
  if (baseLine.length + scan.length) {
    const baseLineNames = baseLine.join('、')
    const scanNames = scan.join("、")
    Modal.confirm({
      title: t('无法移除资产'),
      width: 500,
      content: () => h('div', {}, [
        scan.length ? h('div', { class: 'font-bold', }, t('资产在以下监测任务中被使用：')) : undefined,
        scan.length ? h('div', { class: 'mb-4', }, scanNames) : undefined,
        baseLine.length ? h('div', { class: 'font-bold' }, t('资产在以下资产基线规则中被使用：')) : undefined,
        baseLine.length ? h('div', { class: 'mb-4' }, baseLineNames) : undefined,
        h('div', {}, t("请先解除关联后再尝试移除。")),
      ]),
      cancelText: t('我知道了'),
      centered: true,
      okButtonProps: {
        style: { display: 'none' }
      },
    })
    return Promise.reject()
  }
  return Promise.resolve()
}

async function deleteAsset(selections) {
  Modal.confirm({
    iconType: 'warning',
    title: t('提示'),
    cancelText: t('关闭'),
    centered: true,
    content: hiddenFeatures.value?.includes('asset::merge') ? t("确认删除资产？") : t("删除该资产，合并的资产同时被删除，确认删除？"),
    async onOk() {
      try {
        loading.value = true;
        const ids = selections.map((i) => i.id);
        await deleteAssetApi(ids);
        message.success(t('删除成功'));
        // 判断当前页的所有资产是否被全部删除
        if (currentPageElementNumber.value === selectedKeys.value.length || currentPageElementNumber.value === 1) {
          // 删除当前页数据后跳转 1. 页码是第一页，跳转第一页；2. 页码是最后一页，跳转至倒数第二页；3. 页面是除第一页、最后页的中间页，停留在当前页面
          if (totalPages.value === 1) {
            currentPage.value = 1
          } else if (totalPages.value === currentPage.value) {
            currentPage.value = currentPage.value - 1
          }
        }
        selectedKeys.value = [];
      } finally {
        loading.value = false;
        handleRefreshListAndAssetGroup()
      }
    },
  });

}

/**
 * 批量编辑
 */
const bulkEditVisible = ref(false)
const bulkEditAssets = ref<IAsset[]>([])
function handleBulkEdit(selections) {
  bulkEditVisible.value = true
  bulkEditAssets.value = selections
}

function handleDropdownMenu(event) {
  if (!event?.key) return
  switch (event.key) {
    case 'downloadAssetList':
      handleDownloadAssetList()
      break;
    case 'downloadTemplate':
      handleDownloadTemplate()
      break;
    case 'groupAsset':
      handleGroup()
      break;
    case 'baseline':
      handleBaseline()
      break;
  }
}

/**
 * 导出资产清单
 */
const downloadAssetListLoading = ref(false)
async function handleDownloadAssetList() {
  downloadAssetListLoading.value = true
  try {
    const api = hiddenFeatures.value.includes('an-gang') ? exportAssetTableApi : downloadAnGangExcelApi
    const data = await api(queryForm.value);
    downloadByData(data, t('资产列表.xlsx'));
    message.success(`资产清单导出成功`);
  } finally {
    downloadAssetListLoading.value = false
  }

}

/**
 * 导出资产模板
 */
async function handleDownloadTemplate() {
  const api = hiddenFeatures.value.includes('an-gang') ? downloadAssetTemplateApi : downloadAnGangExcelTempleApi
  const data = await api();
  downloadByData(data, t('资产模板.xlsx'));
  message.success(t("资产模板下载成功"));
}

/**
 * 查看资产详情
 */
async function handleView(record) {
  // 存储页面的查询条件、页码、页数
  localStorage.setItem('asset-list::page-info', JSON.stringify({
    queryData: queryForm.value,
    page: currentPage.value,
    size: pageSize.value,
  }))

  const router = useRouter()
  router.push({
    name: 'AssetDetail',
    state: {
      id: record.id
    }
  })

}

/**
 * 合并资产
 */
const mergeVsible = ref(false)
async function handleMerge(record) {
  currentAsset.value = record
  mergeVsible.value = true
}

const networkAssetCount = computed(() => {
  return (record) => {
    const data = record as IAsset
    return data.networkAssetList ? data.networkAssetList.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.assetList.length
    }, 0) : 0
  }
})

/**
 * 设置基线（资产扫描后）
 */
async function handleBaseline() {
  await setAllAssetBaseLineApi();
  message.success(`设置成功`);
}
</script>