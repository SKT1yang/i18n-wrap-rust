<!--
 * @name: logo
 * @description: 包含logo图片和logo名称
-->
<template>
  <div class="flex-between text-white cursor-pointer" @click="hanldeClick">
    <img v-if="logoPureUrl" :src="logoPureUrl" class="h-7" />
    <i v-else class="i-base-logo-pure text-4xl"></i>
    <span class="ml-3 text-xl">{{ logoName }}</span>
  </div>
</template>
<script lang="ts" setup>
/* 类型文件 */

/* 第三方模块 */
import { ref, computed } from 'vue';
import { go } from '@guolisec/routerable'
import { getDocumentTitleConfig } from '@guolisec/utils';

/* 本地共享模块 */

/* 业务模块 */

const logoPureUrl = computed(() => {
  let logoPureUrl = ''
  if (window.OEM_SETTINGS && window.OEM_SETTINGS.HTML_LOGO_PATH) {
    logoPureUrl = `${window.OEM_SETTINGS.HTML_LOGO_PATH}/logo-pure.png`
  }
  return logoPureUrl
})

const logoName = ref(getDocumentTitleConfig())

function hanldeClick() {
  go({
    name: "HomeRoot"
  })
}
</script>
