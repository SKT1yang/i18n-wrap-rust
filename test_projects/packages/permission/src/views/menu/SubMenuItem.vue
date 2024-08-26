<!--
 * @Name: 递归二级菜单项
 * @Description: Do not edit
 * @Author: ygd
 * @Date: 2022-03-17 16:02:25
 * @LastEditTime: 2023-05-15 13:21:49
 * @LastEditors: Please set LastEditors
-->
<template>
  <SubMenu class="vc-sub-menu" v-bind="$props" v-if="getShowMenu">
    <MenuItemContent @menu-click="handleClick" :item="item" />
    <template #popper v-if="menuHasChildren(item)">
      <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
        <SubMenuItem :item="childrenItem" placement="right-start" instance-move @menu-click="handleClick" />
      </template>
    </template>
  </SubMenu>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import type { MenuItem as MenuType } from '@guolisec/types'
import { defineComponent, computed } from 'vue';
import MenuItemContent from './MenuItemContent.vue';

import type { Placement } from 'floating-vue'
import { Menu as SubMenu } from 'floating-vue'

import 'floating-vue/dist/style.css'

export default defineComponent({
  name: 'SubMenuItem',
  isSubMenu: true,
  components: {
    SubMenu,
    MenuItemContent,
  },
  props: {
    item: {
      type: Object as PropType<MenuType>,
      default: () => { },
    },
    placement: {
      type: String as PropType<Placement>,
      default: 'bottom'
    },
  },
  setup(props, { emit }) {

    const getShowMenu = computed(() => !props.item.hideMenu);
    function menuHasChildren(menuTreeItem: MenuType): boolean {
      return (
        !menuTreeItem.meta?.hideChildrenInMenu &&
        Reflect.has(menuTreeItem, 'children') &&
        !!menuTreeItem.children &&
        menuTreeItem.children.length > 0
      );
    }

    function handleClick(item: MenuType) {
      emit('menu-click', item)
    }

    return {
      handleClick,
      menuHasChildren,
      getShowMenu,
    };
  },
});
</script>

<style>
.v-popper__arrow-container {
  display: none;
}
</style>
