<!--
 * @name: 主机-外设记录
 * @description: 主机USB使用记录
-->

<template>
    <Card class="" :title="t('外设记录')">
        <Form layout="inline" class="mb-4" v-if="assetOsType === 1">
            <FormItem>
                <RangePicker value-format="YYYY-MM-DD HH:mm:ss"
                    :show-time="{ defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')] }"
                    v-model:value="queryForm.createTime" @change="handleSearch" :allow-clear="false" />
            </FormItem>
        </Form>

        <Table :data-source="tableData" row-key="id" :columns="columns" @change="handleTableChange"
            :pagination="{ total, current: page, pageSize: size, showTotal: (total) => `${t('共 {} 项', total)}`, showSizeChanger: true, }">
            <template #bodyCell="{ column, text }">
                <template v-if="column.key === 'operation'">
                    <Tag :color="text === 'plugin' ? 'green' : ''">
                        {{ text === 'plugin' ? t('正在使用') : t('历史接入') }}
                    </Tag>
                </template>
            </template>
        </Table>

    </Card>
</template>

<script lang="ts" setup>
import type { ColumnProps } from 'ant-design-vue/es/table';
import Card from '@/shared/components/Card.vue'
import { Form, FormItem, Table, Tag, RangePicker } from 'ant-design-vue';
import { t } from '@/entry/languages/useLanguage';
import { computed, onMounted, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { formatToDateTime } from '@guolisec/utils';
import { useAssetInfoStore } from '@/entry/store';
import type { USB } from '../types/usb';
import {
    getAssetDetailUsbRecord,
    getAssetDetailUsbHistory,
    getAssetDetailUsbRecordAggregation,
    getAssetDetailUsbHistoryAggregation,
} from '../model/usb'
import { getAssetDetailInfo } from '@/domains/app/model';

const { asset } = useAssetInfoStore()

/**
 * 获取资产操作系统类型
 */
const assetOsType = ref(0)
async function getAssetDetailInfoData() {
    const { osType } = await getAssetDetailInfo({
        deviceIp: asset.assetIp,
        deviceMac: asset.assetMac
    })
    assetOsType.value = osType
}

/**
 * 获取表格筛选数据
 */
const filterOptions = ref<{
    usbName?: { text: string; value: string }[];
    action?: { text: string; value: string }[];
    operation?: { text: string; value: string }[];
}>({})
async function getAssetDetailUsbAggregationData() {
    const { createTime } = queryForm.value
    // windows
    if (assetOsType.value === 0) {
        const res = await getAssetDetailUsbHistoryAggregation({
            deviceIp: asset.assetIp, deviceMac: asset.assetMac,
        })
        Object.keys(res).forEach(key => {
            filterOptions.value[key] = res[key].map(value => {
                if (key === 'operation') {
                    return {
                        value,
                        text: value === 'history' ? t('历史接入') : t('正在使用')
                    }
                } else {
                    return {
                        value,
                        text: value
                    }
                }
            })
        })
    } else if (assetOsType.value === 1) { // linux
        const res = await getAssetDetailUsbRecordAggregation({
            deviceIp: asset.assetIp, deviceMac: asset.assetMac,
            createTime: [formatToDateTime(createTime[0]), formatToDateTime(createTime[1])],
        })
        Object.keys(res).forEach(key => {
            filterOptions.value[key] = res[key].map(value => {
                if (key === 'action') {
                    return {
                        value,
                        text: value === 'inserted' ? t('接入') : t('移除')
                    }
                } else {
                    return {
                        value,
                        text: value
                    }
                }
            })
        })
    }

}



/**
 * 查询表单
 */
const queryForm = ref<{
    createTime: [Dayjs, Dayjs];
}>({
    createTime: [dayjs().startOf('M'), dayjs().endOf('D')]
})

/**
 * 分页、排序
 */
const page = ref(1)
const size = ref(10)
const total = ref(0)

const sort = ref('createTime,desc')

const filter = ref<{ usbName?: string[]; action?: string[]; operation?: string[] }>({})

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

    getAssetDetailUsbRecordData()
}

/**
  * USB 记录数据
 */

const columns = computed(() => {
    const content: ColumnProps<USB>[] = [
        {
            title: t('产生时间'),
            sorter: true,
            dataIndex: 'createTime',
            defaultSortOrder: 'descend',
            key: 'createTime',
            customRender({ text }) {
                return text ? formatToDateTime(text) : '-'
            }
        },
        {
            title: t('USB 名称'),
            dataIndex: 'usbName',
            ellipsis: true,
            filters: filterOptions.value?.usbName,
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('动作'),
            ellipsis: true,
            dataIndex: 'action',
            filters: filterOptions.value?.action,
            customRender({ text }) {
                return text ? (text === 'inserted' ? t('接入') : t('移除')) : '-'
            }
        },
        {
            title: t('状态'),
            ellipsis: true,
            dataIndex: 'operation',
            key: 'operation',
            filters: filterOptions.value?.operation,
        },
    ]
    return content.filter((item) => {
        if (assetOsType.value === 0 && (item.dataIndex === 'usbName' || item.dataIndex === 'operation')) {
            return true
        }
        if (assetOsType.value === 1 && item.dataIndex !== 'operation') {
            return true
        }
        return false
    })
})

/**
 * 获取表格数据
 */
const tableData = ref<USB[]>([])

async function getAssetDetailUsbRecordData() {
    const { createTime } = queryForm.value
    const { usbName, action, operation } = filter.value
    console.log(assetOsType.value, 'assetOsType.value')
    // linux
    if (assetOsType.value === 1) {
        const { totalElements, content } = await getAssetDetailUsbRecord({
            deviceIp: asset.assetIp, deviceMac: asset.assetMac,
            page: page.value, size: size.value,
            sort: sort.value,
            createTime: [formatToDateTime(createTime[0]), formatToDateTime(createTime[1])],
            usbNames: usbName, actions: action
        })
        total.value = totalElements
        tableData.value = content
    } else if (assetOsType.value === 0) { // windows
        const { totalElements, content } = await getAssetDetailUsbHistory({
            deviceIp: asset.assetIp, deviceMac: asset.assetMac,
            page: page.value, size: size.value, usbNames: usbName,
            operations: operation
        })
        total.value = totalElements
        tableData.value = content
    }
}

function handleSearch() {
    page.value = 1
    getAssetDetailUsbRecordData()
    getAssetDetailUsbAggregationData()
}

onMounted(async () => {
    await getAssetDetailInfoData()
    getAssetDetailUsbRecordData()
    getAssetDetailUsbAggregationData()

})

</script>