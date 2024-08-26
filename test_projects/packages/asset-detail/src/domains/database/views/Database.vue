<!--
 * @name: 数据库
 * @description: 
-->
<template>
    <Card :title="t('基本信息')" class="space-y-2">
        <div class="flex">
            <span class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('IP 地址') }} </span>
            <span class="break-all">{{ databaseInfo?.ip || '-' }}</span>
        </div>
        <div class="flex">
            <span class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('端口') }} </span>
            <span class="break-all">{{ databaseInfo?.port || '-' }}</span>
        </div>
        <div class="flex">
            <span class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('数据库名') }} </span>
            <span class="break-all">{{ databaseInfo?.serviceName || '-' }}</span>
        </div>
        <div class="flex">
            <span class="inline-block w-[80px] text-$color-text-tertiary flex-none">{{ t('版本') }} </span>
            <span class="break-all">{{ databaseInfo?.dbVersion || '-' }}</span>
        </div>
    </Card>
    <Card :title="t('表信息')" class="my-6">
        <Table :data-source="informationTableData" row-key="id" :columns="informationColumns"
            @change="handleInformationTableChange"
            :pagination="{ total: informationTableState.total, current: informationTableState.page, pageSize: informationTableState.size, showTotal: (total) => `${t('共 {} 项', total)}`, showSizeChanger: false, }">
        </Table>
    </Card>

    <Card :title="t('连接信息')" class="my-6">
        <Table :data-source="linkTableData" row-key="id" :columns="linkColumns" @change="handleILinkTableChange"
            :pagination="{ total: linkTableState.total, current: linkTableState.page, pageSize: linkTableState.size, showTotal: (total) => `${t('共 {} 项', total)}`, showSizeChanger: false, }">
            <template #bodyCell="{ column, text }">
                <template v-if="column.key === 'status'">
                    <Tag :color="text === 'INACTIVE' ? '' : 'green'">
                        {{text }}
                    </Tag>
                </template>
            </template>
        </Table>
    </Card>

    <Card :title="t('慢 SQL 信息')" class="my-6">
        <Table :data-source="slowTableData" row-key="id" :columns="slowColumns" @change="handleSlowTableChange"
            :scroll="{ x: 1500 }"
            :pagination="{ total: slowTableState.total, current: slowTableState.page, pageSize: slowTableState.size, showTotal: (total) => `${t('共 {} 项', total)}`, showSizeChanger: false, }">
        </Table>
    </Card>
</template>

<script setup lang="ts">
import type { ColumnProps } from 'ant-design-vue/es/table';
import Card from '@/shared/components/Card.vue';
import { t } from '@/entry/languages/useLanguage';
import { Table, Tag } from 'ant-design-vue';
import { ref, computed, reactive, onMounted } from 'vue'
import {
    getAssetDbInfo,
    getAssetDbAggregation,
    getAssetDbLinkInfo,
    getAssetDbLinkAggregation,
    getAssetDbSlowInfo,
    getInstallList
} from '../model'
import type { DatabaseInfo, LinkDatabaseInfo, SlowDatabaseInfo, DatabaseBasicInfo } from '../types'
import { useAssetInfoStore } from '@/entry/store';
import { formatToDateTime } from '@guolisec/utils';

const { asset } = useAssetInfoStore()

/**
 * 获取数据库基本信息
 */
const databaseInfo = ref<DatabaseBasicInfo>()
async function getInstallListData() {
    const { content } = await getInstallList({ ip: asset.assetIp, mac: asset.assetMac })
    databaseInfo.value = content[0]?.dbInfo
}

/**
 * ---------------------- 表信息
 */

/**
 * 分页、排序
 */
const informationTableState = reactive<{
    page: number;
    size: number;
    total: number;
    sort: string;
    filter: { tableSpaceType?: string[] }
}>({
    page: 1,
    size: 5,
    total: 0,
    sort: '',
    filter: {}
})

/**
 * 表格发生变化
 */
function handleInformationTableChange(pagination, filters, sorter) {
    const { current, pageSize } = pagination
    informationTableState.page = current
    informationTableState.size = pageSize

    const { order, columnKey } = sorter
    switch (order) {
        case 'ascend':
            informationTableState.sort = `${columnKey},asc`
            break
        case 'descend':
            informationTableState.sort = `${columnKey},desc`
            break
        default:
            informationTableState.sort = ''
    }

    informationTableState.filter = filters

    getAssetDbInfoData()
}


/**
  * 表信息数据
 */

