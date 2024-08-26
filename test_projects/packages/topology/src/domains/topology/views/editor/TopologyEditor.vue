<!--
 * @name: Do not edit
 * @description: Do not edit
-->
<template>
  <div class="topology-editor">
    <header class="p-4 flex justify-between bg-$color-bg-base">
      <div>
        <span class="font-bold">{{ topologyStoreRef.topologyInfo.value.topoName }}</span>
        <Tag class="ml-2" color="blue" v-if="topologyStoreRef.topologyInfo.value.mainTopo">基线</Tag>
      </div>
      <div class="space-x-4">
        <span class="text-sm text-$color-text-tertiary">上次保存：{{ updateTime }}</span>
        <Button type="primary" @click="handleSaveTopology" :disabled="saveBtnDisabled">保存</Button>
        <Button @click="handleLayout">自动生成拓扑</Button>
        <Button @click="goTopologyView">退出编辑</Button>
      </div>
    </header>
    <div class="p-4">
      <div class="flex relative w-full p-4">
        <div class="flex w-full">
          <!--  视图元素区:START  -->
          <TopologyElement />
          <!--  视图元素区:END  -->

          <!--  画布区:START  -->
          <TopologyEditCanvas />
          <!--  画布区:END  -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup>
/* 类型文件 */
/* 第三方模块 */
import { computed, h } from 'vue'
import { Button, Tag, Modal } from 'ant-design-vue'
import { storeToRefs } from 'pinia'
import { formatToDateTime } from '@guolisec/utils'
/* 本地模块 */
import TopologyElement from './element/TopologyElement.vue'
import TopologyEditCanvas from './canvas/TopologyEditCanvas.vue'
import { useRouter } from '@guolisec/routerable'
import { useTopologyStoreWithOut } from '../../model/store'
import { useSaveTopology } from './canvas/useTopologyEditCanvas'
import { getTopologyId } from '../../service/getTopologyInfo'
import { drawLatestTopology } from '../../service/drawTopology'
import PeraLayerLayoutHelper from './canvas/PeraLayerLayoutHelper.vue'

const topologyStore = useTopologyStoreWithOut()
const topologyStoreRef = storeToRefs(topologyStore)

const updateTime = computed(() => {
  if (topologyStoreRef.topologyInfo.value.updateTime) {
    return formatToDateTime(topologyStoreRef.topologyInfo.value.updateTime)
  } else {
    return ''
  }
})

const { saveBtnDisabled, handleSaveTopology } = useSaveTopology()

// 退出编辑，回到拓扑展示
async function goTopologyView() {
  const id = getTopologyId()
  const router = useRouter()
  router.push({
    name: 'TopologyView',
    query: {
      id: id
    }
  })
}

function handleLayout() {
  Modal.confirm({
    iconType: "warning",
    title: '确认重新生成网络拓扑图吗？',
    content: h(PeraLayerLayoutHelper),
    width: 800,
    type: 'error',
    okButtonProps: {
      danger: true
    },
    async onOk() {
      drawLatestTopology()
    },
  })

}

</script>