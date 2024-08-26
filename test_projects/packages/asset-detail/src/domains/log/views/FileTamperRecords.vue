<template>
    <Card :title="t('文件篡改记录')">
        <Form layout="inline">
            <FormItem>
                <Select :options="timesOptions" style="width: 160px" v-model:value="queryForm.time" />
            </FormItem>
            <FormItem>
                <Select :options="actionOptions" style="width: 160px" placeholder="变更类型" allowClear
                    v-model:value="queryForm.action" />
            </FormItem>
            <FormItem>
                <Input :placeholder="t('文件名')" v-model:value="queryForm.path" allow-clear />
            </FormItem>
            <FormItem>
                <Button @click="handleRefresh">查询</Button>
            </FormItem>
        </Form>

        <Table :data-source='tableData' row-key='id' :columns='columns' @change='handleTableChange' class='mt-4'
            :pagination="{ total, current: page, pageSize: size, showTotal: (total) => `共 ${total} 项 `, showSizeChanger: true, }" />
    </Card>
</template>

<script setup lang="ts">
/* 类型文件 */
import type { ColumnsType } from 'ant-design-vue/es/table/interface'
import { FileTamperingRecord } from '../types/fileTamper'
/* 第三方模块 */
import { onMounted, ref } from 'vue';
import { Table, Form, FormItem, Select, Input, Button } from 'ant-design-vue';

import Card from '@/shared/components/Card.vue';
import { getFileTamperingRecordApi } from '../model/fileTamper'
import { useAssetInfoStore } from '@/entry/store';
import { t } from '@/entry/languages/useLanguage';
import { formatToDateTime } from '@guolisec/utils';
import dayjs from 'dayjs';

const { asset } = useAssetInfoStore()

const actionOptions = ref([
    {
        label: '变更名称',
        value: 'newName'
    },
    {
        label: '变更内容',
        value: 'modify'
    },
    {
        label: '新增',
        value: 'add'
    },
    {
        label: '删除',
        value: 'remove'
    },
    {
        label: '移入',
        value: 'move_to'
    },
    {
        label: '移出',
        value: 'move_from'
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

const queryForm = ref<{ path?: string; time: 'all', action?: string }>({ time: 'all' })

/**
 * 分页、排序
 */
const page = ref(1)
const size = ref(10)
const total = ref(0)
const sort = ref<string[]>(['createTime,desc', 'id,desc'])

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
            sort.value = [`${columnKey},asc`, 'id,desc']
            break
        case 'descend':
            sort.value = [`${columnKey},desc`, 'id,desc']
            break
        default:
            sort.value = ['id,desc']
    }

    getFileTamperingRecord()
}

const columns = ref<ColumnsType>([{
    title: t('文件名'),
    width: 240,
    dataIndex: 'path',
    ellipsis: true,
    customRender({ record }) {
        const { path } = record
        let name = path
        if (path && !path.endsWith("\\")) {
            name = path.split('\\').pop()
        }
        return name
    }
},
{
    title: t('文件路径'),
    dataIndex: 'path',
    ellipsis: true,
    customRender({ text }) {
        return text || '-'
    }
},
{
    title: t('变更类型'),
    dataIndex: 'action',
    ellipsis: true,
    customRender({ text }) {
        const currentAction = actionOptions.value.filter(item => {
            if (item.value === text) {
                return true
            }
        })
        return currentAction.length ? currentAction[0].label : '-'
    }
},
{
    title: t('变更后 MD5'),
    width: 400,
    dataIndex: 'hash',
    ellipsis: true,
    customRender({ text }) {
        return text || '-'
    }
},
{
    title: t('修改时间'),
    width: 240,
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    customRender({ text }) {
        return text ? formatToDateTime(text) : '-'
    }
},
])

const tableData = ref<FileTamperingRecord[]>([])

async function getFileTamperingRecord() {
    const { time, path, action } = queryForm.value
    const { content, totalElements } = await getFileTamperingRecordApi({
        path, action,
        size: size.value,
        page: page.value,
        sort: sort.value,
        deviceIp: asset.assetIp,
        deviceMac: asset.assetMac,
        createTime: getTimeRange(time)
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