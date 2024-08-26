<!--
 * @Name: 迁移时未使用
 * @Description: 迁移时未使用
 * @Author: bwb
-->
<template>
  <div class="mb-16">
    <div class="text-white text-base my-2">区域流量基线</div>
    <Form layout="inline" :model="trendParams">
      <FormItem>
        <Select v-model:value="trendParams.sn" placeholder="请选择设备" @change="handleAssetsSN" style="width: 200px"
          size="small">
          <SelectOption v-for="item in snList" :value="item.sn" :key="item.sn">
            {{ item.key }}
          </SelectOption>
        </Select>
      </FormItem>
      <FormItem>
        <Select v-model:value="trendParams.networkInterface" placeholder="请选择网卡" @change="handleAssetsNetworkInterface"
          style="width: 200px" size="small">
          <SelectOption v-for="item in networkInterfaces" :value="item.interfaceName"
            :key="item.interfaceName + (item.remark === '' ? '' : '(' + item.remark + ')')">
            {{ item.interfaceName + (item.remark === '' ? '' : '(' + item.remark + ')') }}
          </SelectOption>
        </Select>
      </FormItem>
    </Form>

    <AreaFlowBaseLineChart :params="trendParams" :flow-name="'trend'" />
  </div>
  <div class="mb-16">
    <div class="text-white text-base my-2">资产流量基线</div>
    <AssetFlowBaseLineChart :params="assetParams" :flow-name="'asset'" />
  </div>
  <div class="">
    <div class="text-white text-base my-2">协议流量基线</div>
    <Form layout="inline" :model="protocolParams">
      <FormItem>
        <Select v-model:value="protocolParams.applayerProtocolName" placeholder="请选择协议" style="width: 200px" size="small">
          <SelectOption v-for="item in protocolList" :value="item" :key="item">
            {{ item }}
          </SelectOption>
        </Select>
      </FormItem>
    </Form>

    <ProtocolFlowBaseLineChart :params="protocolParams" :flow-name="'protocol'" />
  </div>
</template>
<script setup name="FlowBaseLine" lang="ts">
import { Form, FormItem, Select, SelectOption } from 'ant-design-vue';
import dayjs from 'dayjs';
import {
  getNetworkCardByTimeApi,
  getLargestTrafficDeviceApi,
  getTopProtocolOfTrafficApi
} from '../../../model/flow';
import { defineAsyncComponent, onMounted, reactive, ref } from 'vue';

const trendParams = reactive<{
  sn: any,
  ip: any,
  networkInterface: any,
  createTime: [string, string]
}>({
  sn: undefined,
  ip: undefined,
  networkInterface: undefined,
  createTime: [dayjs().startOf('day').toISOString(), dayjs().endOf('day').toISOString()],
});
const assetParams = reactive({
  sn: undefined,
  ip: undefined,
  networkInterface: undefined,
  createTime: [dayjs().startOf('day').toISOString(), dayjs().endOf('day').toISOString()],
});
const protocolParams = reactive({
  applayerProtocolName: undefined,
  createTime: [dayjs().startOf('day').toISOString(), dayjs().endOf('day').toISOString()],
});

let snList = ref<
  {
    key: string;
    value: { interfaceName: string; remark: string }[];
    sn: string;
  }[]
>([]); // 设备列表
let networkInterfaces = ref<{ interfaceName: string; remark: string }[]>([]); // 网卡列表
let protocolList = ref<any[]>([]);

onMounted(() => {
  getNetworkCardByTime();
  getProtocolList();
  // getData();
});

// 按时间获取设备及对应网卡
const getNetworkCardByTime = () => {
  let start = dayjs().startOf('month').toISOString();
  let end = dayjs().endOf('month').toISOString();
  getNetworkCardByTimeApi({
    createTime: [start, end],
  }).then((res) => {
    snList.value = res;
    getLargestTrafficDevice();
  });
};

// 按时间获取设备及对应网卡
const getProtocolList = () => {
  getTopProtocolOfTrafficApi({}).then((res) => {
    protocolList.value = Object.keys(res);
    protocolParams.applayerProtocolName = protocolList.value[0] ? protocolList.value[0] : '';
    ProtocolFlowBaseLineChart.value = defineAsyncComponent(
      () => import('./FlowBaseLineChart.vue'),
    );
  });
};

// 区域流量基线
const AreaFlowBaseLineChart = ref<any>(undefined);
// 资产流量基线
const AssetFlowBaseLineChart = ref<any>(undefined);
// 协议流量基线
const ProtocolFlowBaseLineChart = ref<any>(undefined);

// 获取流量最大设备
const getLargestTrafficDevice = () => {
  let start = dayjs().startOf('month').toISOString();
  let end = dayjs().endOf('month').toISOString();
  getLargestTrafficDeviceApi({
    createTime: [start, end],
  }).then((res) => {
    trendParams.sn = res.assetName;
    handleAssetsSN(res.sn);
    trendParams.networkInterface = res.networkInterface;
    AreaFlowBaseLineChart.value = defineAsyncComponent(() => import('./FlowBaseLineChart.vue'));
  });
};

// 选择设备
const handleAssetsSN = (sn) => {
  snList.value.forEach((item) => {
    if (item.sn === sn) {
      trendParams.sn = item.sn;
      trendParams.ip = item.key;
      networkInterfaces.value = item.value;
      trendParams.networkInterface = undefined;
    }
  });
};

// 选择网卡
const handleAssetsNetworkInterface = (networkInterface) => {
  trendParams.networkInterface = networkInterface;
};
</script>
<style scoped>
.flowChart {
  width: 100%;
  height: 200px;
}
</style>
