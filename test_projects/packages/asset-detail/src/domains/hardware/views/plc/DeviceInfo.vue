<!--
 * @name: 罗克韦尔PLC 设备详情
 * @description: 罗克韦尔ControlLogix 5570系列，code：327938
-->

<template>
  <div class="flex flex-col gap-y-4">
    <DeviceInfoNetworkCard :rock-well-device-info="plcDeviceDetail" />
    <DeviceInfoResourceUsage :rock-well-device-info="plcDeviceDetail" />
    <DeviceInfoApplication :rock-well-device-info="plcDeviceDetail" />
    <DeviceInfoNetworkSession :rock-well-device-info="plcDeviceDetail" />
  </div>
</template>

<script lang='ts' setup>
/* 类型文件 */
import type { PlcDeviceDetail } from "../../types/plc";
/* 第三方模块 */
import { onMounted, ref } from 'vue';
/* 组件 */
import DeviceInfoNetworkCard from './DeviceInfoNetworkCard.vue';
import DeviceInfoResourceUsage from './DeviceInfoResourceUsage.vue';
import DeviceInfoApplication from './DeviceInfoApplication.vue'
import DeviceInfoNetworkSession from './DeviceInfoNetworkSession.vue';
/* 本地模块 */
import { getPlcDeviceDetailApi } from '../../model/plc';
import { useAssetInfoStore } from '@/entry/store';


const { asset } = useAssetInfoStore()

const plcDeviceDetail = ref<PlcDeviceDetail>()

/**
 * 获取数据
 */

async function getAssetDetailOther() {
  const { assetDetailOtherVO } = await getPlcDeviceDetailApi({ deviceIp: asset.assetIp, deviceMac: asset.assetMac })
  plcDeviceDetail.value = assetDetailOtherVO
}

onMounted(() => {
  getAssetDetailOther()
})
</script>