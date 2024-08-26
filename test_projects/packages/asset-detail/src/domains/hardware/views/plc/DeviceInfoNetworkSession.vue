<!--
 * @name: 罗克韦尔PLC 网络通信详情
 * @description: 罗克韦尔ControlLogix 5570系列，code：327938
-->

<template>
  <Card :title="t('网络通信详情')">
    <!-- 表格 -->
    <Table :data-source="dataList" :columns="columns" :pagination="{showTotal: (total)=> `共 ${total} 项`}">
    </Table>
  </Card>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PlcDeviceDetail, Communication } from '../../types/plc';
import type { PropType } from 'vue';
import type { ColumnProps } from "ant-design-vue/es/table";
/* 第三方模块 */
import { computed } from 'vue'
import {
  Table,
} from 'ant-design-vue';
/* 本地模块 */
import { t } from '@/entry/languages/useLanguage';
import Card from '@/shared/components/Card.vue';

/********************** 外部状态和配置 **********************/

const props = defineProps({
  rockWellDeviceInfo: {
    type: Object as PropType<PlcDeviceDetail>,
  }
})

/********************** 初始化状态 **********************/

const dataList = computed(() => {
  return props.rockWellDeviceInfo?.communication || []
})

/**
 * 获取表格列的配置描述
 */
const columns = computed<ColumnProps<Communication>[]>(() => {
  return [
    {
      title: t('状态'),
      dataIndex: "state",
      key: "state",
      ellipsis: true,
    },
    {
      title: t('本地 IP 地址'),
      dataIndex: "localAddress",
      key: "localAddress",
      ellipsis: true,
    },
    {
      title: t('本地端口'),
      dataIndex: "localPort",
      key: "localPort",
      ellipsis: true,
    },
    {
      title: t('远程 IP 地址'),
      dataIndex: "remoteAddress",
      key: "remoteAddress",
      ellipsis: true,
    },
    {
      title: t('远程端口'),
      dataIndex: "remotePort",
      key: "remotePort",
      ellipsis: true,
    },
  ]
});
</script>
