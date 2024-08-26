<!--
 * @name: 报表列表
 * @description: 
 * @date: 2023-09-14 14:11:30
 * @path: \feature-vue\platform\front\reports\src\views\list\index.vue
-->
<template>
    <div class="report-list">
        <div class="flex justify-between">
            <template v-if="injectReportContext.length">
                <RadioGroup v-model:value="reportType" @change="handleChangeReportType">
                    <RadioButton :value="1" v-if="hiddenFeatures('day-report')">{{ t('日报') }}</RadioButton>
                    <RadioButton :value="2" v-if="hiddenFeatures('month-report')">{{ t('月报') }}</RadioButton>
                    <RadioButton :value="3" v-if="hiddenFeatures('year-report')">{{ t('年报') }}</RadioButton>
                </RadioGroup>
            </template>
            <div>
                <Button @click="handleSearch" class="mr-2">
                    <i class="i-base-refresh-line align-icon"></i>{{ t('刷新') }}
                </Button>

                <Button danger @click="handleMutilDelete">
                    <i class="i-base-delete-bin-line align-icon"></i>{{ t('批量删除') }}
                </Button>

            </div>
        </div>

        <!-- 列表 -->
        <Table row-key="id" :data-source="tableData" @change="handleTableChange" :columns="tableColumns"
            :row-selection="{ selectedRowKeys, onChange: handleSelectionChange }"
            :pagination="{ total, current: currentPage, pageSize: size, showTotal: (total) => `${t('共 {} 条 ', total)}`, showQuickJumper: true, showSizeChanger: true, }"
            class="mt-4">
            <template #bodyCell="{ column, record }">

                <template v-if="column.key === 'action'">
                    <Button type="link" size="small" @click="handleEditReport(record)">
                        {{ t('修改') }}
                    </Button>
                    <Button type="link" size="small" @click="handleDownloadReport(record)">
                        {{ t('下载') }}
                    </Button>
                    <Popconfirm :title="t('删除后报表无法恢复，确定删除吗？')" @confirm="handleDeleteReport([record.id])">
                        <Button type="link" danger size="small">
                            {{ t('删除') }}
                        </Button>
                    </Popconfirm>
                </template>
            </template>
        </Table>
        <EditReportModal v-model:visible="dialogVisible" :current="row" @refresh="handleSearch" />
    </div>
</template>

<script lang="ts" setup>
import { RadioGroup, RadioButton, Button, Popconfirm, Table } from 'ant-design-vue'
import { useReportList } from '../../controller/useReportsList';
import EditReportModal from './EditReportModal.vue'
import { hiddenFeatures, injectReportContext } from '../../entry/features/useContext'
import { t } from '@/entry/languages/useLanguage'

const {
    tableData,
    tableColumns,
    handleSearch,
    total,
    currentPage,
    size,
    handleTableChange,
    reportType,
    handleChangeReportType,
    handleDeleteReport,
    handleSelectionChange,
    selectedRowKeys,
    handleMutilDelete,
    dialogVisible,
    row,
    handleEditReport,
    handleDownloadReport
} = useReportList()
</script>