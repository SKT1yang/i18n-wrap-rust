<!--
 * @name: 资产选择穿梭框
 * @description: Do not edit
-->
<template>
  <Transfer :row-key="(record) => record.uid" v-model:target-keys="targetKeys" :data-source="totalAssetList" pagination
    show-search :show-select-all="false" :locale="{ searchPlaceholder: '资产名称或 IP' }" :listStyle="{ width: '500px', }"
    :filter-option="handleFilter" :render="(item) => `${item.name}`" @change="handleChange">
    <template #children="{
      filteredItems, selectedKeys, disabled: listDisabled, onItemSelect, onItemSelectAll
    }">
      <Table :data-source='filteredItems' row-key='uid' :columns='columns' size="small" :row-selection="getRowSelection({
        selectedKeys, onItemSelectAll, onItemSelect, disabeld: listDisabled
      })" :style="{ pointerEvent: listDisabled ? 'none' : null }" />

    </template>
  </Transfer>
</template>
<script lang="ts" setup>
import { h, ref, watchEffect } from 'vue';
import { Modal, Transfer, Table } from 'ant-design-vue';
import { message } from '@guolisec/toast';
import { INetworkAsset, INetwork, IAsset } from '@guolisec/types';
import { createNetworkAssetBatchApi, deleteNetworkAssetBatchApi } from '@/model/mergeAsset'
import { t } from '@/languages/useLanguage'
import { isShowByFeature } from '../asset-list/context/useListContext';
import { checkAssetScanTaskApi } from '@/model/list';

const props = defineProps<{
  // 当前主资产
  asset: IAsset;
  // 当前网口
  network: INetwork;
  optionalAssetList: INetworkAsset[]
}>();

const emit = defineEmits(['refresh'])

// 该网口下后台附属资产全集
let totalAssetList = ref<INetworkAsset[]>([]);
let targetKeys = ref<string[]>([]);

watchEffect(() => {
  targetKeys.value = props.network.assetList.map((asset) => {
    return String(asset.uid);
  });
});

watchEffect(() => {
  const renderAssetList = props.optionalAssetList
  totalAssetList.value = [...renderAssetList, ...props.network.assetList].map(
    (item) => {
      return {
        disabled: item.uid === props.asset.uid,
        ...item,
      };
    },
  );
});

function handleFilter(inputVal, item) {
  return item.name.indexOf(inputVal) !== -1 || item.assetIp.indexOf(inputVal) !== -1
}

const columns = ref(
  [{
    title: t('名称'),
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: t('IP'),
    dataIndex: 'assetIp',
    ellipsis: true,
  }]
)

function getRowSelection({
  selectedKeys, onItemSelectAll, onItemSelect, disabeld
}) {
  return {
    getCheckboxProps: (item: Record<string, string | boolean>) => ({
      disabled: disabeld || item.disabled
    }),
    onSelectAll(selected: boolean, selectedRows: Record<string, string | boolean>[]) {
      const treeSelectedKeys = selectedRows.filter(item => !item.disabeld).map(({ uid }) => uid)
      onItemSelectAll(treeSelectedKeys, selected)
    },
    onSelect({ uid }: Record<string, string>, selected: boolean) {
      onItemSelect(uid, selected)
    },
    selectedRowKeys: selectedKeys
  }
}

const showAssetScan = ref(isShowByFeature('asset-scan::check-asset-scan-task'))
/**
 * 查找要删除的资产是否在监测任务被使用
 */
async function checkAssetsInScanTask(assets) {
  const ids = assets.map((i) => i.id);
  const { baseLine, scan } = await checkAssetScanTaskApi({ assetIds: ids })
  if (baseLine.length + scan.length) {
    const baseLineNames = baseLine.join('、')
    const scanNames = scan.join("、")
    Modal.confirm({
      title: t('无法合并资产'),
      width: 500,
      content: () => h('div', {}, [
        scan.length ? h('div', { class: 'font-bold', }, t('资产在以下监测任务中被使用：')) : undefined,
        scan.length ? h('div', { class: 'mb-4', }, scanNames) : undefined,
        baseLine.length ? h('div', { class: 'font-bold' }, t('资产在以下资产基线规则中被使用：')) : undefined,
        baseLine.length ? h('div', { class: 'mb-4' }, baseLineNames) : undefined,
        h('div', {}, t("请先解除关联后再尝试合并。")),
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

async function handleChange(keys: string[], direction: 'right' | 'left', moveKeys: string[]) {
  try {
    if (direction === 'right') {
      if (showAssetScan.value) {
        const assetList = totalAssetList.value.filter(asset => {
          return keys.includes(asset.uid)
        })
        await checkAssetsInScanTask(assetList)
      }
      // 限制全部合并 一次合并最多10个资产进行合并
      if (keys.length > 10) {
        targetKeys.value = keys.filter((key) => {
          return !moveKeys.includes(key);
        });
        message.warning(t('最多 10 个资产进行合并'));
        return;
      }
      // 新增附属资产
      const networkAddAssetDTOList = moveKeys.map((key) => {
        return {
          mainUid: props.asset.uid,
          networkId: props.network.id,
          uid: key,
        };
      });
      await createNetworkAssetBatchApi(networkAddAssetDTOList);
      message.success(t('添加成功！'));
    }
    if (direction === 'left') {
      // 主资产key
      const mainKey = props.asset.uid;
      if (moveKeys.includes(mainKey)) {
        message.warning(t('该网口下包含主资产，无法删除！'));
        return;
      }
      // 删除附属资产
      await deleteNetworkAssetBatchApi(moveKeys);
      message.success(t('删除成功！'));
    }
  } finally {
    emit('refresh')
  }
}
</script>
