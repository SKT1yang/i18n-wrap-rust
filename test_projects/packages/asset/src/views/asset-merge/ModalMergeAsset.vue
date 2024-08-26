<!--
 * @Name: 合并资产
 * @Description: 添加/修改
-->
<template>
  <Modal :title="t('合并资产')" v-model:open="dialogVisible" :width="1000" @cancel="closeModal" :footer="null">
    <Spin :spinning="spinning">
      <div class="space-y-4">
        <Collapse default-active-key="basic" expand-icon-position="end" class="w-[100%]">
          <CollapsePanel :header="t('资产基础信息')" key="basic">
            <Descriptions size="small" bordered :column="3">
              <DescriptionsItem :label="t('资产名称')">{{ asset.name }}</DescriptionsItem>
              <DescriptionsItem :label="t('IP地址')">{{ asset.assetIp }}</DescriptionsItem>
              <DescriptionsItem :label="t('MAC 地址')">{{ asset.assetMac }}</DescriptionsItem>
              <DescriptionsItem :label="t('资产类型')">{{ asset.assetTypeName }}</DescriptionsItem>
              <DescriptionsItem :label="t('资产系列')">{{ asset.assetSeriesNameLong }}
              </DescriptionsItem>
              <DescriptionsItem :label="t('运行状态')">{{ [t('离线'), t('在线'), t('闲置')][asset.runStatus || 0] }}
              </DescriptionsItem>
            </Descriptions>
          </CollapsePanel>
        </Collapse>

        <!-- todo  v-if="dialogVisible"不加会闪动 后续优化-->
        <Tabs v-model:activeKey="activeKey" type="editable-card" @edit="handleTabEdit" v-if="dialogVisible">
          <TabPane v-for="network in asset.networkAssetList" :key="network.id" :tab="network.networkName"
            :closable="closeableRef(network)">
            <AssetTransfer :asset="asset" :network="network" :optional-asset-list="optionalAssetList"
              @refresh="refreshAsset" />
          </TabPane>
        </Tabs>
      </div>
    </Spin>
    <CreateNetworkModal :uid="asset.uid" v-model:visible="createNetworkVisible" @refresh="refreshAsset" />
  </Modal>
</template>
<script name="ModifyAssetGroupModel" lang="ts" setup>
/* 类型文件 */
import type { Key } from 'ant-design-vue/es/vc-tree/interface';
import type { IAsset, INetworkAsset, INetwork } from '@guolisec/types';
/* 第三方模块 */
import { ref, ComputedRef, computed, watch } from 'vue';
import { Tabs, Modal, Spin, Collapse, CollapsePanel, Descriptions, DescriptionsItem, TabPane } from 'ant-design-vue';
import { useVModel } from '@guolisec/utils'
import { message } from '@guolisec/toast';
/* 本地模块 */
import { Asset } from '@/types/class';
import AssetTransfer from './AssetTransfer.vue';
import CreateNetworkModal from './CreateNetworkModal.vue';
import {
  getAssetDetailApi,
} from '@/model/list';
import { deleteNetworkApi, getOptionalNetworkAssetListApi, getNetworkListByAssetIdApi } from '@/model/mergeAsset';
import { t } from '@/languages/useLanguage'

// 父组件传值
const props = defineProps<{
  visible: boolean;
  asset?: IAsset
}>();

const emit = defineEmits(['update:visible', 'refresh']);
const dialogVisible = useVModel(props, 'visible', emit)

const spinning = ref(true)

// 弹窗逻辑
watch(
  () => props.visible,
  async (val) => {
    if (val) {
      spinning.value = true;
      optionalAssetList.value = []
      asset.value = props.asset || new Asset()
      await refreshAsset(false)
      setActiveKey()
    }
  },
)

function closeModal() {
  dialogVisible.value = false
  refreshParent();
}

let asset = ref<IAsset>(new Asset());
// 接口返回的可选附属资产
let optionalAssetList = ref<INetworkAsset[]>([]);

const activeKey = ref(asset.value.networkAssetList[0]?.id);

const closeableRef: ComputedRef<(network: INetwork) => boolean> = computed(() => {
  return (network) => {
    return !network.assetList.find((i) => {
      return i.uid === asset.value.uid;
    });
  };
});

const createNetworkVisible = ref(false)

function handleCreateNetworkAsset() {
  createNetworkVisible.value = true
}

function removeTab(targetKey: string) {
  Modal.confirm({
    iconType: 'warning',
    title: t('提示'),
    content: t("删除后网口下的合并资产将自动移除，确认删除?"),
    async onOk() {
      await deleteNetworkApi([Number(targetKey)]);
      message.success(t('删除成功'));
      await refreshAsset();
      setActiveKey()
    },
  });
}

function handleTabEdit(targetKey: Key | MouseEvent | KeyboardEvent, action: "add" | "remove") {
  if (action === 'add') {
    handleCreateNetworkAsset();
  } else {
    removeTab(targetKey as string);
  }
}

// 刷新数据
async function refreshAsset(refresh: boolean = true) {
  const response = await getAssetDetailApi({
    id: asset.value.id,
  });
  const networkAssetList = await getNetworkListByAssetIdApi({
    id: asset.value.id,
  });
  Object.assign(asset.value, response, {
    networkAssetList,
  });
  await getNetworkAddAssetList()
  refresh && refreshParent();
}

// 获得网卡可添加ip地址
async function getNetworkAddAssetList() {
  if (asset.value.uid) {
    optionalAssetList.value = await getOptionalNetworkAssetListApi({
      mainUid: asset.value.uid,
      assetTypeCode: asset.value.assetTypeCode,
    });
    spinning.value = false;
  }
}

// 设置选中tab
function setActiveKey() {
  if (asset.value.networkAssetList && asset.value.networkAssetList.length > 0) {
    activeKey.value = asset.value.networkAssetList[0]?.id
  }
}

function refreshParent() {
  emit('refresh');
}
</script>
