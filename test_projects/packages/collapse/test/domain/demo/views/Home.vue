<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-04 22:38:44
 * @path: \collapse\test\domain\demo\views\Home.vue
-->

<template>
  <div class="flex">
    <button @click="show = !show">切换</button>
    <CollapseTransition animation-duration="3s" orientation="horizontal">
      <div v-if="show" id="content">
        <div>1111111</div>
        <div>2222222</div>
        <div>3333333</div>
        <div>4444444</div>
      </div>
    </CollapseTransition>
    <div>记录卡撒旦解放拉萨扩大解放拉萨扩大解放</div>
  </div>
</template>
<script setup lang="ts">
import { CollapseTransition } from '@/index'
import { ref } from 'vue';

const show = ref(true)

// let timer = setInterval(() => {
//   console.log('document.querySelector(#content)?.scrollHeight', document.querySelector('#content')?.scrollHeight)
// }, 100)

// setTimeout(() => {
//   clearInterval(timer)
// }, 20000)
</script>