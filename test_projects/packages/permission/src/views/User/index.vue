<!--
 * @Name: 用户管理
 * @Description: 用户管理-用户管理
-->
<template>
  <div class="user space-y-4">
    <Form layout="inline" :model="queryForm">
      <FormItem>
        <Input v-model:value="queryForm.username" :placeholder="t('请输入账号名称')" allowClear />
      </FormItem>
      <FormItem>
        <Input v-model:value="queryForm.name" :placeholder="t('请输入姓名')" allowClear />
      </FormItem>
      <FormItem>
        <Input v-model:value="queryForm.phone" :placeholder="t('请输入手机号')" allowClear />
      </FormItem>
      <FormItem>
        <Select v-model:value="queryForm.roleId" :placeholder="t('请选择角色')" allowClear
          :dropdown-match-select-width="false">
          <SelectOption v-for="item in roleList" :value="item.id" :key="item.id" :title="item.name">
            {{ item.name }}
          </SelectOption>
        </Select>
      </FormItem>
      <FormItem>
        <div class="flex space-x-4">
          <Button @click="doSearch">
            <i class="i-base-search align-icon "></i>
            <span>{{ t('查询') }}</span>
          </Button>
          <Button v-if="currentUser && ['特权系统管理员'].includes(
            currentUser.roleName,
          )" @click="handleSetFaildNum">
            <i class="i-base-setting align-icon mr-1"></i>
            <span>{{ t('鉴别次数') }}</span>
          </Button>
          <Button v-if="currentUser && ['特权系统管理员', '系统管理员'].includes(
            currentUser.roleName,
          )
            " type="primary" @click="handleCreateUser">
            <i class="i-base-plus align-icon"></i>
            <span>{{ t('新增账号') }}</span>
          </Button>
        </div>
      </FormItem>
    </Form>

    <Table :data-source="dataList" :columns="columns" :pagination="pagination" @change="handleTableChange">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'icon'">
          <i :class="record.icon"></i>{{ record.icon }}
        </template>

        <template v-if="column.key === 'online'">
          <Tag :color="record.online ? 'success' : 'error'">
            {{ record.online ? t('在线') : t('离线') }}
          </Tag>
        </template>

        <template v-if="column.key === 'action'">
          <Button type="text" @click="handleResetPsw(record)" v-if="record.privilege === 1 &&
            currentUser && ['特权系统管理员'].includes(currentUser.roleName)">{{ t('重置密码') }}</Button>

          <Button type="text" @click="handleUserAuth(record)" v-if="record.privilege === 1 &&
            currentUser && ['系统管理员', '特权系统管理员'].includes(currentUser.roleName)">{{ t('授权') }}</Button>

          <Button type="text" @click="handleBind(record)" :disabled="bindedUsernameList.includes(record.username)">
            {{ t('绑定 USBKey') }}
          </Button>

          <Button type="text" @click="handleLogout(record)"
            v-if="currentUser && ['系统管理员', '特权系统管理员'].includes(currentUser.roleName)" :disabled="!record.online" danger>{{
              t('登出') }}</Button>

          <Button type="text" @click="handleDeleteUser(record)" v-if="record.privilege === 1 &&
            currentUser && ['系统管理员', '特权系统管理员'].includes(currentUser.roleName)" danger>{{ t('删除') }}</Button>

        </template>
      </template>
    </Table>


    <!-- 新增用户弹窗 -->
    <CreateUserModal v-model:visible="createVisible" @refresh="doSearch" />
    <!-- 鉴别次数弹窗 -->
    <UserFailNunberModal v-model:visible="failVisible" @refresh="doSearch" />
    <!-- 授权弹窗 -->
    <AuthModal v-model:visible="authVisible" :current="current" @refresh="doSearch" />
    <!-- 重置密码弹窗 -->
    <ResetPswModal v-model:visible="resetVisible" :current="current" @refresh="doSearch" />
    <!-- 用户绑定subkey弹窗 -->
    <ModalUsbKeyBindUser v-model:visible="bindVsible" type="bind" :record="current" @refresh="getBindRelation" />
  </div>
</template>
<script setup name="User" lang="ts">
/* 类型文件 */
import type { PropType } from 'vue';
import type { SystemInfo } from '@guolisec/types';
import type { ColumnProps } from "ant-design-vue/es/table";
/* 第三方模块 */
import { ref, onMounted, computed } from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Table,
  Tag,
  Modal
} from 'ant-design-vue';
import { message } from '@guolisec/toast'
import { ModalUsbKeyBindUser, useGetBindRelation, enumSnList } from '@guolisec/usb-key';
/* 本地模块 */
import CreateUserModal from './CreateUserModal.vue';
import UserFailNunberModal from './UserFailNunberModal.vue';
import ResetPswModal from './ResetPswModal.vue';
import AuthModal from './AuthModal.vue'
import { useUser } from '../../controller/useUser';
import { deleteUser, revokeUsers } from '../../service/user';
import { getRoleList } from '../../service/role';
import { usePermissionStoreWithOut } from '../../model/store'
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

const permissionStore = usePermissionStoreWithOut()
const current = ref()
const createVisible = ref(false)
const resetVisible = ref(false)
const authVisible = ref(false)


const {
  queryForm,
  dataList,
  roleList,
  pagination,
  currentUser,
  doSearch,
  handleTableChange,
} = useUser()

const columns = computed<ColumnProps[]>(() => {
  return [
    {
      title: t("账号"),
      dataIndex: "username",
      key: "username",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("姓名"),
      dataIndex: "name",
      key: "name",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("手机号"),
      dataIndex: "phone",
      key: "phone",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("角色"),
      dataIndex: "roleName",
      key: "roleName",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("创建时间"),
      dataIndex: "createTime",
      key: "createTime",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("在线状态"),
      dataIndex: "online",
      key: "online",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("操作"),
      dataIndex: "action",
      key: "action",
      align: "center",
      ellipsis: true,
      width: 550
    },
  ]
});

function handleCreateUser() {
  createVisible.value = true
}

function handleDeleteUser(row) {
  Modal.confirm({
    title: t('提示'),
    content: t('确定删除该用户？'),
    okText: t('确定'),
    cancelText: t('取消'),
    async onOk() {
      const msg: string = await deleteUser({
        id: row.id
      })
      message.success(msg);
      doSearch()
    },
  })
}

function handleResetPsw(row) {
  current.value = row
  resetVisible.value = true
}

function handleUserAuth(row) {
  current.value = row
  authVisible.value = true
}
const { bindedUsernameList, getBindRelation } = useGetBindRelation()
const bindVsible = ref(false)

async function handleBind(record) {
  const snList = await enumSnList();
  if (snList.length === 0) {
    message.error(t("请插入USB Key"));
    return;
  }
  current.value = record
  bindVsible.value = true
}

async function getRole() {
  const systemId = props.systemInfo?.id || permissionStore.getSystemInfo?.id
  if (systemId) {
    const { all } = await getRoleList()
    roleList.value = all;
  }
}

async function handleLogout(row) {
  const response = await revokeUsers({
    username: row.username,
    clientId: 'client', // 目前固定 todo
    // clientId: permissionStore.getSystemInfo.clientId,
  })
  if (response) {
    message.success(t('登出成功'))
  } else {
    message.warning(t('登出失败'))
  }
  doSearch()
}

const failVisible = ref(false)
function handleSetFaildNum() {
  failVisible.value = true
}

onMounted(() => {
  getRole()
})
</script>
