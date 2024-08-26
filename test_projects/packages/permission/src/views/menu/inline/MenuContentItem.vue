<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-07-20 13:23:16
 * @path: \permission\src\views\menu\inline\MenuContentItem.vue
-->
<template>
  <div :key="item.path">
    {{ getName }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import type { PropType } from "vue";
import type { MenuItem as MenuItemType } from "@guolisec/types";

export default defineComponent({
  name: "InlineMenuContentItem",
  props: {
    item: {
      type: Object as PropType<MenuItemType>,
      default: () => ({}),
    },
  },
  setup(props) {
    const getName = computed(() => {
      return props.item?.name;
    });
    return {
      getName
    }
  },
});
</script>
