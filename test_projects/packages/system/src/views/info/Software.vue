<!--
 * @name: 系统软件信息
 * @description: Do not edit
 * @date: 2023-06-21 10:41:21
 * @path: \feature-vue\platform\front\system\src\views\info\Software.vue
-->
<template>
  <div class="font-bold text-base mb-6">系统信息</div>
  <div class="mb-10 grid grid-cols-4 w-full">

    <div class="space-y-4">
      <div class="font-light text-sm">系统名称</div>
      <div class="text-sm">{{ Settings.HTML_TITLE }}</div>
    </div>
    <div class="space-y-4">
      <div class="font-light text-sm">系统版本</div>
      <div class="text-sm">{{ state.version }}</div>
    </div>
    <div class="space-y-4">
      <div class="font-light text-sm">系统型号</div>
      <div class="text-sm">{{ Settings.HTML_MODEL }}</div>
    </div>
    <div class="space-y-4">
      <div class="font-light text-sm">序列号</div>
      <div class="text-sm">{{ state.sn }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getSystemVersionApi, getSnApi } from '../../model/info';

const Settings = ref(window.OEM_SETTINGS);

const state = ref({
  sn: '',
  version: '',
});

// 获取设备SN
async function getSn() {
  state.value.sn = await getSnApi()
}

// 获取系统版本
async function getVersion() {
  state.value.version = await getSystemVersionApi()
}

// 页面加载时
onMounted(() => {
  getSn();
  getVersion();
});
</script>
