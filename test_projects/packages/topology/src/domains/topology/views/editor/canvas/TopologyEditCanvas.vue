<!--
 * @name: 画布
 * @description: Do not edit
 * @date: 2023-02-15 14:39:34
 * @path: \glsec\apps\rsmp\src\domain\topology\views\TopologyCanvas\index.vue
-->
<template>
  <div class="topology-canvas mx-4 flex-1 bg-$color-bg-base">
    <!-- canvas 挂载节点 -->
    <div id="g6-canvas" class="relative z-10 overflow-hidden" ref="canvasElement" @contextmenu="handlePreventContextmenu">
    </div>
    <ConfigBar />
  </div>
</template>

<script name="TopologyEditor" lang="ts" setup>
import { useTopologyEditCanvas } from './useTopologyEditCanvas'
import ConfigBar from './ConfigBar.vue';
import { handlePreventContextmenu } from '../../../utils';
import { onMountedOrActivated } from '@guolisec/utils'

const { canvasElement, bootstrap } = useTopologyEditCanvas()

onMountedOrActivated(() => {
  bootstrap()
})
</script>

<style scoped>
#g6-canvas {
  flex: 1 0 auto;
  height: calc(100vh - 240px);
  overflow: hidden;
}
</style>
