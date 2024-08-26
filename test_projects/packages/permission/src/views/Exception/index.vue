<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <div class="flex items-center flex-col justify-center h-screen">
    <i class="i-base-not-found mb-4 text-25em"></i>
    <template v-if="permissionLsit.length">
      <span class="text-2xl mb-4">404</span>
      <span class="mb-4">{{ t('抱歉，您访问的页面不存在') }}。</span>
      <Button type="primary" @click="handleGo">{{ t('返回首页') }}</Button>
    </template>
    <template v-else>
      <span class="text-2xl mb-4">{{ t('无权限') }}</span>
      <span class="mb-4">{{ t('抱歉，您当前的账号没有访问权限，请联系管理员更新权限设置。') }}</span>
      <Button type="primary" @click="handleLogout">{{ t('退出登录') }}</Button>
    </template>

  </div>
</template>

<script lang="ts" setup>
import { Button } from 'ant-design-vue';
import { go } from "@guolisec/routerable"
import { t } from '@/languages/useLanguage'
import { logout } from '../../service/login';
import { usePermissionStoreWithOut } from '../../model/store';

const permissionStore = usePermissionStoreWithOut()

const permissionLsit = permissionStore.getPermissionInfo

function handleGo() {
  go('/')
}

function handleLogout() {
  logout()
}
</script>
