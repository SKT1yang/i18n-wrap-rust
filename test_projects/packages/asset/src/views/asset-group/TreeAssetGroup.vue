<!--
 * @Name: 资产组树
 * @Description: Do not edit
-->
<template>
  <div class="asset-group-tree relative">
    <CollapseTransition orientation="horizontal" animation-duration=".6s">
      <!-- 折叠容器 -->
      <div v-show="!isCollapse" class="h-full">
        <div class="min-w-70 mb-2">
          <div class="flex items-center justify-between mb-2">
            <span class="mr-1">{{ t("资产组") }}</span>
            <!-- 一级新增 -->
            <div>
              <!-- 资产组同步 -->
              <AssetGroupSync />
              <Button type="text" @click="handleCreate()" title="新增">
                <template #icon>
                  <i class="i-base-add-line  align-icon"></i>
                </template>
              </Button>
            </div>
          </div>
          <Input :placeholder="t('搜索资产组名称')" size="small" allowClear v-model:value="searchValue" :maxlength="24">
          <template #prefix>
            <i class="i-base-search"></i>
          </template>
          </Input>
        </div>
        <!-- 修改主题明暗，让选中更明显 -->
        <ConfigProvider :theme="{
          token: {
            colorPrimaryBg: colorScheme === 'dark' ? '#1677ff' : '#e6f4ff'
          }
        }">
          <Tree class="h-full min-h-150 min-w-75 max-h-170 overflow-auto" :treeData="getTreeData"
            :fieldNames="fieldNames" v-model:expanded-keys="expandedKeys" @select="handleSelect" block-node>
            <template #title="scope">
              <div class="flex justify-between" @mouseenter="handleMouseHover(scope.id)"
                @mouseleave="handleMouseLeave()">
                <span class="w-30 overflow-ellipsis truncate" :title="scope.label">
                  <i class="i-base-archive-2-line"></i>
                  {{
                    scope.label
                  }}</span>

                <span class="flex items-center mr-2">
                  <span v-if="currentHoverTreeId === scope.id && scope.id !== '0'">
                    <!-- 新增 -->
                    <i class="i-base-add-line cursor-pointer align-icon" @click.stop="handleCreate(scope)"></i>
                    <!-- 修改 -->
                    <i class="i-base-edit-line cursor-pointer align-icon" @click.stop="handleEdit(scope)"></i>
                    <!-- 删除 -->
                    <i class="i-base-delete cursor-pointer align-icon" @click.stop="handleDelete(scope)"></i>
                  </span>
                  <span v-else>{{ scope.assetNum }}</span>
                </span>
              </div>
            </template>
          </Tree>
        </ConfigProvider>
      </div>
    </CollapseTransition>

    <!-- 折叠按钮 -->
    <Button class="absolute -right-6 top-7.5" shape="circle" size="small" @click="handleFold">
      <i v-if="!isCollapse" class="i-base-arrow-left-double-line align-icon"></i>
      <i v-else class="i-base-arrow-right-double-line align-icon"></i>
    </Button>

    <!-- 弹窗 -->
    <ModalUpdateAssetGroup :asset-group="currentAssetGroup" v-model:visible="dialogVisible" :mode="mode"
      @refresh="handleRefresh" />
  </div>
</template>
<script name="AssetTree" lang="ts" setup>
/* 类型文件 */
import type { PropType } from 'vue'
import { TreeProps } from 'ant-design-vue/es/tree';
import { IAssetGroupTreeItem } from '@guolisec/types'
/* 第三方模块 */
import { onMounted, ref, watch, unref, computed, inject, h } from 'vue';
import { Tree, Modal, Button, Input, ConfigProvider, theme } from 'ant-design-vue';
import { CollapseTransition } from '@guolisec/collapse';
import { useDebounceFn, filterTree, treeToList, cloneDeep } from '@guolisec/utils';
import { message } from '@guolisec/toast';
/* 本地模块 */
import ModalUpdateAssetGroup from './ModalUpdateAssetGroup.vue';
import AssetGroupSync from './AssetGroupSync.vue';
import { getAssetGroupTreeApi, deleteAssetGroupApi } from '../../model/group';
import { emitter, EMITTER_TOPICS, EMITTER_SELECT_GROUP_TREE } from '../../utils/emitter'
import { t } from '@/languages/useLanguage'
import { provideAssetListContext, type Features } from '@/views/asset-list/context/useListContext';
import { isShowByFeature } from '../asset-list/context/useListContext';
import { checkAssetScanTaskApi } from '@/model/list';

