<template>
    <Card :title="t('故障日志')">
        <Form layout="inline">
            <FormItem>
                <Select :options="timesOptions" style="width: 160px" v-model:value="queryForm.time" />
            </FormItem>
            <FormItem>
                <Input :placeholder="t('事件描述')" v-model:value="queryForm.logDescript" allow-clear />
            </FormItem>
            <FormItem>
                <Select :options="levelOptions" style="width: 160px" placeholder="事件等级" allowClear
                    v-model:value="queryForm.logLevel" />
            </FormItem>
            <FormItem>
                <Button @click="handleRefresh">查询</Button>
            </FormItem>
        </Form>

        <Table :data-source='tableData' row-key='id' :columns='columns' @change='handleTableChange' class='mt-4'
            :pagination="{ total, current: page, pageSize: size, showTotal: (total) => `共 ${total} 项 `, showSizeChanger: true, }">
            <template #bodyCell="{ column, text }">
                <template v-if="column.key === 'logLevel'">
                    <Tag :color="levelOptions[text].color">
                        {{ levelOptions[text].label }}
                    </Tag>
                </template>
            </template>
        </Table>
    </Card>
</template>

<script setup lang="ts">
/* 类型文件 */
import type { ColumnsType } from 'ant-design-vue/es/table/interface'
import { FileTamperingRecord } from '../types/fileTamper.js'
/* 第三方模块 */
import { onMounted, ref } from 'vue';
import { Table, Form, FormItem, Select, Input, Button, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';
/* 本地模块 */
import Card from '@/shared/components/Card.vue';
import { getDeviceLogApi } from '../model/log'
import { useAssetInfoStore } from '@/entry/store';
import { t } from '@/entry/languages/useLanguage';
import { formatToDateTime } from '@guolisec/utils';

const { asset } = useAssetInfoStore()

const levelOptions = ref([
    {
        label: 'Emergency',
        value: 0,
        color: 'magenta'
    },
    {
        label: 'Alert',
        value: 1,
        color: 'red'
    },
    {
        label: 'Critical',
        value: 2,
        color: 'volcano'
    },
    {
        label: 'Error',
        value: 3,
        color: 'orange'
    },
    {
        label: 'Warning',
        value: 4,
        color: 'gold'
    },
    {
        label: 'Notification',
        value: 5,
        color: 'blue'
    },
    {
        label: 'Information',
        value: 6,
        color: 'cyan'
    },
])


/**
 * 时间段选项
 */
const timesOptions = [
    {
        label: '全部时间',
        value: 'all'
    },
    {
        label: '今日',
        value: 'today'
    },
    {
        label: '近一周',
        value: 'week'
    },
    {
        label: '近一个月',
        value: 'month'
    },
    {
        label: '近三个月',
        value: 'threeMonth'
    },

]

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

const queryForm = ref<{ logDescript?: string; time: 'all', logLevel?: number }>({ time: 'all' })

/**
 * 分页、排序
 */
const page = ref(1)
const size = ref(10)
const total = ref(0)
const sort = ref('logTime,desc')

/**
 * 表格发生变化
 */
function handleTableChange(pagination, _filters, sorter) {
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

    getFileTamperingRecord()
}

const columns = ref<ColumnsType>([{
    title: t('事件描述'),
    dataIndex: 'logDescript',
    ellipsis: true,
    customRender({ text }) {
        return text || '-'
    }
},
{
    title: t('事件等级'),
    dataIndex: 'logLevel',
    sorter: true,
    ellipsis: true,
    width: 240,
},
{
    title: t('时间'),
    width: 240,
    dataIndex: 'logTime',
    key: 'logTime',
    sorter: true,
    defaultSortOrder: 'descend',
    customRender({ text }) {
        return text ? formatToDateTime(text) : '-'
    }
},
])

const tableData = ref<FileTamperingRecord[]>([])

async function getFileTamperingRecord() {
    const { time, logLevel, logDescript } = queryForm.value
    const { content, totalElements } = await getDeviceLogApi({
        logLevel, logDescript,
        size: size.value,
        page: page.value,
        sort: sort.value,
        switchIp: asset.assetIp,
        logTime: getTimeRange(time)
    })
    tableData.value = content
    total.value = totalElements
}

function handleRefresh() {
    page.value = 1
    getFileTamperingRecord()
}

onMounted(() => {
    getFileTamperingRecord()
})
</script>