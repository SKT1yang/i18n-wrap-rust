<!--
 * @Name: 角色管理
 * @Description: 用户管理-角色管理
-->
<template>
  <div class="role space-y-5">
    <Form layout="inline" :model="queryForm">
      <FormItem>
        <Input v-model:value="queryForm.name" :placeholder="t('请输入角色名')" allowClear />
      </FormItem>
      <FormItem>
        <div class="space-x-5">
          <Button @click="getDataList">
            <i class="i-base-search align-icon"></i>
            <span>{{ t('查询') }}</span>
          </Button>
          <Button v-if="currentUser && ['特权系统管理员', '系统管理员'].includes(currentUser.roleName)" type="primary"
            @click="handleCreateRole">
            <i class="i-base-plus align-icon"></i>
            <span>{{ t('新增角色') }}</span>
          </Button>
        </div>
      </FormItem>
    </Form>

    <Table :data-source="dataList" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'acountNum'">
          {{ record.acountNum || 0 }}个
        </template>
        <div v-if="column.key === 'action'" class="space-x-5">
          <Button @click="handleModifyRole(record)" type="text">{{ t('修改角色') }}</Button>
          <Button @click="handleModifyRolePermission(record)" type="text">{{ t('修改权限') }}</Button>
          <Button @click="handleDeleteRole(record)" type="text" v-if="!['系统管理员', '安全管理员', '安全审计员'].includes(record.name)"
            danger>{{ t('删除') }}</Button>
        </div>
      </template>
    </Table>

    <!-- 新增用户弹窗 -->
    <UpdateRoleModal v-model:visible="dialogVisible" :current="current" @refresh="getDataList" />
    <!-- 授权弹窗 -->
    <RolePermissionModal v-model:visible="permissionVisible" :current="current" @refresh="getDataList" />
  </div>
</template>
<script setup lang="ts">
/* 类型文件 */
import type { PropType } from 'vue';
import type { SystemInfo } from '@guolisec/types';
import type { ColumnProps } from "ant-design-vue/es/table";
/* 第三方模块 */
import { ref, computed } from 'vue'
import { Button, Form, FormItem, Input, Table, Modal } from 'ant-design-vue'
/* 本地模块 */
import UpdateRoleModal from './UpdateRoleModal.vue';
import RolePermissionModal from './RolePermissionModal.vue';
import { useRole } from '../../controller/useRole';
import { deleteRole } from '../../service/role';
import { t } from '@/languages/useLanguage'

// 父组件传值
const props = defineProps({
  systemInfo: {
    type: Object as PropType<SystemInfo>,
    default: () => { }
  },
  scope: {
    type: String as PropType<'all' | 'normal'>,
    default: 'normal',
  },
});

const current = ref()
const dialogVisible = ref(false)
const permissionVisible = ref(false)
const columns = computed<ColumnProps[]>(() => {
  return [
    {
      title: t("角色名"),
      dataIndex: "name",
      key: "name",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("账号数"),
      dataIndex: "acountNum",
      key: "acountNum",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("备注"),
      dataIndex: "remark",
      key: "remark",
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
  dataList,
  getDataList,
  currentUser
} = useRole(props)

function handleCreateRole() {
  current.value = {}
  dialogVisible.value = true
}

function handleModifyRole(row) {
  current.value = row
  dialogVisible.value = true
}

function handleDeleteRole(row) {
  Modal.confirm({
    title: t("提示"),
    content: t("删除前请确认已没有系统使用该页面，确认删除?"),
    okText: t('确定'),
    cancelText: t('取消'),
    type: "warning",
    async onOk() {
      await deleteRole({
        id: row.id
      })
      getDataList()
    }
  });
}

function handleModifyRolePermission(row) {
  current.value = row
  permissionVisible.value = true
}
</script>
