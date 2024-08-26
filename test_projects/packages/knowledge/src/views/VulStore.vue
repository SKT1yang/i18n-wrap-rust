<!--
 * @name: 漏洞库
 * @description: Do not edit
 * @date: 2023-09-22 15:44:30
 * @path: \knowledge\src\views\VulStore.vue
-->
<template>
    <div class="vul-store">
        <Form layout="inline" :model="queryForm" class="mb-4">
            <FormItem label="发布时间">
                <RangePicker format="YYYY-MM-DD HH:mm:ss" style="width: 100%;" v-model:value="queryForm.dateRange" />
            </FormItem>
            <FormItem label="漏洞等级">
                <Select allow-clear v-model:value="queryForm.level" :options="levelList" placeholder="请选择漏洞等级"
                    style="width: 200px" />
            </FormItem>
            <FormItem>
                <Button @click="handleSearch" type="primary">
                    <template #icon>
                        <i class="i-base-search-line align-icon mr-1"></i>
                    </template>
                    查询
                </Button>
            </FormItem>
        </Form>

        <Table :data-source="tableData" row-key="id" bordered :columns="tableColumns" @change="handleTableChange"
            :loading="tableLoading"
            :pagination="{ total, current: currentPage, pageSize: size, showTotal: (total) => `共 ${total} 条 `, showQuickJumper: true, showSizeChanger: true, }" />

    </div>
</template>

<script setup lang="ts">
import { Form, FormItem, RangePicker, Select, Button, Table } from 'ant-design-vue'
import { useVulStore } from '../controller/useVulStore'

const {
    currentPage,
    levelList,
    queryForm,
    size,
    tableLoading,
    tableData,
    tableColumns,
    total,
    handleSearch,
    handleTableChange
} = useVulStore()
</script>