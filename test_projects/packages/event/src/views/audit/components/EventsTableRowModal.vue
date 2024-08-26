<!--
 * @name: 工控事件弹窗
 * @author: bwb
 * @description: 详情弹窗
 * @path: \event\lib\views\audit\components\EventTableRowModal.vue
-->
<template>
  <Modal :open="open" title="详情" :min-height="50" :mask-closable="true" :can-fullscreen="false"
    @cancel="parentFunc('update:open', false)" :width="1000" :show-ok-btn="false">
    <div class="make-twoline">
      <div v-for="(item, index) in EventDetailSchema" :key="index" class="m-t-2">
        {{ item.label }} : {{ record[item.field] ?? '-' }}</div>
    </div>
    <template #footer>
      <Button @click="parentFunc('update:open', false)">取消</Button>
    </template>
  </Modal>
</template>

<script setup name="EventsTableRowModal" lang="ts">
import { Modal, Button } from "ant-design-vue"
import { reactive, watch } from "vue";
import { Asset } from "../type/class";
import { IAsset } from "../type";

const parentProp = defineProps<{ open: boolean, record: any }>()
const parentFunc = defineEmits(['update:open'])
const EventDetailSchema = [
  {
    field: 'sn',
    label: 'SN',
  },
  {
    field: 'eventId',
    label: '事件ID',
  },
  {
    field: 'deviceName',
    label: '设备名称',
  },
  {
    field: 'logSourceTypeName',
    label: '日志源类型',
  },
  {
    field: 'logSourceIp',
    label: '日志源IP',
  },
  {
    field: 'networkInterface',
    label: '网口',
  },
  {
    field: 'srcIp',
    label: '源IP',
  },
  {
    field: 'srcMac',
    label: '源MAC',
  },
  {
    field: 'srcPort',
    label: '源端口',
  },
  {
    field: 'dstIp',
    label: '目的IP',
  },
  {
    field: 'dstMac',
    label: '目的MAC',
  },
  {
    field: 'dstPort',
    label: '目的端口',
  },
];

const state = reactive<any>({
  descData: {},
});
let asset = reactive<IAsset>(new Asset());

watch(() => parentProp.open, () => {
  if (parentProp.open) {
    state.descData = parentProp.record
    Object.assign(asset, state.descData)
  }
})
</script>

<style scoped>
.make-twoline {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
