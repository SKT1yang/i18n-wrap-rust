<!--
 * @name: 布局组件
 * @description: Do not edit
-->
<template>
  <HeaderSideContainer>
    <template #header>
      <slot name="logo">
        <Logo />
      </slot>
      <div class="flex-end flex-1 space-x-4">
        <slot name="customHeader"></slot>
        <slot name="avatar">
          <Avatar />
        </slot>
      </div>
    </template>

    <template #aside>
      <slot name="menu">
        <Menu />
      </slot>
    </template>

    <template #main>
      <Page />
    </template>
  </HeaderSideContainer>
</template>
<script lang="ts" setup>
/* 类型文件 */

/* 第三方模块 */
/* 本地共享模块 */

/* 业务模块 */
import Logo from '../../components/Logo.vue';
import Avatar from '../../components/Avatar.vue'
import HeaderSideContainer from '../../container/HeaderSideContainer.vue';
import Menu from './Menu.vue';
import Page from '../../components/Page.vue';

</script>
