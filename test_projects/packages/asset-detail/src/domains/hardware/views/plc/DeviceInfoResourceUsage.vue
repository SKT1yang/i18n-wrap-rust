<!--
 * @name: 罗克韦尔PLC 设备资源使用率
 * @description: 罗克韦尔ControlLogix 5570系列，code：327938
-->

<template>
  <Card :title="t('设备资源使用')">
    <div class="flex gap-6">
      <div class="flex-1 flex flex-col gap-y-6">
        <DescribptionTable :data-list="cpuInfoList" :header-title="t('模块资源使用率（所有端口）')" />
        <DescribptionTable :data-list="cipInfoConfigList" :header-title="t('CIP 连接统计（所有端口）')" />
        <DescribptionTable :data-list="tcpInfoList" :header-title="t('TCP 连接（EtherNet/IP 端口）')" />
      </div>
      <div class="flex-1 flex flex-col gap-y-6">
        <DescribptionTable :data-list="hmiInfoList" :header-title="t('HMI/MSG 未连接（EtherNet/IP 端口）')" />
        <DescribptionTable :data-list="hmiConnectionList" :header-title="t('HMI/MSG 已连接（EtherNet/IP 端口）')" />
      </div>
      <div class="flex-1 flex flex-col gap-y-6">
        <DescribptionTable :data-list="ioRateList" :header-title="t('输入/输出及生产/消费每秒数据包数（EtherNet/IP 端口）')" />
        <DescribptionTable :data-list="ioPacketList" :header-title="t('输入/输出及生产/消费数据包数（EtherNet/IP 端口）')" />
      </div>
    </div>
  </Card>
</template>

<script lang="ts" setup>
/* 类型文件 */
import type { PropType } from 'vue';
import type { PlcDeviceDetail } from '../../types/plc';
/* 第三方模块 */
import { computed } from 'vue';
/* 本地模块 */
import Card from '@/shared/components/Card.vue';
import { t } from '@/entry/languages/useLanguage';
import DescribptionTable from './DescribptionTable.vue';

const props = defineProps({
  rockWellDeviceInfo: {
    type: Object as PropType<PlcDeviceDetail>,
  }
})

// 模块资源使用率（所有端口）
const cpuInfoList = computed(() => {
  const cpuInfo = props.rockWellDeviceInfo?.cpuInfo ?? {
    cpu: '',
    ioCommsUtilizationActual: '',
    ioCommsUtilizationTheoretical: '',
    tableName: 'Module Resource Utilization (All Ports)',
  }
  return [
    ['cpu', cpuInfo.cpu],
    ['ioCommsUtilizationActual', cpuInfo.ioCommsUtilizationActual],
    ['ioCommsUtilizationTheoretical', cpuInfo.ioCommsUtilizationTheoretical],
  ]
})

// CIP 连接统计（所有端口）
const cipInfoConfigList = computed(() => {
  const cipInfo = props.rockWellDeviceInfo?.cipInfo ?? {
    activeIo: '',
    activeMessaging: '',
    activeTotal: '',
    maximumTotalObserved: '',
    maximumTotalSupported: '',
    tableName: 'CIP Connection Statistics (All Ports)',
  }
  return [
    ['Active Total', cipInfo.activeTotal],
    ['Active Messaging', cipInfo.activeMessaging],
    ['Active I/O', cipInfo.activeIo],
    ['Maximum Total Observed', cipInfo.maximumTotalObserved],
    ['Maximum Total Supported', cipInfo.maximumTotalSupported],
  ]
})

// TCP 连接（EtherNet/IP端口）
const tcpInfoList = computed(() => {
  const tcpInfo = props.rockWellDeviceInfo?.tcpInfo ?? {
    active: '',
    maximumObserved: '',
    maximumSupported: '',
    tableName: 'TCP Connections (EtherNet/IP Port)',
  }
  return [
    ['Active', tcpInfo.active],
    ['Maximum Observed', tcpInfo.maximumObserved],
    ['Maximum Supported', tcpInfo.maximumSupported],
  ]
})

// HMI/MSG 未连接（EtherNet/IP端口）
const hmiInfoList = computed(() => {
  const hmiInfo = props.rockWellDeviceInfo?.hmiInfo ?? {
    receivedPacketCount: '',
    receivedPacketsPerSecond: '',
    sentPacketCount: '',
    sentPacketsPerSecond: '',
    tableName: 'HMI/MSG Unconnected (EtherNet/IP Port)',
  }
  return [
    ['Sent Packets Per Second', hmiInfo.sentPacketsPerSecond],
    ['Received Packets Per Second', hmiInfo.receivedPacketsPerSecond],
    ['Sent Packet Count', hmiInfo.sentPacketCount],
    ['Received Packet Count', hmiInfo.receivedPacketCount],
  ]
})

// HMI/MSG 已连接（EtherNet/IP端口）
const hmiConnectionList = computed(() => {
  const hmiConnection = props.rockWellDeviceInfo?.hmiConnection ?? {
    receivedBytesPerSecond: '',
    receivedPacketCount: '',
    receivedPacketsPerSecond: '',
    sentBytesPerSecond: '',
    sentPacketCount: '',
    sentPacketsPerSecond: '',
    tableName: 'HMI/MSG Connected (EtherNet/IP Port)',
  }
  return [
    ['Sent Packets Per Second', hmiConnection.sentPacketsPerSecond],
    ['Received Packets Per Second', hmiConnection.receivedPacketsPerSecond],
    ['Sent Bytes Per Second', hmiConnection.sentBytesPerSecond],
    ['Received Bytes Per Second', hmiConnection.receivedBytesPerSecond],
    ['Sent Packet Count', hmiConnection.sentPacketCount],
    ['Received Packet Count', hmiConnection.receivedPacketCount],
  ]
})

// 输入输出及生产/消费每秒数据包数（EtherNet/IP端口）
const ioRateList = computed(() => {
  const ioRate = props.rockWellDeviceInfo?.ioRate ?? {
    received: '',
    sent: '',
    tableName: 'I/O and Prod/Cons Packets Per Second (EtherNet/IP Port)',
    total: '',
  }
  return [
    ['total', ioRate.total],
    ['sent', ioRate.sent],
    ['received', ioRate.received],
  ]
})

// 输入输出及生产/消费数据包数（EtherNet/IP端口）
const ioPacketList = computed(() => {
  const ioPacket = props.rockWellDeviceInfo?.ioPacket ?? {
    missed: '',
    received: '',
    rejected: '',
    sent: '',
    tableName: 'I/O and Prod/Cons Packet Counts (EtherNet/IP Port)',
    total: '',
  }
  return [
    ['total', ioPacket.total],
    ['sent', ioPacket.sent],
    ['received', ioPacket.received],
    ['rejected', ioPacket.rejected],
    ['missed', ioPacket.missed],
  ]
})
</script>