const informationColumns = computed<ColumnProps<DatabaseInfo>[]>(() => {

    return [
        {
            title: t('表空间名称'),
            dataIndex: 'tableSpaceName',
            key: 'tableSpaceName',
            ellipsis: true,
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('表空间类型'),
            dataIndex: 'tableSpaceType',
            ellipsis: true,
            key: 'tableSpaceType',
            filters: tableSpaceNameOptions.value,
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('总大小（MB）'),
            ellipsis: true,
            align: 'right',
            dataIndex: 'total',
            key: 'total',
            sorter: true,
            customRender({ text }) {
                return typeof text === 'number' ? text : '-'
            }
        },
        {
            title: t('使用大小（MB）'),
            ellipsis: true,
            align: 'right',
            key: 'used',
            dataIndex: 'used',
            sorter: true,
            customRender({ text }) {
                return typeof text === 'number' ? text.toFixed(2) : '-'
            }
        },
        {
            title: t('剩余大小（MB）'),
            ellipsis: true,
            align: 'right',
            dataIndex: 'free',
            key: 'free',
            sorter: true,
            customRender({ text }) {
                return typeof text === 'number' ? text.toFixed(2) : '-'
            }
        },
        {
            title: t('使用率'),
            ellipsis: true,
            align: 'right',
            key: 'usage',
            dataIndex: 'usage',
            sorter: true,
            customRender({ text }) {
                return typeof text === 'number' ? text.toFixed(2) : '-'
            }
        },
    ]
})

/**
 * 获取表信息数据
 */
const informationTableData = ref<DatabaseInfo[]>([])
async function getAssetDbInfoData() {
    const { tableSpaceType } = informationTableState.filter
    const { totalElements, content } = await getAssetDbInfo({
        deviceIp: asset.assetIp, deviceMac: asset.assetMac,
        page: informationTableState.page, size: informationTableState.size,
        sort: informationTableState.sort, tableSpaceTypes: tableSpaceType
    })
    informationTableState.total = totalElements
    informationTableData.value = content
}

/**
 * 获取表信息筛选数据
 */
const tableSpaceNameOptions = ref<{ text: string, value: string }[]>([])
async function getAssetDbAggregationData() {
    const { tableSpaceType } = await getAssetDbAggregation({ deviceIp: asset.assetIp, deviceMac: asset.assetMac, })

    tableSpaceNameOptions.value = tableSpaceType.map(item => {
        return { text: item, value: item }
    })
    console.log(tableSpaceNameOptions.value, 'tableSpaceNameOptions')
}


// ---------------------- 连接信息 -----------------------


/**
 * 分页、排序
 */
const linkTableState = reactive<{
    page: number;
    size: number;
    total: number;
    sort: string;
    filter: { program?: string[]; status?: string[]; user?: string[] }
}>({
    page: 1,
    size: 5,
    total: 0,
    sort: '',
    filter: {}
})

/**
 * 表格发生变化
 */
function handleILinkTableChange(pagination, filters, sorter) {
    const { current, pageSize } = pagination
    linkTableState.page = current
    linkTableState.size = pageSize

    const { order, columnKey } = sorter
    switch (order) {
        case 'ascend':
            linkTableState.sort = `${columnKey},asc`
            break
        case 'descend':
            linkTableState.sort = `${columnKey},desc`
            break
        default:
            linkTableState.sort = ''
    }

    linkTableState.filter = filters

    getAssetDbLinkInfoData()
}


/**
  * 连接信息数据
 */

const linkColumns = computed<ColumnProps<LinkDatabaseInfo>[]>(() => {
    return [
        {
            title: t('主机'),
            dataIndex: 'host',
            key: 'host',
            ellipsis: true,
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('用户'),
            dataIndex: 'user',
            ellipsis: true,
            key: 'user',
            filters: linkFilterOptions.value.user.map(value => { return { value, text: value } }),
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('使用数据库'),
            dataIndex: 'program',
            ellipsis: true,
            key: 'program',
            filters: linkFilterOptions.value.program.map(value => { return { value, text: value } }),
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('连接时间'),
            dataIndex: 'connectionTime',
            ellipsis: true,
            key: 'connectionTime',
            sorter: true,
            customRender({ text }) {
                return text ? formatToDateTime(text) : '-'
            }
        },
        {
            title: t('状态'),
            dataIndex: 'status',
            ellipsis: true,
            key: 'status',
            filters: linkFilterOptions.value.status.map(value => { return { value, text: value } }),
            customRender({ text }) {
                return text || '-'
            }
        },
    ]
})

/**
 * 获取连接信息数据
 */
