<!--
 * @name: 罗克韦尔PLC 以太网(网卡)配置信息
 * @description: 罗克韦尔ControlLogix 5570系列，code：327938
-->

<template>
  <Card :title="t('以太网配置信息')">
    <div class="flex gap-6">
      <div class="flex-1 flex flex-col gap-y-6">
        <DescribptionTable :data-list="networkConfigList" :header-title="t('网络接口')" />
        <DescribptionTable :data-list="interfaceConfigList" :header-title="t('以太网接口配置')" />
      </div>
      <div class="flex-1 flex flex-col gap-y-6">
        <DescribptionTable :data-list="linkInfoList" :header-title="t('以太网连接')" />
        <DescribptionTable :data-list="interfaceCountersList" :header-title="t('接口计数器')" />
      </div>
      <div class="flex-1 flex flex-col gap-y-6">
        <DescribptionTable :data-list="transCountersList" :header-title="t('媒体计算器')" />
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

// 网络接口
const networkConfigList = computed(() => {
  const networkConfig = props.rockWellDeviceInfo?.networkConfig ?? {
    defaultDomainName: '',
    defaultGateway: '',
    ethernetAddressMac: '',
    hostName: '',
    ipAddress: '',
    nameResolution: '',
    primaryNameServer: '',
    secondaryNameServer: '',
    smtpServer: '',
    subnetMask: '',
    tableName: 'Network Interface',
  }
  return [
    ['Ethernet Address (Mac)', networkConfig.ethernetAddressMac],
    ['ipAddress', networkConfig.ipAddress],
    ['subnetMask', networkConfig.subnetMask],
    ['defaultGateway', networkConfig.defaultGateway],
    ['primaryNameServer', networkConfig.primaryNameServer],
    ['secondaryNameServer', networkConfig.secondaryNameServer],
    ['defaultDomainName', networkConfig.defaultDomainName],
    ['hostName', networkConfig.hostName],
    ['nameResolution', networkConfig.nameResolution],
    ['smtpServer', networkConfig.smtpServer],
  ]
})

// 以太网接口配置
const interfaceConfigList = computed(() => {
  const interfaceConfig = props.rockWellDeviceInfo?.interfaceConfig ?? {
    obtainNetworkConfiguration: '',
    switches: '',
    tableName: 'Ethernet Interface Configuration',
  }
  return [
    ['Obtain Network Configuration', interfaceConfig.obtainNetworkConfiguration],
    ['Switches', interfaceConfig.switches],
  ]
})

// 以太网连接
const linkInfoList = computed(() => {
  const linkInfo = props.rockWellDeviceInfo?.linkInfo ?? {
    autonegotiateStatus: '',
    duplex: '',
    speed: '',
    tableName: 'Ethernet Link',
  }
  return [
    ['Speed', linkInfo.speed],
    ['Duplex', linkInfo.duplex],
    ['Autonegotiate Status', linkInfo.autonegotiateStatus],
  ]
})

// 接口计数器
const interfaceCountersList = computed(() => {
  const interfaceCounters = props.rockWellDeviceInfo?.interfaceCounters ?? {
    inDiscards: '',
    inErrors: '',
    inNucastPackets: '',
    inOctets: '',
    inUcastPackets: '',
    inUnknownProtos: '',
    outDiscards: '',
    outErrors: '0',
    outNucastPackets: '',
    outOctets: '',
    outUcastPackets: '',
    tableName: 'Interface Counters',
  }
  return [
    ['In Octets', interfaceCounters.inOctets],
    ['In Ucast Packets', interfaceCounters.inUcastPackets],
    ['In Nucast Packets', interfaceCounters.inNucastPackets],
    ['In Discards', interfaceCounters.inDiscards],
    ['In Errors', interfaceCounters.inErrors],
    ['In Unknown Protos', interfaceCounters.inUnknownProtos],
    ['Out Octets', interfaceCounters.outOctets],
    ['Out Ucast Packets', interfaceCounters.outUcastPackets],
    ['Out Nucast Packets', interfaceCounters.outNucastPackets],
    ['Out Discards', interfaceCounters.outDiscards],
    ['Out Errors', interfaceCounters.outErrors],
  ]
})

// 媒体计算器
const transCountersList = computed(() => {
  const transCounters = props.rockWellDeviceInfo?.transCounters ?? {
    alignmentErrors: '',
    carrierSenseErrors: '',
    deferredTransmissions: '',
    excessiveCollisions: '',
    fcsErrors: '',
    frameTooLong: '',
    lateCollisions: '',
    macReceiveErrors: '',
    macTransmitErrors: '',
    multipleCollisions: '',
    singleCollisions: '',
    sqeTestErrors: '',
    tableName: 'Media Counters',
  }
  return [
    ['Alignment Errors', transCounters.alignmentErrors],
    ['Fcs Errors', transCounters.fcsErrors],
    ['Single Collisions', transCounters.singleCollisions],
    ['Multiple Collisions', transCounters.multipleCollisions],
    ['Sqe Test Errors', transCounters.sqeTestErrors],
    ['Deferred Transmissions', transCounters.deferredTransmissions],
    ['Late Collisions', transCounters.lateCollisions],
    ['Excessive Collisions', transCounters.excessiveCollisions],
    ['Mac Transmit Errors', transCounters.macTransmitErrors],
    ['Carrier Sense Errors', transCounters.carrierSenseErrors],
    ['Frame TooLong', transCounters.frameTooLong],
    ['Mac Receive Errors', transCounters.macReceiveErrors],
  ]
})
</script>
