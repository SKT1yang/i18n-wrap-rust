/*
 * @Name: 展示编辑好的拓扑
 * @Description:
 * @Author: ygd
 * @Date: 2022-02-17 09:32:32
 */
/* 类型文件 */
import type { GraphData, Graph } from '@antv/g6';
import { TopologyMode } from '../../types';
/* 第三方模块 */
import { ref, toRaw } from 'vue';
import { cloneDeep } from '@guolisec/utils';
/* 本地共享模块 */

/* 业务模块 */
import { createViewGraphic } from '../../service/createGraphic';
import { drawTopology } from '../../service/drawTopology';

function useTopologyViewCanvas(props: {
  readonly data: GraphData;
  readonly mode: TopologyMode;
  readonly peraLayerLayout: boolean;
}) {
  const canvasElement = ref<HTMLDivElement>();
  const graphic = ref<Graph | undefined>();

  async function bootstrap() {
    // 已存在先销毁
    if (graphic.value) {
      toRaw(graphic.value).destroy();
    }
    // 1. 创建G6实例
    graphic.value = createViewGraphic(canvasElement.value, props.mode);
    // 2. 画资产拓扑图
    if (!graphic.value) {
      console.warn('[useTopologyEditCanvas bootstrap]: 画拓扑找不到g6实例!');
      return;
    }
    const data = cloneDeep(props.data);
    drawTopology(graphic.value, data, {
      peraLayerLayout: props.peraLayerLayout,
    });
  }

  return {
    canvasElement,
    bootstrap,
    graphic,
  };
}

export { useTopologyViewCanvas };
