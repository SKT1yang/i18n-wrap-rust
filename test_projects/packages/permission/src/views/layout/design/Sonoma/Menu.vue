<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <InlineMenu :items="permissionStore.getMenuList" @menu-click="handleMenuClick" />
</template>

<script lang="ts" setup>
import { go } from '@guolisec/routerable'
import InlineMenu from '../../../../views/menu/inline/InlineMenu.tsx';
import { usePermissionStore } from '../../../../model/store';

const permissionStore = usePermissionStore()
function handleMenuClick(key: string) {
  go({
    path: key
  })
}
</script>