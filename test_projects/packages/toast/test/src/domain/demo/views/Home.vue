<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-04 22:38:44
 * @path: \vue-package-quickstart\src\domain\demo\views\Home.vue
-->

<template>
  <button @click="handleClick">发送消息</button>
  <button @click="andClick">发送antd消息</button>
</template>
<script setup lang="ts">
import { message as antMessage } from 'ant-design-vue'
import { message } from '../../../../../src/index'

async function handleClick() {
  message.error('error', undefined, undefined, true)
  message.info({
    content: 'info',
    duration: 1000
  })
  message.config({
    content: 'config',
    type: 'warning',
    single: true
  })

  // message.error('1111111111')
}

function andClick() {
  antMessage.error('error', undefined, undefined)
  antMessage.info({
    content: 'info',
    duration: 1000
  })
}
</script>