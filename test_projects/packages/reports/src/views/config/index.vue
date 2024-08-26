<!--
 * @name: 报表管理
 * @description: 
 * @date: 2023-09-13 15:04:41
 * @path: \feature-vue\platform\front\reports\src\views\config\index.vue
-->
<template>
    <div class="report-config">
        <Button type="primary" @click="handleAddConfig" v-if="false" class="mt-4"> {{ t('添加任务') }}</Button>

        <Table :data-source="tableData" bordered :columns="tableColumns" :pagination="false">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'isPause'">
                    <Switch v-model:checked="record.isPause" :checkedValue="false" :unCheckedValue="true"
                        @change="(checked) => handleSwitchChange(record, checked)" />
                </template>
            </template>

        </Table>

    </div>
    <AddTemplateModal v-model:visible="dialogVisible" @refresh="getReportTasksData" />
</template>

<script lang="ts" setup>
import { Button, Table, Switch } from 'ant-design-vue';
import AddTemplateModal from './AddTemplateModal.vue';
import { useReportConfig } from '../../controller/useReportsConfig'
import { t } from '@/entry/languages/useLanguage'

const {
    tableData,
    dialogVisible,
    getReportTasksData,
    tableColumns,
    handleSwitchChange,
    handleAddConfig
} = useReportConfig()
</script>