<!--
 * @name: 资产组树形选择框
 * @description: Do not edit
-->
<template>
  <TreeSelect class="min-w-40" v-model:value="groupId" :treeData="treeData" :fieldNames="fieldNames" placeholder="选择资产组"
    allowClear />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TreeSelect } from 'ant-design-vue'
import { getAssetGroupTreeNoAssetApi } from '@/model/group'
import { IAssetGroupTreeItem } from '@guolisec/types';
import { onMountedOrActivated } from '@guolisec/utils';
import { emitter, EMITTER_SELECT_GROUP_TREE } from '../../utils/emitter'

const groupId = defineModel<string>('value')
const treeData = ref<IAssetGroupTreeItem[]>([])
const fieldNames = {
  value: 'id',
  label: 'label',
  children: 'children',
}

async function getAssetGroupTreeData() {
  treeData.value = await getAssetGroupTreeNoAssetApi();
}

/**
 * 当增、删、改资产组的内容后，刷新数据
 */
emitter.on(EMITTER_SELECT_GROUP_TREE.refreshGroupTree, () => {
  getAssetGroupTreeData()
})

onMountedOrActivated(() => {
  getAssetGroupTreeData()
})
</script>