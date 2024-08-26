<template>
  <div>
    <div>中文文字</div>
    <div :label="'中文文字'"></div>
    <div :label="value"></div>
  </div>
</template>

<script lang='ts' setup>
import { reactive, onMounted, computed, ref, watch } from 'vue';
const value = ''

</script>
<style scoped>

</style>
