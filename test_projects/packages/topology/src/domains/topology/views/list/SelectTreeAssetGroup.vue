<!--
 * @name: 资产组树形选择框
 * @description: Do not edit
 * @path: \feature-vue\platform\front\topology\src\domains\topology\views\list\SelectTreeAssetGroup.vue
-->
<template>
  <TreeSelect :disabled="props.disabled" class="min-w-40" v-bind="attrs" v-model:value="groupIds" tree-default-expand-all
    tree-checkable :treeData="treeData" v-if="treeData.length > 0" allow-clear :fieldNames="fieldNames"
    placeholder="选择网络拓扑图中包含的资产组" tree-check-strictly @change="handleTreeSelectChange" />
</template>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { TreeSelect } from 'ant-design-vue'
import { getAssetGroupTreeApi } from '../../model/list'
import { IAssetGroupTreeItem } from '@guolisec/types';
import { onMountedOrActivated } from '@guolisec/utils';

const props = defineProps({
  disabled: Boolean
})

const groupIds = defineModel<string[]>('value')
const treeData = ref<IAssetGroupTreeItem[]>([])
const fieldNames = {
  value: 'id',
  label: 'label',
  children: 'children',
}

const attrs = useAttrs()

async function getAssetGroupTreeData() {
  treeData.value = await getAssetGroupTreeApi();
}

function handleTreeSelectChange(value) {
  groupIds.value = value.map(item => item.value)
}

onMountedOrActivated(() => {
  getAssetGroupTreeData()
})
</script>