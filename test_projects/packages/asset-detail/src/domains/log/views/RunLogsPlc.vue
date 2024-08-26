<!--
 * @Name: 资产监测项-PLC
 * @Description: PLC各模块基本日志
-->

<template>
  <div class="max-h-[532px] overflow-auto" v-if="dataList.length">
    <div v-for="(obj, index) in dataList" :key="index" class="">
      <div class="flex mb-4 ">
        <div class="mr-4 w-[140px] flex-none">{{ obj.key }} </div>
        <span class="">{{ obj.value }}</span>
      </div>
    </div>

  </div>
  <Empty v-else style="padding-top: 20%" />
</template>

<script name="AssetVulList" lang="ts" setup>
import { Empty } from 'ant-design-vue'
import { ref, onMounted } from 'vue'
import { getPlcLogInfoApi } from '../model/log';
import { useAssetInfoStore } from '@/entry/store';

const { asset } = useAssetInfoStore()


const dataList = ref<any[]>([])
async function getData() {
  let { log } = await getPlcLogInfoApi({
    assetIp: asset.assetIp,
    assetMac: asset.assetMac,
  });
  dataList.value = log || []
}

onMounted(() => {
  getData()
})
</script>