const linkTableData = ref<LinkDatabaseInfo[]>([])
async function getAssetDbLinkInfoData() {
    const { program, user, status } = linkTableState.filter
    const { totalElements, content } = await getAssetDbLinkInfo({
        deviceIp: asset.assetIp, deviceMac: asset.assetMac,
        page: linkTableState.page, size: linkTableState.size,
        sort: linkTableState.sort, programs: program, users: user, statuses: status
    })
    linkTableState.total = totalElements
    linkTableData.value = content
}

/**
 * 获取表信息筛选数据
 */
const linkFilterOptions = ref<{
    status: string[];
    user: string[];
    program: string[];
}>({ status: [], user: [], program: [] })
async function getAssetDbLinkAggregationData() {
    const res = await getAssetDbLinkAggregation({ deviceIp: asset.assetIp, deviceMac: asset.assetMac, })
    linkFilterOptions.value = res
}


// ---------------------- 慢 SQl 信息 ----------------------------------


/**
 * 分页、排序
 */
const slowTableState = reactive<{
    page: number;
    size: number;
    total: number;
    sort: string;
}>({
    page: 1,
    size: 5,
    total: 0,
    sort: '',
})

/**
 * 表格发生变化
 */
function handleSlowTableChange(pagination, _filters, sorter) {
    const { current, pageSize } = pagination
    slowTableState.page = current
    slowTableState.size = pageSize

    const { order, columnKey } = sorter
    switch (order) {
        case 'ascend':
            slowTableState.sort = `${columnKey},asc`
            break
        case 'descend':
            slowTableState.sort = `${columnKey},desc`
            break
        default:
            slowTableState.sort = ''
    }

    getAssetDbSlowInfoData()
}


/**
  * 表信息数据
 */

const slowColumns = computed<ColumnProps<SlowDatabaseInfo>[]>(() => {

    return [
        {
            title: t('Oracle 唯一标识'),
            dataIndex: 'sqlId',
            key: 'sqlId',
            ellipsis: true,
            width: 160,
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('SQL 语句'),
            dataIndex: 'sqlText',
            key: 'sqlText',
            customRender({ text }) {
                return text || '-'
            }
        },
        {
            title: t('执行时间（s）'),
            ellipsis: true,
            align: 'right',
            dataIndex: 'elapsedTime',
            key: 'elapsedTime',
            sorter: true,
            width: 140,
            customRender({ text }) {
                return typeof text === 'number' ? text : '-'
            }
        },
        {
            title: t('CPU 执行时间（s）'),
            ellipsis: true,
            align: 'right',
            key: 'cpuTime',
            dataIndex: 'cpuTime',
            sorter: true,
            width: 180,
            customRender({ text }) {
                return typeof text === 'number' ? text : '-'
            }
        },
        {
            title: t('缓存读取次数'),
            ellipsis: true,
            align: 'right',
            dataIndex: 'bufferReads',
            key: 'bufferReads',
            sorter: true,
            width: 140,
            customRender({ text }) {
                return typeof text === 'number' ? text : '-'
            }
        },
        {
            title: t('物理读取次数'),
            ellipsis: true,
            align: 'right',
            key: 'diskReads',
            dataIndex: 'diskReads',
            sorter: true,
            width: 140,
            customRender({ text }) {
                return typeof text === 'number' ? text : '-'
            }
        },
        {
            title: t('执行次数'),
            ellipsis: true,
            align: 'right',
            key: 'executions',
            dataIndex: 'executions',
            sorter: true,
            width: 140,
            customRender({ text }) {
                return typeof text === 'number' ? text : '-'
            }
        },
        {
            title: t('第一次加载时间'),
            ellipsis: true,
            key: 'firstLoadTime',
            dataIndex: 'firstLoadTime',
            sorter: true,
            customRender({ text }) {
                return text ? formatToDateTime(text) : '-'
            },
            width: 180
        },
        {
            title: t('最后一次加载时间'),
            ellipsis: true,
            key: 'lastLoadTime',
            dataIndex: 'lastLoadTime',
            sorter: true,
            customRender({ text }) {
                return text ? formatToDateTime(text) : '-'
            },
            width: 180
        },
    ]
})

/**
 * 获取表信息数据
 */
const slowTableData = ref<SlowDatabaseInfo[]>([])
async function getAssetDbSlowInfoData() {
    const { totalElements, content } = await getAssetDbSlowInfo({
        deviceIp: asset.assetIp, deviceMac: asset.assetMac,
        page: slowTableState.page, size: slowTableState.size,
        sort: slowTableState.sort,
    })
    slowTableState.total = totalElements
    slowTableData.value = content
}



onMounted(() => {
    getInstallListData()
    getAssetDbInfoData()
    getAssetDbAggregationData()
    getAssetDbLinkInfoData()
    getAssetDbLinkAggregationData()
    getAssetDbSlowInfoData()
})

</script>