/********************** props、context、event处理 **********************/

const props = defineProps({
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

provideAssetListContext({
  hiddenFeatures: props.hiddenFeatures,
  closeFeatures: props.closeFeatures,
})

/********************** 渲染树 **********************/
// 完整数据
const treeData = ref<TreeProps['treeData']>([]);
// 渲染数据，考虑搜索
const getTreeData = computed(() =>
  cloneDeep(startSearch.value ? searchData.value : unref(treeData))
);

const selectedNode = defineModel<IAssetGroupTreeItem>('value')
function handleSelect(_keys, { selected, selectedNodes }) {
  if (selected && Array.isArray(selectedNodes) && selectedNodes.length > 0) {
    selectedNode.value = selectedNodes[0]
  } else {
    selectedNode.value = undefined
  }
}

// 加载资产组接口请求数据时间大约 2-3 秒，在此期间将整个页面设置为 loading 状态
const changePageLoadingStatus = inject('changePageLoadingStatus', (status: boolean) => { console.log(status) })

async function getAssetGroupTree() {
  changePageLoadingStatus(true)
  try {
    treeData.value = await getAssetGroupTreeApi() as unknown as TreeProps['treeData'];
  } finally {
    changePageLoadingStatus(false)
  }
}

// 资产表格内，某个资产更换了分组或删除了某个资产，需要重新刷新资产组数据，以获取资产组内资产的最新数量。
emitter.on(EMITTER_TOPICS.refreshGroupTree, () => {
  getAssetGroupTree()
})

/********************** 增删改 **********************/

// 清单中子资产组新增可以无限嵌套，应最多嵌套5个
const currentAssetGroup = ref()
const dialogVisible = ref(false)
const mode = ref<'create' | 'modify'>('create')

/**
 * 打开新增弹窗
 * @param treeItem 
 */
function handleCreate(treeItem?: IAssetGroupTreeItem) {
  if (treeItem?.level === 5) {
    message.warning(t('资产组最多嵌套5层'));
    return;
  }
  currentAssetGroup.value = treeItem || {
    id: '-1',
    level: 1,
  }
  mode.value = 'create'
  dialogVisible.value = true
}

/**
 * 打开编辑弹窗
 * @param treeItem 
 */
function handleEdit(treeItem: IAssetGroupTreeItem) {
  if (treeItem?.level && treeItem?.level > 5) {
    message.warning(t('资产组最多嵌套5层'));
    return;
  }
  currentAssetGroup.value = treeItem
  mode.value = 'modify'
  dialogVisible.value = true
}

/**
 * 删除资产组
 */
const showAssetScan = ref(isShowByFeature('asset-scan::check-asset-scan-task'))
function handleDelete(treeItem) {
  if (showAssetScan.value) {
    // 不使用 async-await 是因为，PopConfirm 弹窗会延迟关闭
    checkAssetGroupInScanTask(treeItem).then(() => {
      deleteAssetGroup(treeItem)
    })
  } else {
    deleteAssetGroup(treeItem)
  }
}

/**
 * 查找要删除的资产是否在监测任务被使用
 */
async function checkAssetGroupInScanTask(treeItem) {
  const { baseLine, scan } = await checkAssetScanTaskApi({ assetGroupIds: [treeItem.id] })
  if (baseLine.length + scan.length) {
    const baseLineNames = baseLine.join('、')
    const scanNames = scan.join("、")
    Modal.confirm({
      title: `${t("无法删除资产组")} (${treeItem.name})`,
      width: 500,
      content: () => h('div', {}, [
        scan.length ? h('div', { class: 'font-bold', }, t("该资产组在以下监测任务中被使用：")) : undefined,
        scan.length ? h('div', { class: 'mb-4', }, scanNames) : undefined,
        baseLine.length ? h('div', { class: 'font-bold' }, t("该资产组在以下资产基线规则中被使用：")) : undefined,
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

function deleteAssetGroup(treeItem: IAssetGroupTreeItem) {
  // 含有子资产组，禁止删除并提示
  if (treeItem?.children && treeItem?.children?.length > 0) {
    message.warning(t("该资产组下还有子分组，请勿删除"));
    return;
  }
  Modal.confirm({
    iconType: 'warning',
    title: t("提示"),
    content: t("确定要删除资产组-{}?", treeItem.label),
    async onOk() {
      await deleteAssetGroupApi(treeItem.id);
      message.success(t('删除成功'));
      getAssetGroupTree();
      handleEmitRefreshSelectGroupTree()
    },
  });
}

/**
 * 当增、删、改资产组的内容后，触发 SelectTreeAssetGroup 组件数据的更新
 */
function handleEmitRefreshSelectGroupTree() {
  emitter.emit(EMITTER_SELECT_GROUP_TREE.refreshGroupTree, null)
}

function handleRefresh() {
  getAssetGroupTree()
  handleEmitRefreshSelectGroupTree()
}

// 鼠标聚焦tree 显示隐藏修改图标
const currentHoverTreeId = ref('')

// 监听treeitem hover事件
function handleMouseHover(id) {
  currentHoverTreeId.value = id
}

function handleMouseLeave() {
  currentHoverTreeId.value = ''
}

/********************** 搜索资产组逻辑 **********************/

const fieldNames = ref({ key: 'id', title: 'label', children: 'children' })
const searchValue = ref('');
const expandedKeys = ref([])
const startSearch = ref(false)
const searchData = ref<TreeProps['treeData']>([])
const debounceSearchChange = useDebounceFn(handleSearch, 200);
watch(
  () => searchValue.value,
  (v) => {
    debounceSearchChange(v);
  },
);

function handleSearch(searchValue: string) {
  if (!searchValue) {
    startSearch.value = false
    return;
  }
  const expandOnSearch = true
  startSearch.value = true
  const { title, key } = fieldNames.value;

  const matchedKeys: string[] = [];
  searchData.value = filterTree(
    treeData.value || [],
    (node) => {
      const result = node[title]?.includes(searchValue) ?? false;
      if (result) {
        matchedKeys.push(node[key]);
      }
      return result;
    },
  );

  if (expandOnSearch) {
    const expandKeys = treeToList(searchData.value).map((val) => {
      return val[key];
    });
    if (expandKeys && expandKeys.length) {
      expandedKeys.value = expandKeys;
    }
  }
}

/********************** 收缩展开逻辑 **********************/
// 收缩展开状态
let isCollapse = ref(false);
function handleFold() {
  isCollapse.value = !isCollapse.value
}

/********************** 处理主题 **********************/

const colorScheme = computed(() => {
  const token = theme.useToken().token.value
  return token.colorBgBase === '#fff' ? 'light' : 'dark'
})

onMounted(() => {
  getAssetGroupTree();
});
</script>

<style>
.asset-group-tree ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.asset-group-tree ::-webkit-scrollbar-track {
  background-color: var(--color-border, rgb(0 0 0 / 5%));
}

.asset-group-tree ::-webkit-scrollbar-thumb {
  background-color: #9093994d;
  border-radius: 2px;
  box-shadow: inset 0 0 6px rgb(0 0 0 / 20%);
}

.asset-group-tree ::-webkit-scrollbar-thumb:hover {
  background-color: rgba(89, 91, 95, 0.3);
}
</style>
