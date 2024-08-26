<!--
 * @name: 数据快照
 * @description: 数据备份
 * @date: 2023-10-10 10:51:53
 * @path: \front\data-backup\src\views\DataSnapshot.vue
-->
<template>
  <div>
    <Form layout="inline" :model="queryForm">
      <FormItem>
        <Popconfirm
          title="确定要创建快照吗?"
          ok-text="确认"
          cancel-text="取消"
          @confirm="handleCreate"
        >
          <Button type="primary" :loading="createButtonStatus">
            <i class="i-base-add-line align-icon mr-1"></i>创建快照</Button
          >
        </Popconfirm>
      </FormItem>
      <FormItem>
        <RangePicker
          v-model:value="queryForm.dateRange"
          :show-time="showTime"
          :allow-clear="false"
        />
      </FormItem>
      <FormItem>
        <Button @click="handleSearch">
          <i class="i-base-search-line align-icon mr-1"></i>查询
        </Button>
      </FormItem>
    </Form>

    <Table
      row-key="id"
      :data-source="tableData"
      bordered
      @change="handleTableChange"
      :columns="tableColumns"
      :pagination="{
        total,
        current: currentPage,
        pageSize: 10,
        showTotal: (total) => `共 ${total} 条 `,
        showQuickJumper: true,
        showSizeChanger: false
      }"
      class="mt-4"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Popconfirm title="确定要恢复到快照吗？" @confirm="handleRecover(record)">
            <Button type="link" size="small" :disabled="record.isRecover"> 恢复到快照 </Button>
          </Popconfirm>
          <Popconfirm title="确定要删除快照吗？" @confirm="handleDelete(record)">
            <Button type="link" danger size="small"> 删除 </Button>
          </Popconfirm>
        </template>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { Form, FormItem, RangePicker, Button, Popconfirm, Table } from 'ant-design-vue'
import { useDataSnapshot } from '../controller/useDataSnapshot'

const {
  queryForm,
  total,
  currentPage,
  // size,
  handleTableChange,
  showTime,
  tableData,
  tableColumns,
  handleSearch,
  createButtonStatus,
  handleCreate,
  handleRecover,
  handleDelete
} = useDataSnapshot()
</script>
