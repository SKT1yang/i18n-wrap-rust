<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-04-12 11:09:29
 * @path: \feature-vue\platform\front\system\src\views\upgrade\SystemUpgrade.vue
-->
<template>
  <!-- :before-upload="beforeUpload"  :on-success="handleUpdateSuccess" :on-error="handleError" -->
  <div class="flex mb-2">
    <div class="flex flex-col">
      <Upload :file-list="fileList" :before-upload="beforeUpload" :disabled="progressShow" accept=".bin"
        @remove="handleRemove">
        <Button :disabled="fileList.length !== 0">选取更新文件</Button>
      </Upload>

      <Progress v-show="progressShow" :percent="percentage" :stroke-width="4" class="w-50 my-4" />
    </div>

    <Button :disabled="fileList.length === 0 || progressShow" class="ml-2" @click="handleUpload">更新</Button>

    <Button @click="dialogVisible = true" class="ml-2">更新详情</Button>

    <Popconfirm title="确定要重启设备吗?" ok-text="确认" cancel-text="取消" @confirm="rebootEquip">
      <Button class="ml-2" danger>重启设备</Button>
    </Popconfirm>

  </div>
  <Table :data-source="tableData" bordered :columns="columns" :pagination="pagination" @change="handleTableChange">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'createTime'">
        {{ record.createTime ? formatToDateTime(record.createTime) : '' }}
      </template>
    </template>
  </Table>
  <SystemUpgradeDetailModal v-model:visible="dialogVisible" />
</template>

<script lang="ts" setup>
import type { ColumnProps } from "ant-design-vue/es/table";
import { ref } from 'vue'
import { Button, Table, Upload, Progress, Popconfirm } from 'ant-design-vue';
import { useSystemUpgrade } from '../../controller/upgrade/useSystemUpgrade'
import SystemUpgradeDetailModal from './SystemUpgradeDetailModal.vue'

const {
  fileList,
  tableData,
  pagination,
  dialogVisible,
  percentage,
  progressShow,
  beforeUpload,
  handleUpload,
  formatToDateTime,
  rebootEquip,
  handleRemove,
  handleTableChange,
} = useSystemUpgrade()

const columns = ref<ColumnProps[]>([
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    align: "center",
    ellipsis: true,
  },
  {
    title: "升级时间",
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    ellipsis: true,
    width: 300
  },
]);
</script>