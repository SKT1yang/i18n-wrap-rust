<!--
 * @name: 菜单项内容
 * @description: Do not edit
-->
<template>
  <div class="cursor-pointer vc-menu-content" @click="handleClick">
    <Icon :icon="getIcon" class="vc-menu-icon"></Icon>
    {{ getName }}
    <span v-if="showArrow">></span>
  </div>
</template>
<script lang="ts">
import type { PropType } from 'vue'
import type { MenuItem } from '@guolisec/types'
import { computed, defineComponent } from 'vue';
import Icon from './Icon.vue';

export default defineComponent({
  name: 'MenuItemContent',
  components: {
    Icon
  },
  props: {
    item: {
      type: Object as PropType<MenuItem>,
      default() {
        return {}
      },
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    showArrow: {
      type: Boolean,
      default: false
    },
  },
  setup(props, { emit }) {
    const getName = computed(() => {
      return props.item?.name
    });
    // todo 1. 支持更多的图标类型
    const getIcon = computed(() => props.item.icon);
    function handleClick() {
      emit('menu-click', props.item)
    }
    return {
      getIcon,
      getName,
      handleClick
    };
  },
});
</script>
