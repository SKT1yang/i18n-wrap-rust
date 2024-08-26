<!--
 * @name: 用户头像和名称
 * @description: 点击下拉可以：1.修改密码 2.退出登录
-->
<template>
  <Dropdown popper-class="menu-popover">
    <div class="flex-center cursor-pointer text-white">
      <i class="i-base-user text-xl mr-2"></i>
      <span class="text-base">{{ username }}</span>
    </div>
    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem key="UpdatePassword">
        <span>{{ t('修改密码') }}</span>
        </MenuItem>
        <MenuItem key="Logout">
        <span>{{ t('退出') }}</span>
        </MenuItem>
      </Menu>
    </template>
  </Dropdown>
  <!-- 修改密码弹窗 -->
  <UpdatePasswordModal v-model:visible="updateVisible" :current="current" />
</template>

<script lang="ts" setup>
import type { MenuProps } from 'ant-design-vue';
import { computed, ref } from 'vue';
import { Modal, Dropdown, Menu, MenuItem } from 'ant-design-vue'
import { usePermissionStore } from '../../../model/store'
import { logout } from '../../../service/login'
import UpdatePasswordModal from '../../User/UpdatePasswordModal.vue';
import { t } from '@/languages/useLanguage'

const permissionStore = usePermissionStore()
const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
  if (key === 'Logout') {
    Modal.confirm({
      title: t('提示'),
      content: t('确认退出？'),
      okText: t('确定'),
      cancelText: t('取消'),
      onOk() {
        logout(t('成功退出'))
      }
    })
  }

  if (key === 'UpdatePassword') {
    current.value = {
      username: username.value,
    }
    updateVisible.value = true
  }
}

const username = computed(() => {
  return permissionStore.getUserInfo && permissionStore.getUserInfo.username
})

const updateVisible = ref(false)
const current = ref()
</script>