<!--
 * @name: PLC-故障日志
 * @description: PLC各模块发生故障的日志
-->
<template>
    <Card :title="t('故障日志')">
        <Form layout="inline" class="mb-4">
            <FormItem>
                <Select :options="timesOptions" style="width: 160px" v-model:value="queryForm.timeRangeType" />
            </FormItem>
            <FormItem>
                <Input allow-clear :placeholder="t('故障代码')" style="width: 200px" v-model:value="queryForm.errorCode" />
            </FormItem>
            <FormItem>
                <Input allow-clear :placeholder="t('故障描述')" style="width: 200px" v-model:value="queryForm.description" />
            </FormItem>
            <FormItem>
                <Button @click="handleSearch">{{ t('查询') }}</Button>
            </FormItem>
        </Form>

        <Table :data-source="tableData" row-key="id" :columns="columns" @change="handleTableChange" class="mt-4"
            :pagination="{ total, current: page, pageSize: size, showTotal: (total) => `${t('共 {} 项', total)}`, showSizeChanger: true, }">
            <template #bodyCell="{ column, text }">
                <template v-if="column.key === 'errorType'">
                    <Tag :color="text === 0 ? 'geekblue' : 'cyan'">
                        {{ text === 0 ? t('硬件故障') : t('软件故障') }}
                    </Tag>
                </template>
            </template>
        </Table>

    </Card>
</template>

<script lang="ts" setup>
import type { ColumnProps } from 'ant-design-vue/es/table';
import Card from '@/shared/components/Card.vue'
import { Form, FormItem, Select, Input, Button, Table, Tag } from 'ant-design-vue';
import { t } from '@/entry/languages/useLanguage';
import { computed, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import {
    getAssetErrorModules,
    getAssetErrorLog
} from '../model/log'
import type {
    PLCErrorLog,
} from "../types/log";
import { formatToDateTime } from '@guolisec/utils';
import { useAssetInfoStore } from '@/entry/store';

const { asset } = useAssetInfoStore()


/**
 * 时间段选项
 */
const timesOptions = [
    {
        label: t('今日'),
        value: 'today'
    },
    {
        label: t('近一周'),
        value: 'week'
    },
    {
        label: t('近一个月'),
        value: 'month'
    },
    {
        label: t('近三个月'),
        value: 'threeMonth'
    },
    {
        label: t('全部时间'),
        value: 'all'
    }
]

const errorTypeOptions = [
    {
        text: t('硬件故障'),
        value: 0
    }, {
        text: t('软件故障'),
        value: 1
    }
]

/**
 * 获取故障模块数据
 */
const errorModuleOptions = ref<{ text: string, value: string }[]>([])
async function getErrorModulegetData() {
    const res = await getAssetErrorModules({
        // 有 IP 只传 IP, 没 IP 传 MAC 
        deviceIp: asset.assetIp || undefined,
        deviceMac: asset.assetIp ? undefined : asset.assetMac,
    })
    errorModuleOptions.value = res.map(item => {
        const list = item.split('-')
        return {
            text: t('{} 号机架 {} 号槽', list[0], list[1]),
            value: item
        }
    })
}

/**
 * 查询表单
 */
const queryForm = ref<{
    timeRangeType: string;
    errorCode?: string;
    description?: string
}>({
    timeRangeType: 'all'
})

/**
 * 分页、排序
 */
const page = ref(1)
const size = ref(10)
const total = ref(0)

const sort = ref('errorTime,desc')

const filter = ref<{ errorType?: (0 | 1)[]; errorModule?: string[] }>({})

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
    getErrorLogsData()
}

/**
  * 故障日志数据
 */

const columns = computed<ColumnProps<PLCErrorLog>[]>(() => {

    return [
        {
            title: t('故障模块'),
            width: 160,
            dataIndex: 'errorModule',
            ellipsis: true,
            filters: errorModuleOptions.value,
            customRender({ text }) {
                const list = text.split('-')
                return t("{} 号机架 {} 号槽", list[0] ?? '-', list[1] ?? '-')
            }
        },
        {
            title: t('故障类别'),
            width: 160,
            ellipsis: true,
            dataIndex: 'errorClass',
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('故障类别描述'),
            width: 200,
            ellipsis: true,
            dataIndex: 'errorTypeDescribe',
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('故障代码'),
            dataIndex: 'errorCode',
            width: 120,
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('故障描述'),
            dataIndex: 'description',
            ellipsis: true,
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('故障原因'),
            dataIndex: 'errorReason',
            ellipsis: true,
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('故障类型'),
            width: 120,
            dataIndex: 'errorType',
            key: 'errorType',
            filters: errorTypeOptions
        },
        {
            title: t('产生时间'),
            width: 200,
            sorter: true,
            dataIndex: 'errorTime',
            defaultSortOrder: 'descend',
            key: 'errorTime',
            customRender({ text }) {
                return text ? formatToDateTime(text) : '-'
            }
        },
    ]
})

// 根据时间下拉框的选项，返回对应的时间段
function getTimeRange(select: string) {
    switch (select) {
        case 'day':
            return [dayjs().startOf('D').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('D').format('YYYY-MM-DD HH:mm:ss')]
        case 'week':
            return [dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('D').format('YYYY-MM-DD HH:mm:ss')]
        case 'month':
            return [dayjs().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('D').format('YYYY-MM-DD HH:mm:ss')]
        case 'threeMonth':
            return [dayjs().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss'), dayjs().endOf('D').format('YYYY-MM-DD HH:mm:ss')]
        case 'all':
            return undefined
    }
}

const tableData = ref<PLCErrorLog[]>([])

async function getErrorLogsData() {
    const { timeRangeType, errorCode, description } = queryForm.value
    const errorTime = getTimeRange(timeRangeType)
    const { errorModule, errorType } = filter.value
    const { totalElements, content } = await getAssetErrorLog({
        // 有 IP 只传 IP, 没 IP 传 MAC 
        deviceIp: asset.assetIp || undefined, deviceMac: asset.assetIp ? undefined : asset.assetMac,
        errorCode, description, errorTime,
        page: page.value, size: size.value,
        sort: sort.value, errorModules: errorModule, errorTypes: errorType
    })
    total.value = totalElements
    tableData.value = content
    console.log(content)
}

function handleSearch() {
    page.value = 1
    getErrorLogsData()
}

onMounted(() => {
    getErrorLogsData()
    getErrorModulegetData()
})

</script>