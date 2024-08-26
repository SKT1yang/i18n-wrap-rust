/*
 * @Name: G6拓扑canvas处理
 * @Description:
 * @Author: ygd
 * @Date: 2022-02-17 09:32:32
 */
/* 类型文件 */
import type { GraphData } from '@antv/g6';
/* 第三方模块 */
import { ref } from 'vue';
import { onUnMountedOrDeactivated } from '@guolisec/utils';
import { handlePreventContextmenu } from '../../../utils';
import { transformInformation } from '../../../service/getTopologyInfo';

/* 本地共享模块 */

/* 业务模块 */
import { createGraphic } from '../../../service/createGraphic';
import { drawTopology } from '../../../service/drawTopology';
import { saveEditTopology } from '../../../service/saveTopology';
import { useTopologyStoreWithOut } from '../../../model/store';

function useTopologyEditCanvas() {
  const store = useTopologyStoreWithOut();
  const canvasElement = ref<HTMLDivElement>();
  const graphData = ref<GraphData>();

  async function bootstrap() {
    // 处理已有的拓扑数据
    const topologyInfo = await store.refreshTopologyInfo();
    const { information } = topologyInfo;
    graphData.value = transformInformation(information);
    if (!graphData.value) {
      console.warn(
        '[useTopologyEditCanvas bootstrap]: 画拓扑找不到g6渲染数据!'
      );
      return;
    }

    // 1. 保存canvas元素
    if (!canvasElement.value) {
      console.warn(
        '[useTopologyEditCanvas bootstrap]: canvasElement dom还未生成'
      );
      return;
    }
    store.setCanvasElement(canvasElement.value);
    // 2. 创建G6实例
    const graphic = createGraphic(canvasElement.value);
    // 3. 画资产拓扑图
    if (!graphic) {
      console.warn('[useTopologyEditCanvas bootstrap]: 画拓扑找不到g6实例!');
      return;
    }
    drawTopology(graphic, graphData.value);
  }

  onUnMountedOrDeactivated(() => {
    // 6. 清除拓扑状态数据
    store.resetState();
  });

  return {
    canvasElement,
    bootstrap,
    handlePreventContextmenu,
  };
}

function useSaveTopology() {
  const saveBtnDisabled = ref(false);
  async function handleSaveTopology() {
    try {
      saveBtnDisabled.value = true;
      // 5. 保存拓扑
      await saveEditTopology();
    } finally {
      saveBtnDisabled.value = false;
    }
  }

  return {
    saveBtnDisabled,
    handleSaveTopology,
  };
}

export { useTopologyEditCanvas, useSaveTopology };
