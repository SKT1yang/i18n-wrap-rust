<!--
 * @name: 菜单项
 * @description: Do not edit
-->
<template>
  <div :key="item.path">
    <MenuItemContent v-bind="$props" :item="item" />
  </div>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import type { MenuItem } from '@guolisec/types'
import { defineComponent } from 'vue';
import MenuItemContent from './MenuItemContent.vue';

export default defineComponent({
  name: 'BasicMenuItem',
  components: { MenuItemContent },
  props: {
    item: {
      type: Object as PropType<MenuItem>,
      default: () => ({}),
    },
  },
});
</script>
