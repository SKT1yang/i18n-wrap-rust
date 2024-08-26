<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-10 09:47:54
 * @path: \permission\src\views\layout\container\HeaderSideContainer.vue
-->
<template>
  <section class="h-screen w-screen flex flex-col">
    <header class="flex-between h-16 w-full px-4 flex-0">
      <slot name="header"></slot>
    </header>
    <main class="flex flex-1 w-full">
      <aside>
        <slot name="aside"></slot>
      </aside>
      <div class="w-full h-full overflow-auto">
        <slot name="main"></slot>
      </div>
    </main>
  </section>
</template>
<script lang="ts" setup>
/* 类型文件 */

/* 第三方模块 */

/* 本地共享模块 */

/* 业务模块 */
defineOptions({
  name: 'HeaderSideContainer'
})
</script>

<style scoped>
header {
  background: linear-gradient(90deg, #0065d4 0%, #004898 100%);
}

main {
  height: calc(100vh - 4rem);
}
</style>
