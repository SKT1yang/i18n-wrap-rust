<!--
 * @Name: 端口状态-交换机
 * @Description: Do not edit
-->

<template>
  <div class="max-h-125 overflow-auto">
    <Table :data-source="dataList" :columns="switchColumns" row-key="id" bordered :pagination="false" :loading="loading"
      size="small">
    </Table>
  </div>
</template>

<script lang="ts" setup>
/* 类型文件 */
import type { PortInfo } from '../types/port';
/* 第三方模块 */
import { ref, watch } from 'vue'
import { Table } from 'ant-design-vue';
import { onMountedOrActivated } from '@guolisec/utils';
/* 本地模块 */
import { useAssetInfoStore } from '@/entry/store';
import { switchColumns } from './port.data';
import { getSwitchInfoApi } from '@/domains/port/model/switch';

const { asset } = useAssetInfoStore()

const props = defineProps({
  switchInfo: {
    type: Object,
    default() {
      return {};
    },
  },
});

watch(
  () => props.switchInfo,
  () => {
    getData();
  },
  {
    deep: true,
  },
);

const dataList = ref<PortInfo[]>([])
const loading = ref(false)

async function getData() {
  const { switchInfoVO } = await getSwitchInfoApi({
    assetIp: asset.assetIp,
    assetMac: asset.assetMac
  })
  dataList.value = switchInfoVO.portInfo
}

onMountedOrActivated(() => {
  getData()
})
</script>