<!--
 * @name: Do not edit
 * @description: Do not edit
-->

<template>
  <div class="p-10 space-y-5">
    <Form layout="inline" :model="queryForm">
      <FormItem :label="t('唯一标识name')">
        <Input v-model:value="queryForm.name" :placeholder="t('请输入唯一标识name')" allowClear />
      </FormItem>
      <FormItem :label="t('菜单名称')">
        <Input v-model:value="queryForm.title" :placeholder="t('请输入菜单名称')" allowClear />
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleCreate">{{ t('新增') }}</Button>
      </FormItem>
      <FormItem>
        <Button @click="doSearch" class="leading-4">
          <template #icon>
            <i class="i-base-search align-icon"></i>
          </template>
          <span>{{ t('查询') }}</span>
        </Button>
      </FormItem>
    </Form>

    <Table :data-source="dataList" :columns="columns" :pagination="pagination" @change="handleTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'icon'">
          <i :class="record.icon"></i>{{ record.icon }}
        </template>

        <template v-if="column.key === 'hideMenu'">
          <Tag :color="record.hideMenu ? 'error' : 'success'">
            {{ record.hideMenu ? t('离线') : t('在线') }}
          </Tag>
        </template>

        <template v-if="column.key === 'action'">
          <Button @click="handleModify(record)" class="mr-5" type="primary">{{ t('修改') }}</Button>
          <Button @click="handleDelete([record])" danger>{{ t('删除') }}</Button>
        </template>
      </template>
    </Table>

    <PermissionUpdateModal v-model:visible="updateVisible" :current="current" :mode="mode" @refresh="getDataList" />
  </div>
</template>
<script setup name="Permission" lang="ts">
/* 类型文件 */
import type { ColumnsType } from "ant-design-vue/es/table";
import type { PermissionItem } from "@guolisec/types";
/* 第三方模块 */
import { computed } from "vue";
import { Button, Form, FormItem, Input, Table, Tag } from 'ant-design-vue'
/* 本地模块 */
import { usePermission } from '../../controller/usePermission';
import PermissionUpdateModal from './PermissionUpdateModal.vue';
import { t } from '@/languages/useLanguage'

const columns = computed<ColumnsType<PermissionItem>>(() => {
  return [
    {
      title: t("唯一标识name"),
      dataIndex: "name",
      key: "name",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("菜单名单"),
      dataIndex: "title",
      key: "title",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("图标"),
      dataIndex: "icon",
      key: "icon",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("路径"),
      dataIndex: "path",
      key: "path",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("组件"),
      dataIndex: "component",
      key: "component",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("序号"),
      dataIndex: "orderNo",
      key: "orderNo",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("显示状态"),
      dataIndex: "hideMenu",
      key: "hideMenu",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("操作"),
      dataIndex: "action",
      key: "action",
      align: "center",
      ellipsis: true,
    },
  ]
});

const {
  queryForm,
  pagination,
  dataList,
  current,
  updateVisible,
  mode,
  doSearch,
  getDataList,
  handleTableChange,
  handleCreate,
  handleModify,
  handleDelete
} = usePermission()
</script>
