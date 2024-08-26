<!--
 * @name: Do not edit
 * @description: Do not edit
 * @path: \feature-vue\platform\front\asset-detail\test\pages\AssetPage.vue
-->
<template>
  <div>
    <!-- 主机 -->
    <button @click="handleClick(2293)">主机(只有id)</button>
    <!-- 服务器 -->
    <button @click="handleClick(2305)">服务器(只有id)</button>
    <!-- 交换机 -->
    <button @click="handleClick(2303)">交换机(只有id)</button>
    <!-- plc -->
    <button @click="handleClick(2302)">西门子plc(只有id)</button>
    <button @click="handleClick(2308)">罗克韦尔plc(只有id)</button>
    <button @click="handleClick(232, 233)">详情(id和relatedId)</button>
    <button @click="handleClick(232, 233)">详情(id和relatedId)</button>
  </div>
</template>

<script lang='ts' setup>
import { useRouter } from '@guolisec/routerable';

function handleClick(id, relatedId?, time?) {
  const router = useRouter()
  router.push({
    path: '/home',
    state: {
      id, relatedId, time
    }
  })
}
</script>