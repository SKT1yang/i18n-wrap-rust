<!--
 * @name: Do not edit
 * @description: Do not edit
-->

<template>
  <div class="p-10 space-y-4">
    <Form layout="inline">
      <FormItem>
        <Button type="primary" @click="handleCreate">新增</Button>
      </FormItem>
      <FormItem>
        <Button @click="doSearch">
          <i class="i-base-search align-icon"></i>
          <span>查询</span>
        </Button>
      </FormItem>
    </Form>

    <Table :data-source="dataList" :columns="columns" row-key="id" :pagination="false">
      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'icon'">
          <i :class="record.icon"></i>{{ record.icon }}
        </template>

        <template v-if="column.key === 'hideMenu'">
          <Tag :color="record.hideMenu ? 'error' : 'success'">
            {{ record.hideMenu ? '隐藏' : '显示' }}
          </Tag>
        </template>

        <template v-if="column.key === 'action'">
          <div class="space-x-5">
            <Button @click="handleModify(record)" type="primary">修改</Button>
            <Button @click="handleDelete([record])" danger>删除</Button>
          </div>
        </template>
      </template>
    </Table>

    <RouteModifyModal v-model:visible="modifyVisible" :current="current" :system-id="props.current.id"
      @refresh="doSearch" />
    <RouteCreateModal v-model:visible="createVisible" :current="current" :system-id="props.current.id"
      @refresh="doSearch" />
  </div>
</template>
<script setup name="Permission" lang="ts">
import type { PropType } from 'vue';
import type { SystemInfo, PermissionTreeItem } from '@guolisec/types';
import type { ColumnProps } from "ant-design-vue/es/table";
import {
  Button,
  Form,
  FormItem,
  Table,
  Tag
} from 'ant-design-vue';
import { useRoute } from '../../controller/useRoute';
import RouteModifyModal from './RouteModifyModal.vue';
import RouteCreateModal from './RouteCreateModal.vue';
import { ref, } from "vue";


// 父组件传值
const props = defineProps({
  current: {
    type: Object as PropType<SystemInfo>,
    default: () => { }
  },
});

const columns = ref<ColumnProps<PermissionTreeItem>[]>([
  {
    title: "唯一标识name",
    dataIndex: "name",
    key: "name",
    align: "center",
    ellipsis: true,
  },
  {
    title: "菜单名单",
    dataIndex: "title",
    key: "title",
    align: "center",
    ellipsis: true,
  },
  {
    title: "图标",
    dataIndex: "icon",
    key: "icon",
    align: "center",
    ellipsis: true,
  },
  {
    title: "路径",
    dataIndex: "path",
    key: "path",
    align: "center",
    ellipsis: true,
  },
  {
    title: "组件",
    dataIndex: "component",
    key: "component",
    align: "center",
    ellipsis: true,
  },
  {
    title: "序号",
    dataIndex: "orderNo",
    key: "orderNo",
    align: "center",
    ellipsis: true,
  },
  {
    title: "显示状态",
    dataIndex: "hideMenu",
    key: "hideMenu",
    align: "center",
    ellipsis: true,
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    align: "center",
    ellipsis: true,
  },
]);

const {
  dataList,
  current,
  createVisible,
  modifyVisible,
  doSearch,
  handleCreate,
  handleModify,
  handleDelete
} = useRoute(props)
</script>
