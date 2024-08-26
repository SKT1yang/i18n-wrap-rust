<!--
 * @name: 罗克韦尔PLC 设备资源使用率
 * @description: 罗克韦尔ControlLogix 5570系列，code：327938
-->

<template>
  <Card :title="t('应用程序连接信息')">
    <!-- 表格 -->
    <Table :data-source="dataList" :columns="columns" :pagination="{showTotal: (total)=> `共 ${total} 项`}" :scroll="{x: 2000}">
    </Table>
  </Card>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PlcDeviceDetail, Application } from '../../types/plc';
import type { PropType } from 'vue';
import type { ColumnProps } from "ant-design-vue/es/table";
/* 第三方模块 */
import { computed } from 'vue'
import {
  Table,
} from 'ant-design-vue';
/* 本地模块 */
import { t } from '@/entry/languages/useLanguage';
import { emptyRender } from '@/shared/utils/format';
import Card from '@/shared/components/Card.vue';

/********************** 外部状态和配置 **********************/

const props = defineProps({
  rockWellDeviceInfo: {
    type: Object as PropType<PlcDeviceDetail>,
  }
})

/********************** 初始化状态 **********************/

const dataList = computed(() => {
  return props.rockWellDeviceInfo?.application || []
})


/**
 * 获取表格列的配置描述
 */
const columns = computed<ColumnProps<Application>[]>(() => {
  return [
    {
      title: t('类别'),
      dataIndex: "class",
      key: "class",
      ellipsis: true,
      width: 80,
      fixed: 'left'
    },
    {
      title: t('状态'),
      dataIndex: "state",
      key: "state",
      ellipsis: true,
      width: 100,
      fixed: 'left'
    },
    {
      title: t('时间'),
      dataIndex: "uptime",
      key: "uptime",
      ellipsis: true,
      width: 200,
      fixed: 'left'
    },
    {
      title: t('应用程序'),
      dataIndex: "appObject",
      key: "appObject",
      ellipsis: true,
      width: 200,
      fixed: 'left'
    },
    {
      title: t('本地发起'),
      dataIndex: "localOrig",
      key: "localOrig",
      ellipsis: true,
      width: 100,
    },
    {
      title: t('端口'),
      dataIndex: "portId",
      key: "portId",
      ellipsis: true,
      width: 100,
    },
    {
      title: t('连接地址'),
      dataIndex: "linkAddr",
      key: "linkAddr",
      ellipsis: true,
      width: 100,
      customRender(opt) {
        console.log(opt);
        return emptyRender(opt.value)
      },
    },
    {
      title: t('T-O 组播'),
      dataIndex: "toMcast",
      key: "toMcast",
      ellipsis: true,
      width: 100,
      customRender(opt) {
        console.log(opt);
        return emptyRender(opt.value)
      },
    },
    {
      title: t('丢包'),
      dataIndex: "missedRxPkts",
      key: "missedRxPkts",
      ellipsis: true,
      width: 100,
    },
    {
      title: t('O-T 大小'),
      dataIndex: "otSize",
      key: "otSize",
      ellipsis: true,
      width: 100,
    },
    {
      title: t('T-O 大小'),
      dataIndex: "toSize",
      key: "toSize",
      ellipsis: true,
      width: 100,
    },
    {
      title: t('O-T 类型'),
      dataIndex: "otType",
      key: "otType",
      ellipsis: true,
      width: 100,
    },
    {
      title: t('T-O 类型'),
      dataIndex: "toType",
      key: "toType",
      ellipsis: true,
      width: 100,
    },
    {
      title: t('O-T RPI（毫秒）'),
      dataIndex: "otRpiMsec",
      key: "otRpiMsec",
      ellipsis: true,
      align: 'right',
      width: 150,
    },
    {
      title: t('T-O API（毫秒）'),
      dataIndex: "toApiMsec",
      key: "toApiMsec",
      ellipsis: true,
      align: 'right',
      width: 150,
    },
    {
      title: t('超时（毫秒）'),
      dataIndex: "timeoutMsec",
      key: "timeoutMsec",
      ellipsis: true,
      align: 'right',
      width: 120,
    },
    {
      title: t('连接号'),
      dataIndex: "missedRxPkts",
      key: "missedRxPkts",
      ellipsis: true,
      align: 'right',
    },
  ]
});
</script>
