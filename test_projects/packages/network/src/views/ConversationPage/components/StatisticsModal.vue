<!--
 * @name: 功能码弹窗
 * @author: bwb
 * @description: 功能码弹窗
 * @path: \network\src\views\ConversationPage\components\StatisticsModal.vue
-->
<template>
  <Modal :open="open" title="功能码" :min-height="50" :mask-closable="false" :can-fullscreen="false" :footer="false"
    @cancel="handleCancel">
    <Table bordered :pagination="false" :data-source="statistics" :size="'small'" :columns="basicColumns"></Table>
  </Modal>
</template>

<script setup name="StatisticsModal" lang="ts">
import { ref, watch } from 'vue';
import type { TableColumnsType } from "ant-design-vue"
import { Table, Modal } from "ant-design-vue"

let statistics = ref([]);

const parentProps = defineProps<{ open: boolean, statistics: any }>()
const parentFunc = defineEmits(['update:open'])

watch(() => parentProps.open, () => {
  if (parentProps.open) {
    statistics.value = parentProps.statistics;
  }
})

const basicColumns: TableColumnsType = [
  {
    title: '功能码',
    dataIndex: 'eventName',
    align: 'center',
  },
  {
    title: '数量',
    dataIndex: 'counts',
    align: 'center',
  },
]

const handleCancel = () => {
  statistics.value = [];
  parentFunc('update:open', false)
};
</script>