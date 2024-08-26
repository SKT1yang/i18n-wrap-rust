<template>
  <AMenuItem :key="item.path">
    <template #icon>
      <Icon :icon="getIcon"></Icon>
    </template>
    {{ getName }}
  </AMenuItem>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { MenuItem as AMenuItem } from "ant-design-vue";
import type { PropType } from "vue";
import type { MenuItem as MenuItemType } from "@guolisec/types";
import Icon from "../Icon.vue";

export default defineComponent({
  name: "InlineMenuItem",
  components: {
    AMenuItem,
    Icon
  },
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
    // todo 1. 支持更多的图标类型
    const getIcon = computed(() => props.item.icon);
    return {
      getName,
      getIcon
    }
  },
});
</script>
