<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-10 09:47:54
 * @path: \permission\src\src\views\layout\container\HeaderContainer.vue
-->
<template>
  <section class="h-screen">
    <header class="flex items-center justify-between h-[64px] px-4">
      <slot name="header"></slot>
    </header>
    <main class="w-full overflow-auto">
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
  name: 'HeaderContainer'
})
</script>

<style scoped>
header {
  background: linear-gradient(90deg, #0065d4 0%, #004898 100%);
}

main {
  height: calc(100vh - 64px);
}
</style>
