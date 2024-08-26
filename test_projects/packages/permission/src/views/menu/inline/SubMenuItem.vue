<!--
 * @Name: 递归二级菜单项
 * @Description: Do not edit
-->
<template>
  <MenuItem v-if="!menuHasChildren(item) && getShowMenu" v-bind="$props" :item="item" />
  <SubMenu v-if="menuHasChildren(item) && getShowMenu" :key="`submenu-${item.path}`" :title="item.name">
    <template #icon>
      <Icon :icon="item.icon"></Icon>
    </template>
    <template #title>
      <MenuContentItem @click="handleClick" v-bind="$props" :item="item" />
    </template>

    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <SubMenuItem v-bind="$props" :item="childrenItem" :naive="false" />
    </template>
  </SubMenu>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import type { MenuItem as MenuType } from '@guolisec/types'
import { go } from '@guolisec/routerable'
import { defineComponent, computed } from 'vue';
import MenuItem from './MenuItem.vue';
import MenuContentItem from './MenuContentItem.vue';
import { Menu } from 'ant-design-vue'
import Icon from '../Icon.vue';

export default defineComponent({
  name: 'SubMenuItem',
  isSubMenu: true,
  components: {
    MenuItem,
    MenuContentItem,
    SubMenu: Menu.SubMenu,
    Icon,
  },
  props: {
    item: {
      type: Object as PropType<MenuType>,
      default: () => { },
    },
    naive: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const getShowMenu = computed(() => !props.item.hideMenu);
    function menuHasChildren(menuTreeItem: MenuType): boolean {
      return (
        !menuTreeItem.meta?.hideChildrenInMenu &&
        Reflect.has(menuTreeItem, 'children') &&
        !!menuTreeItem.children &&
        menuTreeItem.children.length > 0
      );
    }

    function handleClick() {
      // 一级菜单支持跳转
      if (props.item?.meta?.hasChildClick) {
        go(props.item?.meta?.hasChildClick, {
          isMsg: false,
        });
      }
    }

    return {
      handleClick,
      menuHasChildren,
      getShowMenu,
    };
  },
});
</script>
