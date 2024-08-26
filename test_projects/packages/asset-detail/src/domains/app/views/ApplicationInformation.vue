<!--
 * @name: 应用软件
 * @description: 设备安装的软件应用的基本信息：应用名称、应用版本、发布者、安装位置和安装时间
-->
<template>
    <Card :title="t('应用软件')">
        <Table :data-source='tableData' row-key='id' :columns='columns' @change='handleTableChange'
            :scroll="{ x: 1140 }"
            :pagination="{ total, current: page, pageSize: size, showTotal: (total) => `${t('共 {} 项', total)}`, showSizeChanger: true, }" />
    </Card>
</template>

<script lang="ts" setup>
import Card from '@/shared/components/Card.vue';
import { Table } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue';
import { t } from '@/entry/languages';
import { getAssetAppInfo, getAssetAppAggregation } from '../model'
import { useAssetInfoStore } from '@/entry/store';
import type { Application } from '../types'

const { asset } = useAssetInfoStore()

/**
 * 获取表格筛选数据
 */
const filterOptions = ref<{
    appName?: { text: string; value: string }[];
    manufacture?: { text: string; value: string }[];
}>({})

async function getAssetAppAggregationData() {
    const res = await getAssetAppAggregation({ deviceIp: asset.assetIp, deviceMac: asset.assetMac })
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
const filter = ref<{ appName?: string[]; manufacture?: string[] }>({})

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

    getAssetAppInfoData()
}

const columns = computed(() => {
    return [{
        title: t('应用名称'),
        width: 300,
        dataIndex: 'appName',
        ellipsis: true,
        filters: filterOptions.value?.appName,
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('应用版本'),
        width: 180,
        dataIndex: 'appVersion',
        ellipsis: true,
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('发布者'),
        width: 180,
        dataIndex: 'manufacture',
        key: 'manufacture',
        ellipsis: true,
        filters: filterOptions.value?.manufacture,
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('安装位置'),
        width: 240,
        dataIndex: 'installPath',
        ellipsis: true,
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('安装时间'),
        width: 240,
        dataIndex: 'installTime',
        key: 'installTime',
        ellipsis: true,
        sorter: true,
        customRender({ text }) {
            return text || '-'
        }
    },
    ]
})

/**
 * 获取表格数据
 */
const tableData = ref<Application[]>([])

async function getAssetAppInfoData() {
    const { appName, manufacture } = filter.value
    const { content, totalElements } = await getAssetAppInfo({
        deviceIp: asset.assetIp, deviceMac: asset.assetMac, page: page.value, size: size.value, sort: sort.value,
        appNames: appName, manufactures: manufacture
    })
    tableData.value = content
    total.value = totalElements

}

onMounted(() => {
    getAssetAppInfoData()
    getAssetAppAggregationData()
})
</script>