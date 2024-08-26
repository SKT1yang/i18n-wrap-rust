<!--
 * @Name: 资产清单行展开组件
 * @Description: Do not edit
-->
<template>
  <div v-for="networkAsset in props.networkAssetList" :networkAsset="networkAsset" :key="networkAsset.id">
    <span>{{ networkAsset.networkName }}</span>
    <Table :columns="columns" :data-source="networkAsset.assetList" :pagination="false">
    </Table>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { TableColumnsType } from "ant-design-vue"
import { Table } from "ant-design-vue";
import { INetwork } from '@guolisec/types';
import { t } from '@/languages/useLanguage'

const props = defineProps<{
  networkAssetList: INetwork[];
}>();

const columns = computed<TableColumnsType>(() => {
  return [
    { title: t("资产名称"), key: "name", dataIndex: "name", align: "center", ellipsis: true },
    { title: t("IP 地址"), key: "assetIp", dataIndex: "assetIp", align: "center", ellipsis: true },
    { title: t("MAC 地址"), key: "assetMac", dataIndex: "assetMac", align: "center", ellipsis: true },
    { title: t("资产类型"), key: "assetTypeName", dataIndex: "assetTypeName", align: "center", ellipsis: true }
  ]
})
</script>
