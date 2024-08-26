<!--
 * @name: Do not edit
 * @description: Do not edit
-->

<template>
  <div class="p-10 space-y-5">
    <Form layout="inline">
      <FormItem>
        <Button type="primary" @click="handleCreate">{{ t('新增') }}</Button>
      </FormItem>
      <FormItem>
        <Button @click="getDataList">
          <i class="i-base-search align-icon"></i>
          <span>{{ t('查询') }}</span>
        </Button>
      </FormItem>
    </Form>

    <Table :data-source="dataList" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'active'">
          <Tag :color="record.active ? 'success' : 'error'">
            {{ record.active ? t('在线') : t('离线') }}
          </Tag>
        </template>
        <div v-if="column.key === 'action'" class="space-x-2">
          <Button @click="handleModify(record)">{{ t('修改') }}</Button>
          <Button @click="handleRoute(record)">{{ t('配置路由') }}</Button>
          <Button @click="handleRole(record)">{{ t('配置角色') }}</Button>
          <Button @click="handleUser(record)">{{ t('配置用户') }}</Button>
          <Button @click="handleSwitchSystem(record)">{{ t('切换系统') }}</Button>
          <Button @click="handleDelete([record])" danger>{{ t('删除') }}</Button>
        </div>
      </template>
    </Table>

    <SystemUpdateModal v-model:visible="updateVisible" :current="current" :mode="mode" @refresh="getDataList" />
    <RouteModal v-model:visible="routeVisible" :current="current" @refresh="getDataList" />
    <RoleModal v-model:visible="roleVisible" :current="current" @refresh="getDataList" />
    <UserModal v-model:visible="userVisible" :current="current" @refresh="getDataList" />
  </div>
</template>
<script setup name="System" lang="ts">
/* 类型文件 */
import type { ColumnProps } from "ant-design-vue/es/table";
/* 第三方模块 */
import {
  Button,
  Form,
  FormItem,
  Table,
  Tag
} from 'ant-design-vue';
import { computed } from 'vue'
/* 本地模块 */
import { t } from '@/languages/useLanguage'
import { useSystem } from '../../controller/useSystem';
import SystemUpdateModal from './SystemUpdateModal.vue';
import RouteModal from '../Route/RouteModal.vue';
import RoleModal from '../Role/RoleModal.vue';
import UserModal from '../User/UserModal.vue';


const columns = computed<ColumnProps[]>(() => {
  return [
    {
      title: t("系统名称"),
      dataIndex: "sysName",
      key: "sysName",
      align: "center",
      ellipsis: true,
    },
    {
      title: "clientId",
      dataIndex: "clientId",
      key: "clientId",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("规格型号"),
      dataIndex: "model",
      key: "model",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("系统首页路径"),
      dataIndex: "homePageUrl",
      key: "homePageUrl",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("系统描述"),
      dataIndex: "description",
      key: "description",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("系统激活状态"),
      dataIndex: "active",
      key: "active",
      align: "center",
      ellipsis: true,
      width: 120,
    },
    {
      title: t("操作"),
      dataIndex: "action",
      key: "action",
      align: "center",
      ellipsis: true,
      width: 750,
    },
  ]
});

const {
  dataList,
  current,
  updateVisible,
  routeVisible,
  roleVisible,
  userVisible,
  mode,
  getDataList,
  handleCreate,
  handleModify,
  handleDelete,
  handleRoute,
  handleRole,
  handleUser,
  handleSwitchSystem
} = useSystem()
</script>
