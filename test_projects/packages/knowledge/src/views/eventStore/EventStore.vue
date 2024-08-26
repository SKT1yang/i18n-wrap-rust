<!--
 * @name: 事件库
 * @description: Do not edit
 * @date: 2023-09-20 18:01:38
 * @path: \knowledge\src\views\eventStore\EventStore.vue
-->
<template>
    <div class="event-store">

        <Form layout="inline">
            <FormItem>
                <Button type="primary" @click="handleAddEvent" class="mb-4">
                    <template #icon>
                        <i class="i-base-add-line align-icon mr-1"></i>
                    </template>
                    新增
                </Button>
            </FormItem>
            <FormItem label="事件名称：">
                <Input v-model:value="queryForm.name" placeholder="事件名称" allow-clear />
            </FormItem>
            <FormItem label="事件类型：">
                <Cascader v-model:value="queryForm.typeList" placeholder="事件类型" :options="eventTypeTreeData"
                    :field-names="{ label: 'name', value: 'id', children: 'eventTypes' }" style="min-width: 200px"
                    :change-on-select="true" expand-trigger="hover" allow-clear />
            </FormItem>
            <FormItem>
                <Button @click="handleSearch" class="mb-4">
                    <template #icon>
                        <i class="i-base-search-line align-icon mr-1"></i>
                    </template>
                    查询
                </Button>
            </FormItem>
            <FormItem>
                <Button @click="handleEditEvent('threshold')" class="mb-4">
                    潜在危害分析设置
                </Button>
            </FormItem>
            <FormItem>
                <Button @click="handleEditEvent('abnormal')" class="mb-4">
                    异常行为分析设置
                </Button>
            </FormItem>
            <FormItem>
                <Button @click="handleEditEvent('alarm')" class="mb-4">
                    安全事件分析设置
                </Button>
            </FormItem>
            <FormItem>
                <Button danger @click="handleMutilDelete" class="mb-4">
                    <template #icon>
                        <i class="i-base-delete-bin-line align-icon mr-1"></i>
                    </template>
                    批量删除
                </Button>
            </FormItem>

        </Form>

        <Table :data-source="tableData" row-key="id" bordered :columns="tableColumns" @change="handleTableChange"
            :row-selection="{ selectedRowKeys, onChange: handleSelectionChange }"
            :pagination="{ total, current: currentPage, pageSize: size, showTotal: (total) => `共 ${total} 条 `, showQuickJumper: true, showSizeChanger: true, }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'score'">
                    <EventAlarmTag :score="record.score" />
                </template>
                <template v-else-if="column.key === 'abnormal'">
                    <Switch v-model:checked="record.abnormal"
                        @change="(checked) => handleChangeSwitch(record, 'abnormal', checked)"></Switch>
                </template>
                <template v-else-if="column.key === 'alarm'">
                    <Switch v-model:checked="record.alarm" @change="(checked) => handleChangeSwitch(record, 'alarm',
                        checked)"></Switch>
                </template>
            </template>
        </Table>
        <EventSettingsModal v-model:visible="settingDialogVisible" :records="records" :type="settingType"
            @refresh="handleSearch" />
        <AddEventStoreModal v-model:visible="addDialogVisible" @refresh="getEventStoreData" />
    </div>
</template>

<script setup lang="ts">
/* 类型文件 */
import type { KnowledgeConfig } from '../../types/eventStore'
import type { PropType } from 'vue';
import type { ColumnsType } from "ant-design-vue/es/table/interface";
/* 第三方模块 */
import { ref } from 'vue';
import { Form, FormItem, Input, Cascader, Button, Table, Switch } from 'ant-design-vue'
/* 本地共享模块 */
import { EventAlarmTag } from "@guolisec/component";
/* 业务模块 */
import { useBasicStore } from '../../controller/useEventStore'
import EventSettingsModal from './EventSettingsModal.vue'
import AddEventStoreModal from './AddEventModal.vue'

const props = defineProps({
    config: {
        type: Object as PropType<KnowledgeConfig>,
        default: () => { }
    },
})

/**
 * 获取列表数据
 */
const tableColumns = ref<ColumnsType>([
    {
        title: "事件 ID",
        dataIndex: "id",
        align: "center",
        width: 120,
    },
    {
        title: "事件名称",
        dataIndex: "name",
    },
    {
        title: "事件类型",
        dataIndex: "type",
        width: 260,
    },
    {
        title: "事件级别",
        dataIndex: "score",
        key: "score",
        align: "center",
        width: 120,
    },
    {
        title: "事件描述",
        dataIndex: "description",
        ellipsis: true,
    },
    {
        title: "事件特征",
        dataIndex: "tag",
        width: 140,
        customRender: ({ text }) => {
            return text ? text : "-";
        },
    },
    {
        title: "潜在危害分析",
        dataIndex: "threshold",
        //   align: "center",
        width: 140,
        customRender: ({ record }) => {
            const { threshold, unit } = record;
            if (threshold) {
                return ["累计", "每分钟", "每小时", "每天"][unit] + threshold + "次";
            } else {
                return "-";
            }
        },
    },
    {
        title: "异常行为分析",
        dataIndex: "abnormal",
        align: "center",
        width: 120,
        key: "abnormal",
    },
    {
        title: "安全事件告警",
        dataIndex: "alarm",
        key: "alarm",
        align: "center",
        width: 120,
    },
]);

const {
    queryForm,
    eventTypeTreeData,
    tableData,
    getEventStoreData,
    handleSearch,
    total,
    currentPage,
    size,
    handleTableChange,
    handleChangeSwitch,
    handleSelectionChange,
    selectedRowKeys,
    handleMutilDelete,
    handleEditEvent,
    settingDialogVisible,
    records,
    settingType,
    addDialogVisible,
    handleAddEvent
} = useBasicStore(props)
</script>