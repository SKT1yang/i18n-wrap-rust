<!--
 * @Name: 端口信息-交换机
 * @Description: Do not edit
-->

<template>
    <Card :title="t('端口信息')" class="min-h-190">
        <Table :columns="columns" :data-source="tableData" row-key="id" :pagination="false" :scroll="{ x: 1560 }">

            <template #bodyCell="{ column, text }">
                <template v-if="column.key === 'status'">
                    <Tag :color="text === 'up' ? 'green' : 'volcano'"> {{ text === 'up' ? 'UP' : 'DOWN' }}</Tag>
                </template>
            </template>
        </Table>
    </Card>
</template>

<script lang="ts" setup>
import type { PortInfo } from '../types/port';
import Card from '@/shared/components/Card.vue'
import { Table, Tag } from 'ant-design-vue';
import { t } from '@/entry/languages/useLanguage';
import type { ColumnsType } from 'ant-design-vue/es/table/interface'
import { ref, onMounted } from 'vue';
import { getSwitchInfoApi } from '@/domains/port/model/switch';
import { useAssetInfoStore } from '@/entry/store';

const { asset } = useAssetInfoStore()

const columns = ref<ColumnsType>([
    {
        title: t('端口'),
        key: 'port',
        dataIndex: 'port',
        ellipsis: true,
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('类型'),
        key: 'portType',
        dataIndex: 'portType',
        ellipsis: true,
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('MAC 地址'),
        width: 160,
        key: 'portMac',
        dataIndex: 'portMac',
        ellipsis: true,
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('状态'),
        width: 120,
        key: 'status',
        dataIndex: 'status',
        filters: [
            {
                text: 'UP', value: 'up'
            },
            {
                text: 'DOWN', value: 'down'
            },
        ],
        onFilter: (value, record: PortInfo) => record.status === value,
    },
    {
        title: t('描述'),
        key: 'description',
        dataIndex: 'description',
        ellipsis: true,
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('带宽（Mbps）'),
        width: 150,
        sorter: (a, b) => a.portSpeed - b.portSpeed,
        dataIndex: 'portSpeed',
        align: 'right',
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('丢包率'),
        width: 100,
        dataIndex: 'portDiscard',
        sorter: (a, b) => a.portDiscard - b.portDiscard,
        align: 'right',
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('接收带宽利用率'),
        width: 150,
        dataIndex: 'portInUti',
        sorter: (a, b) => a.portInUti - b.portInUti,
        align: 'right',
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('发送带宽利用率'),
        width: 150,
        dataIndex: 'portOutUti',
        sorter: (a, b) => a.portOutUti - b.portOutUti,
        align: 'right',
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('上行速率（Bps）'),
        width: 160,
        dataIndex: 'portUpSpeed',
        sorter: (a, b) => a.portUpSpeed - b.portUpSpeed,
        align: 'right',
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('下行速率（Bps）'),
        width: 160,
        dataIndex: 'portDownSpeed',
        sorter: (a, b) => a.portDownSpeed - b.portDownSpeed,
        align: 'right',
        customRender({ text }) {
            return text || '-'
        }
    },
])



const tableData = ref<PortInfo[]>([])
async function getData() {
    const { switchInfoVO } = await getSwitchInfoApi({
        assetIp: asset.assetIp,
        assetMac: asset.assetMac
    })
    tableData.value = switchInfoVO.portInfo
}

onMounted(() => {
    getData()
})
</script>