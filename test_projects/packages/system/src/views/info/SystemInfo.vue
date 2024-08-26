<!--
 * @Name: 系统信息
 * @Description: 系统信息
 * @Author: lkq
 * @Date: 2022-03-14 16:28:48
 * @LastEditTime: 2024-01-25 16:50:15
 * @LastEditors: Please set LastEditors
-->
<template>
  <div class="w-full text-base">
    <Software></Software>
    <Hardware></Hardware>
  </div>
</template>
<script setup name="SystemInfo" lang="ts">
import Hardware from './Hardware.vue';
import Software from './Software.vue';
</script>
