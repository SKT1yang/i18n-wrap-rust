<!--
 * @name: 画布
 * @description: 展示态
-->
<template>
  <!-- canvas 挂载节点 -->
  <div id="g6-canvas" class="w-full h-full relative z-10 overflow-hidden" ref="canvasElement"
    @contextmenu="handlePreventContextmenu">
  </div>
</template>

<script lang="ts" setup>
/* 类型文件 */
import type { PropType } from 'vue';
import type { GraphData } from '@antv/g6'
/* 第三方模块 */
import JsPDF from "jspdf";
import { ref, watch, onMounted } from 'vue'
import { downloadByData, cssVar, downloadByUrl } from '@guolisec/utils'
import { message } from 'ant-design-vue';
/* 本地模块 */
import { TopologyMode, AssetModel, AssetUserConfig } from '../../types'
import { useTopologyViewCanvas } from './useTopologyViewCanvas'
import { handlePreventContextmenu } from '../../utils';
import { STATE_TYPE } from '../../types/enum';


const props = defineProps({
  data: {
    type: Object as PropType<GraphData>,
    default() {
      return {
        nodes: [],
        edges: []
      }
    }
  },
  mode: {
    type: String as PropType<TopologyMode>,
    default: 'view'
  },
  peraLayerLayout: {
    type: Boolean,
    default: false
  }
});

const { canvasElement, bootstrap, graphic } = useTopologyViewCanvas(props)

// 保证dom已挂载，数据已存在
const isMounted = ref(false)
const needBootstrap = ref(false)

onMounted(() => {
  isMounted.value = true
  if (needBootstrap.value) {
    render()
  }
  if (props.data && props.data.nodes && props.data.nodes?.length > 0) {
    render()
  }
})

watch(() => props.data, () => {
  if (!isMounted.value) {
    needBootstrap.value = true
    return
  }
  render()
})

function render() {
  if (props.data && (props.data.nodes?.length ?? 0) > 0) {
    bootstrap()
  }
}

/********************** 对外暴露的api **********************/

/**
 * 
 * @param id 当是字符串时，为node的uuid；当是数字时，为资产id
 */
function focusAssetNode(id: string | number) {
  if (!graphic.value) {
    console.warn('聚焦资产失败,未找到g6实例')
    return
  }
  const targetAsset = graphic.value.find('node', (node) => {
    const model = node.getModel()
    if (typeof id === 'string') {
      return model.id === id
    } else {
      const assetData = model.data as AssetUserConfig
      return assetData.id === id
    }
  })
  if (!targetAsset) {
    return
  }

  clearFocus()

  const targetModel = targetAsset.getModel() as AssetModel
  if (!targetModel.data) {
    return
  }
  targetAsset.setState(STATE_TYPE.ASSET_NODE_FOCUS_STATE, true)
  graphic.value.focusItem(targetAsset)
}

function clearFocus() {
  if (!graphic.value) {
    console.warn('取消聚焦资产失败,未找到g6实例')
    return
  }
  const nodes = graphic.value.findAllByState('node', STATE_TYPE.ASSET_NODE_FOCUS_STATE)
  nodes.forEach((node) => {
    node.setState(STATE_TYPE.ASSET_NODE_FOCUS_STATE, false)
  })
}

/**
 * 导出为png
 */
function exportPng(topoName: string) {
  if (!graphic.value) {
    console.warn('导出为png失败,未找到g6实例')
    message.warning("拓扑图为空，无法导出")
    return
  }
  graphic.value.fitView(0);
  setTimeout(async () => {
    const canvas = canvasElement.value?.querySelector('canvas')
    if (canvas && graphic.value) {
      graphic.value.downloadFullImage(topoName || '拓扑图', undefined, { backgroundColor: cssVar("--color-bg-base") })
      message.success("导出成功！")
    }
  }, 0)
}

/**
 * 导出为json
 */
function exportJson(topoName: string) {
  if (!graphic.value) {
    console.warn('导出为png失败,未找到g6实例')
    return
  }
  const data = graphic.value.save()
  const blob = new Blob([JSON.stringify(data)], {
    type: 'application/json'
  })
  downloadByData(blob, `${topoName || '拓扑图'}.json`)

}

/**
 * 导出为pdf
 */
function exportPdf(topoName: string) {
  if (!graphic.value) {
    console.warn('导出为pdf失败,未找到g6实例')
    message.warning("拓扑图为空，无法导出")
    return
  }
  if (!canvasElement.value) {
    console.warn('导出为pdf失败,canvasElement未生成')
    return
  }
  graphic.value.fitView(0);
  setTimeout(async () => {
    const canvas = canvasElement.value?.querySelector('canvas')
    if (canvas && graphic.value) {
      const imageDataUrl = graphic.value.toDataURL("image/png", cssVar("--color-bg-base"));

      // PDF 横向 A4 纸的尺寸
      const pageSize = {
        width: 841.89,
        height: 595.28
      }

      // PDF 的宽高比
      const pageAspectRatio = pageSize.width / pageSize.height
      // 拓扑图 1:1 生成图片的宽高比
      const imageAspectRatio = canvas.width / canvas.height

      // 根据宽高比确定缩放比例
      const scaleFactor = imageAspectRatio > pageAspectRatio
        ? pageSize.width / canvas.width
        : pageSize.height / canvas.height

      const scaleWidth = canvas.width * scaleFactor
      const scaleHeight = canvas.height * scaleFactor

      let PDF = new JsPDF('l', "pt", "a4");
      PDF.addImage(imageDataUrl, "png", 0, 0, scaleWidth, scaleHeight);
      PDF.save(`${topoName || '拓扑图'}.pdf`);
      message.success("导出成功！")
    }
  }, 0)
}

defineExpose({
  focusAssetNode,
  clearFocus,
  exportPng,
  exportJson,
  exportPdf
})

</script>