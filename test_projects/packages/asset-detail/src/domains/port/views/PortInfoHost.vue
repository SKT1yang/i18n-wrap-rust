<!--
 * @name: 主机端口信息
 * @description: 显示端口进程基本信息
-->
<template>
    <Card :title="t('端口信息')">
        <Table :data-source='tableData' :columns='columns' @change='handleTableChange'
            :pagination="{ total, current: page, pageSize: size, showTotal: (total) => `${t('共 {} 项', total)}`, showSizeChanger: true, }" />
    </Card>
</template>

<script lang="ts" setup>
import Card from '@/shared/components/Card.vue';
import { Table } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue';
import { t } from '@/entry/languages';
import { getAssetPortInfo, getAssetPortAggregation } from '../model/port'
import { useAssetInfoStore } from '@/entry/store';
import type { Port } from '../types/port'
import { formatToDateTime } from '@guolisec/utils';

const { asset } = useAssetInfoStore()

/**
 * 获取表格筛选数据
 */
const filterOptions = ref<{
    pid?: { text: number; value: number }[];
    port?: { text: number; value: number }[];
    protocol?: { text: string; value: string }[];
}>({})

async function getAssetPortAggregationData() {
    const res = await getAssetPortAggregation({ deviceIp: asset.assetIp, deviceMac: asset.assetMac })
    Object.keys(res).forEach(key => {
        filterOptions.value[key] = res[key].map(value => {
            return {
                value,
                text: value
            }
        })
    })
}


/**
 * 分页、排序
 */
const page = ref(1)
const size = ref(10)
const total = ref(0)
const sort = ref('')
const filter = ref<{ port?: number[]; protocol?: string[] }>({})

/**
 * 表格发生变化
 */
function handleTableChange(pagination, filters, sorter) {
    const { current, pageSize } = pagination
    page.value = current
    size.value = pageSize

    const { order, columnKey } = sorter
    switch (order) {
        case 'ascend':
            sort.value = `${columnKey},asc`
            break
        case 'descend':
            sort.value = `${columnKey},desc`
            break
        default:
            sort.value = ''
    }

    filter.value = filters

    getAssetPortInfoData()
}

const columns = computed(() => {
    return [
        {
            title: t('进程名称'),
            width: 240,
            dataIndex: 'processName',
            ellipsis: true,
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('进程 ID'),
            width: 180,
            dataIndex: 'pid',
            key: 'pid',
            ellipsis: true,
            sorter: true,
            customRender({ text }) {
                return typeof text === 'number' ? text : '-'
            }
        },
        {
            title: t('协议'),
            width: 180,
            dataIndex: 'protocol',
            ellipsis: true,
            filters: filterOptions.value?.protocol,
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('端口'),
            width: 180,
            dataIndex: 'port',
            ellipsis: true,
            filters: filterOptions.value?.port,
            customRender({ text }) {
                return typeof text === 'number' ? text : '-'
            }
        },
        {
            title: t('进程路径'),
            dataIndex: 'path',
            ellipsis: true,
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('创建时间'),
            width: 240,
            dataIndex: 'createTime',
            key: 'createTime',
            ellipsis: true,
            sorter: true,
            customRender({ text }) {
                return text ? formatToDateTime(text) : '-'
            }
        },
    ]
})

/**
 * 获取表格数据
 */
const tableData = ref<Port[]>([])

async function getAssetPortInfoData() {
    const { port, protocol } = filter.value
    const { content, totalElements } = await getAssetPortInfo({
        deviceIp: asset.assetIp, deviceMac: asset.assetMac, page: page.value, size: size.value, sort: sort.value,
        ports: port, protocols: protocol
    })
    tableData.value = content
    total.value = totalElements

}


onMounted(() => {
    getAssetPortInfoData()
    getAssetPortAggregationData()
})
</script>