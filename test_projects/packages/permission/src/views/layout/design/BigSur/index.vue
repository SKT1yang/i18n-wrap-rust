<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <HeaderContainer class="bigsur">
    <template #header>
      <slot name="logo">
        <Logo />
      </slot>
      <div class="flex-end flex-1">
        <slot name="time">
          <Time />
        </slot>
        <slot name="menu">
          <Menu />
        </slot>
        <slot name="avatar">
          <Avatar />
        </slot>
      </div>
    </template>

    <template #main>
      <div class="color-$color-text-tertiary flex-between h-12" v-if="props.showBreadcrumb">
        <slot name="avatar">
          <Breadcrumb />
        </slot>
      </div>
      <div class="w-fit min-w-full min-h-full">
        <Page />
      </div>
    </template>
  </HeaderContainer>
</template>
<script lang="ts" setup>
import Logo from '../../components/Logo.vue';
import Time from '../../components/Time.vue';
import Breadcrumb from '../../components/Breadcrumb.vue';
import Menu from './Menu/index.vue'
import Avatar from '../../components/Avatar.vue'
import HeaderContainer from '../../container/HeaderContainer.vue';
import Page from '../../components/Page.vue';

const props = defineProps({
  // 是否显示面包屑
  showBreadcrumb: {
    type: Boolean,
    default: false
  },
});
</script>
