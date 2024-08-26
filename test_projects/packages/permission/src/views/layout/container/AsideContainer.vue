<!--
 * @name: 侧边栏布局容器
 * @description: Do not edit
 * @date: 2023-02-10 09:47:54
 * @path: \permission\src\src\views\layout\container\AsideContainer.vue
-->
<template>
  <section class="min-h-screen flex">
    <aside>
      <slot name="aside"></slot>
    </aside>
    <main>
      <slot name="main"></slot>
    </main>
  </section>
</template>
<script lang="ts" setup>
/* 类型文件 */

/* 第三方模块 */

/* 本地共享模块 */

/* 业务模块 */
defineOptions({
  name: 'AsideContainer'
})
</script>
