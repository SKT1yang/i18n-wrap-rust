<!--
 * @name: 数据备份
 * @description: 数据备份-数据备份
 * @date: 2023-10-07 16:02:54
 * @path: \front\data-backup\src\views\DataBackup.vue
-->
<template>
    <div class="data-backup">
        <Form layout="inline">
            <FormItem>
                <Button type="primary" @click="handleAddGenerateDate">
                    <i class="i-base-add-line align-icon mr-1"></i>
                    生成备份文件
                </Button>

            </FormItem>
            <FormItem>
                <Upload :file-list="uploadFileList" :before-upload="beforeUpload" :disabled="uploadStatus"
                    :show-upload-list="false" :custom-request="uploadFile" accept=".bin">
                    <Button :loading="uploadStatus">
                        <i class="i-base-upload-line  align-icon mr-1"></i>
                        导入
                    </Button>
                </Upload>
            </FormItem>
            <FormItem>
                <Button danger @click="handleMutilDelete">
                    <i class="i-base-delete-bin-line align-icon mr-1"></i>批量删除
                </Button>
            </FormItem>

        </Form>

        <Table row-key="id" :data-source="tableData" bordered @change="handleTableChange" :columns="tableColumns"
            :row-selection="{ selectedRowKeys, onChange: handleSelectionChange }"
            :pagination="{ total, current: currentPage, pageSize: size, showTotal: (total) => `共 ${total} 条 `, showQuickJumper: true, showSizeChanger: true, }"
            class="mt-4">
            <template #bodyCell="{ column, record, text }">
                <template v-if="column.key === 'status'">
                    <Tag :color="getGenerateStatus(text, 'tagColor')">{{ getGenerateStatus(text) }}</Tag>
                </template>

                <template v-else-if="column.key === 'action'">
                    <Button type="link" size="small" @click="handleDownload(record)">
                        下载
                    </Button>
                    <Popconfirm title="删除后备份无法恢复，确定删除吗？" @confirm="handleDeleteBackup([record.id])">
                        <Button type="link" danger size="small">
                            删除
                        </Button>
                    </Popconfirm>
                </template>
            </template>
        </Table>
        <DataBackupModal v-model:visible="dialogVisible" @refresh="handleSearch" />
    </div>
</template>

<script setup lang="ts">
import { Form, FormItem, Upload, Button, Table, Popconfirm, Tag } from 'ant-design-vue';
import { useDataBackup } from '../controller/useDataBackup'
import DataBackupModal from './DataBackupModal.vue';

const {
    total,
    currentPage,
    size,
    handleTableChange,
    getGenerateStatus,
    tableData,
    tableColumns,
    handleSearch,
    beforeUpload,
    uploadFile,
    uploadFileList,
    uploadStatus,
    handleDownload,
    selectedRowKeys,
    handleSelectionChange,
    handleDeleteBackup,
    handleMutilDelete,
    dialogVisible,
    handleAddGenerateDate
} = useDataBackup()
</script>