<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <div class="flex-center">
    <HorizontalMenu :items="permissionStore.getMenuList" primaryBgColor="transparent" primary-font-color="#fff"
      @menu-click="handleMenuClick" />
  </div>
</template>

<script lang="ts" setup>
import { go } from '@guolisec/routerable'
import HorizontalMenu from '../../../../../views/menu/HorizontalMenu.vue';
import { usePermissionStore } from '../../../../../model/store';
import type { MenuItem } from '@guolisec/types';

const permissionStore = usePermissionStore()

function handleMenuClick(item: MenuItem) {
  handleGo(item.routeName)
}

function handleGo(name) {
  go({
    name
  })
}

</script>