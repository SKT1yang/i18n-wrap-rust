<template>
    <Form layout="inline" class="mb-4">
        <FormItem>
            <Input allow-clear :placeholder="t('本地 IP 地址')" style="width: 200px" v-model:value="queryForm.localIp" />
        </FormItem>
        <FormItem>
            <Input allow-clear :placeholder="t('本地端口')" style="width: 200px" v-model:value="queryForm.localPort" />
        </FormItem>
        <FormItem>
            <Input allow-clear :placeholder="t('远程 IP 地址')" style="width: 200px" v-model:value="queryForm.remoteIp" />
        </FormItem>
        <FormItem>
            <Input allow-clear :placeholder="t('远程端口')" style="width: 200px" v-model:value="queryForm.remotePort" />
        </FormItem>
        <FormItem>
            <Button @click="handleSearch">{{ t('查询') }}</Button>
        </FormItem>
    </Form>

    <Table :data-source="tableData" :columns="columns" @change="handleTableChange" class="mt-4 min-h-120"
        :scroll="{ x: 1500 }"
        :pagination="{ total, current: page, pageSize: size, showTotal: (total) => `${t('共 {} 项', total)}`, showSizeChanger: false, }" />
</template>

<script lang="ts" setup>

import { Form, FormItem, Input, Button, Table } from 'ant-design-vue';
import { t } from '@/entry/languages/useLanguage';
import { computed, onMounted, ref } from 'vue';
import { useAssetInfoStore } from '@/entry/store';
import { getAssetCommunicationInfo, getAssetCommunicationAggregation } from '../../model/internetworking'
import type { AssetCommunication } from '../../types/internetworking'

const { asset } = useAssetInfoStore()

/**
 * 获取表格筛选数据
 */
const filterOptions = ref<{
    programName?: { text: string; value: string }[];
    state?: { text: string; value: string }[];
    protocol?: { text: string; value: string }[];
}>({})

async function getAssetCommunicationAggregationData() {
    const res = await getAssetCommunicationAggregation({ pidNot: 0, deviceIp: asset.assetIp, deviceMac: asset.assetMac })
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
 * 查询表单
 */
const queryForm = ref<{
    localIp?: string;
    localPort?: string;
    remoteIp?: string
    remotePort?: string
}>({})

/**
 * 分页、排序
 */
const page = ref(1)
const size = ref(10)
const total = ref(0)

const sort = ref('')

const filter = ref<{ programName?: string[]; state?: string[]; protocol?: string[] }>({})

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

    console.log(filters)
    getAssetCommunicationInfoData()
}

/**
  * 故障日志数据
 */

const columns = computed(() => {

    return [{
        title: t('协议'),
        width: 200,
        dataIndex: 'protocol',
        ellipsis: true,
        filters: filterOptions.value?.protocol,
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('本地 IP 地址'),
        width: 200,
        ellipsis: true,
        dataIndex: 'localIp',
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('本地端口'),
        width: 160,
        ellipsis: true,
        dataIndex: 'localPort',
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('远程 IP 地址'),
        dataIndex: 'remoteIp',
        width: 200,
        ellipsis: true,
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('远程端口'),
        dataIndex: 'remotePort',
        ellipsis: true,
        width: 160,
        customRender({ text }) {
            return typeof text === 'number' ? text : '-'
        }
    },
    {
        title: t('状态'),
        dataIndex: 'state',
        ellipsis: true,
        width: 200,
        filters: filterOptions.value?.state,
        customRender({ text }) {
            return text || '-'
        }
    },
    {
        title: t('进程 ID'),
        width: 160,
        dataIndex: 'pid',
        key: 'pid',
        sorter: true,
        ellipsis: true,
        customRender({ text }) {
            return typeof text === 'number' ? text : '-'
        }
    },
    {
        title: t('进程名称'),
        width: 200,
        dataIndex: 'programName',
        key: 'programName',
        ellipsis: true,
        filters: filterOptions.value?.programName,
        customRender({ text }) {
            return text || '-'
        }
    },
    ]
})

const tableData = ref<AssetCommunication[]>([])

async function getAssetCommunicationInfoData() {
    const { localIp, localPort, remoteIp, remotePort } = queryForm.value
    const { programName, state, protocol } = filter.value
    const { totalElements, content } = await getAssetCommunicationInfo({
        deviceIp: asset.assetIp, deviceMac: asset.assetMac,
        localIp, localPort, remoteIp, remotePort,
        page: page.value, size: size.value,
        sort: sort.value,
        programNames: programName,
        states: state,
        protocols: protocol,
        pidNot: 0
    })
    total.value = totalElements
    tableData.value = content
    console.log(content)
}

function handleSearch() {
    page.value = 1
    getAssetCommunicationInfoData()
}

onMounted(() => {
    getAssetCommunicationInfoData()
    getAssetCommunicationAggregationData()
})

</script>