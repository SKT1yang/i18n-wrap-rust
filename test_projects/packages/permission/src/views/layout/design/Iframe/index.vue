<!--
 * @name: iframe 布局组件
 * @description: Do not edit
 * @date: 2023-05-09 09:19:36
 * @path: \glsec\domains\permission\src\views\layout\design\Iframe\index.vue
-->
<template>
  <div v-if="showFrame">
    <template v-for="frame in getFramePages" :key="frame.path">
      <FramePage v-if="frame.meta && frame.meta.frameSrc" v-show="showIframe(frame)" :frameSrc="frame.meta.frameSrc" />
    </template>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, unref } from 'vue';

import FramePage from './FramePage.vue';

import { useFrameKeepAlive } from './useFrameKeepAlive';

export default defineComponent({
  name: 'FrameLayout',
  components: { FramePage },
  setup() {
    const { getFramePages, showIframe } = useFrameKeepAlive();

    const showFrame = computed(() => unref(getFramePages).length > 0);

    return { getFramePages, showIframe, showFrame };
  },
});
</script>
