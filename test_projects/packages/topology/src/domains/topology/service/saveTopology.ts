/*
 * @name: 保存拓扑
 * @description: createGraphic -> buildTopology -> saveTopology
 */
import { GraphData, NodeConfig } from '@antv/g6';
import { BoxModel } from '../types';
import type { SwitchConnectionVO } from '../types';
/* 第三方模块 */
import { message } from '@guolisec/toast';
import { cloneDeep } from '@guolisec/utils';
/* 本地共享模块 */
import { useTopologyStoreWithOut } from '../model/store';
/* 业务模块 */
import { PERA_LAYER, NODE_TYPE } from '../types/enum';
import { modifyTopoInformationApi } from '../model/list';
import { updateAssetColumnBatchApi } from '../model/editor';
import { getTopoInformationById } from './getTopologyInfo';

/**
 * 保存拓扑
 * @returns
 */
async function saveEditTopology() {
  const topologyStore = useTopologyStoreWithOut();
  if (!topologyStore.graphic) {
    console.warn('drawEditTopology: 画拓扑找不到g6实例!');
    return;
  }
  if (!topologyStore?.topologyInfo?.id) {
    console.warn('drawEditTopology: topology store dont have topologyInfo!');
    return;
  }
  if (topologyStore.graphic) {
    topologyStore.graphic.fitCenter();
    const data = topologyStore.graphic.save();
    changeAssetLayerInfo(data);
    // toBack 调整元素层级
    const ids = topologyStore.getToBackActionCache();
    handleToBack(ids, data);
    topologyStore.setToBackActionCache([]);
    const information = JSON.stringify(data);
    const form = await getTopoInformationById(topologyStore?.topologyInfo?.id);
    form.information = information;
    const linkInfo = getLinkInfo(data);
    form.switchConnectionVO = linkInfo;
    form.assetGroupIds = form.assetGroup.map((group) => group.id);
    if (topologyStore.isNeedAutoTopologyStatus) {
      form.recordId = undefined;
    }
    await modifyTopoInformationApi(form);
    topologyStore.setAutoTopologyStatus(false);
    message.success('操作成功');
  }
}

function getLinkInfo(data) {
  const switchConnectionVO: SwitchConnectionVO[] = [];
  const edges = data.edges;
  const nodes = data.nodes;
  if (edges.length > 0) {
    edges.forEach((edge) => {
      const connectItem: SwitchConnectionVO = {
        srcIp: '',
        srcMac: '',
        srcLayer: 1,
        srcType: '',
        srcTypeCode: 3,
        dstIp: '',
        dstMac: '',
        dstLayer: 1,
        dstType: '',
        dstTypeCode: 3,
      };
      nodes.forEach((node) => {
        // 填充起点信息
        if (edge.source === node.id) {
          connectItem.srcIp = node.data.assetIp;
          connectItem.srcMac = node.data.assetMac;
          connectItem.srcLayer = node.data.layer;
          connectItem.srcType = node.data.assetTypeName;
          connectItem.srcTypeCode = node.data.assetTypeCode;
        }
        // 填充终点信息
        if (edge.target === node.id) {
          connectItem.dstIp = node.data.assetIp;
          connectItem.dstMac = node.data.assetMac;
          connectItem.dstLayer = node.data.layer;
          connectItem.dstType = node.data.assetTypeName;
          connectItem.dstTypeCode = node.data.assetTypeCode;
        }
      });
      if (
        Object.values(connectItem).length > 0 &&
        connectItem.srcIp !== connectItem.dstIp
      ) {
        switchConnectionVO.push(connectItem);
      }
    });
  }

  return switchConnectionVO;
}

async function changeAssetLayerInfo(graphData: GraphData) {
  const result: {
    id: number;
    layer: number;
  }[] = [];
  if (graphData.nodes) {
    let controllerLayerNode;
    let monitorLayerNode;
    let operationLayerNode;
    graphData.nodes.forEach((node) => {
      if (node.id === PERA_LAYER.CONTROLLER_LAYER) {
        controllerLayerNode = node;
      }
      if (node.id === PERA_LAYER.MONITOR_LAYER) {
        monitorLayerNode = node;
      }
      if (node.id === PERA_LAYER.OPERATION_LAYER) {
        operationLayerNode = node;
      }
    });

    graphData.nodes.forEach((node) => {
      if (node.type === NODE_TYPE.ASSET_NODE && node.data && node.data.layer) {
        const oldLayer = node.data.layer;
        const isControllerLayer = isInControllerLayer(
          node,
          controllerLayerNode
        );
        if (isControllerLayer && oldLayer && oldLayer !== 1) {
          node.data.layer = 1;
          result.push({
            id: node.data?.id,
            layer: 1,
          });
        }
        const isMonitorLayer = isInMonitorLayer(node, monitorLayerNode);
        if (isMonitorLayer && oldLayer && oldLayer !== 2) {
          node.data.layer = 2;
          result.push({
            id: node.data?.id,
            layer: 2,
          });
        }
        const isOperationLayer = isInOperationLayer(node, operationLayerNode);
        if (isOperationLayer && oldLayer && oldLayer !== 3) {
          node.data.layer = 3;
          result.push({
            id: node?.data?.id,
            layer: 3,
          });
        }
      }
    });
  }
  if (result.length > 0) {
    await updateAssetColumnBatchApi(result);
  }
}

/**
 * 重新调整元素层级
 * 源码bug
 */
function handleToBack(ids: string[], data: GraphData) {
  const nodes = cloneDeep(data.nodes || []);
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const index = nodes.findIndex((node) => {
      return node.id === id;
    });
    if (index !== -1) {
      const target = nodes.splice(index, 1);
      nodes.unshift(...target);
    }
  }
  data.nodes = nodes;
}

function isInControllerLayer(node: NodeConfig, layerNode: BoxModel) {
  const isControllerLayer = isInLayer(node, layerNode);
  if (isControllerLayer) {
    return 1;
  }
}

function isInMonitorLayer(node: NodeConfig, layerNode: BoxModel) {
  const isMonitorLayer = isInLayer(node, layerNode);
  if (isMonitorLayer) {
    return 2;
  }
}

function isInOperationLayer(node: NodeConfig, layerNode: BoxModel) {
  const isOperationLayer = isInLayer(node, layerNode);
  if (isOperationLayer) {
    return 3;
  }
}

function isInLayer(node: NodeConfig, layerNode: BoxModel) {
  const { start, end } = getStartEndPoint(layerNode);
  if (
    start.length === 0 ||
    end.length === 0 ||
    node.x === undefined ||
    node.y === undefined
  ) {
    return false;
  }
  return (
    node.x > start[0] && node.x < end[0] && node.y > start[1] && node.y < end[1]
  );
}

function getStartEndPoint(layerNode: BoxModel) {
  const { x, y } = layerNode;
  if (x === undefined || y === undefined) {
    return {
      start: [],
      end: [],
    };
  }
  const { width = 0, height = 0 } = layerNode.style || {};
  return {
    start: [x - width / 2, y - height / 2],
    end: [x + width / 2, y + height / 2],
  };
}

export { saveEditTopology };
