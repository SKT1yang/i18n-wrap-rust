<!--
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-09 09:28:27
 * @path: \glsec\domains\permission\src\views\layout\design\Iframe\FramePage.vue
-->
<template>
  <div class="g-iframe-page" :style="getWrapStyle">
    <iframe :src="frameSrc" class="g-iframe-page__main w-full h-full overflow-hidden border-0" ref="frameRef"
      @load="hideLoading"></iframe>
  </div>
</template>
<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import { ref, unref, computed } from 'vue';
import { useWindowSizeFn } from '@guolisec/utils';

defineProps({
  frameSrc: String,
});

const loading = ref(true);
const heightRef = ref(window.innerHeight);
const frameRef = ref<HTMLFrameElement>();
useWindowSizeFn(calcHeight, { wait: 150, immediate: true });

const getWrapStyle = computed((): CSSProperties => {
  return {
    height: `${unref(heightRef)}px`,
  };
});

function calcHeight() {
  const iframe = unref(frameRef);
  if (!iframe) {
    return;
  }
  heightRef.value = window.innerHeight;
  const clientHeight = document.documentElement.clientHeight;
  iframe.style.height = `${clientHeight}px`;
}

function hideLoading() {
  loading.value = false;
  calcHeight();
}
</script>
<style scoped>
.gl-iframe-page .gl-iframe-page__main {
  background-color: transparent;
}
</style>
