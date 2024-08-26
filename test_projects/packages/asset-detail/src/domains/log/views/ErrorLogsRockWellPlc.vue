<!--
 * @name: 罗克韦尔PLC 故障日志
 * @description: 罗克韦尔ControlLogix 5570系列，code：327938
-->

<template>
    <Card :title="t('故障日志')">
        <!-- 表格 -->
        <Table :data-source="dataList" :columns="columns" :pagination="{ showTotal: (total) => `共 ${total} 项` }">
        </Table>
    </Card>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { EventLog } from '@/domains/hardware/types/plc';
import type { ColumnProps } from "ant-design-vue/es/table";
/* 第三方模块 */
import { computed, onMounted, ref } from 'vue'
import {
    Table,
} from 'ant-design-vue';
/* 本地模块 */
import { t } from '@/entry/languages/useLanguage';
import { getPlcDeviceDetailApi } from '@/domains/hardware/model/plc';
import { useAssetInfoStore } from '@/entry/store';
import Card from '@/shared/components/Card.vue';

/********************** 外部状态和配置 **********************/

const { asset } = useAssetInfoStore()

/********************** 初始化状态 **********************/

const dataList = ref<EventLog[]>([])

/**
 * 获取表格列的配置描述
 */
const columns = computed<ColumnProps<EventLog>[]>(() => {
    return [
        {
            title: t('事件'),
            dataIndex: "event",
            key: "event",
            ellipsis: true,
        },
        {
            title: t('编号'),
            dataIndex: "number",
            key: "number",
            ellipsis: true,
            width: 120
        },
        {
            title: t('文件'),
            dataIndex: "file",
            key: "file",
            ellipsis: true,
        },
        {
            title: t('行数'),
            dataIndex: "line",
            key: "line",
            ellipsis: true,
            width: 160
        },
        {
            title: t('时间'),
            dataIndex: "time",
            key: "time",
            ellipsis: true,
            width: 240
        },
        {
            title: t('P1'),
            dataIndex: "p1",
            key: "p1",
            ellipsis: true,
            width: 100
        },
        {
            title: t('P2'),
            dataIndex: "p2",
            key: "p2",
            ellipsis: true,
            width: 200
        },
    ]
});

/**
 * 获取数据
 */

async function getAssetDetailOther() {
    const { assetDetailOtherVO } = await getPlcDeviceDetailApi({ deviceIp: asset.assetIp, deviceMac: asset.assetMac })
    dataList.value = assetDetailOtherVO?.eventLog || []
}

onMounted(() => {
    getAssetDetailOther()
})
</script>
