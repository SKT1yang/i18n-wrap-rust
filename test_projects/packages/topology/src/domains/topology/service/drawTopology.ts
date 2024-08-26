/*
 * @name: 在实例上画拓扑图
 * @description: createGraphic -> buildTopology -> saveTopology
 */

/* 类型文件 */
import type { Graph, GraphData, EdgeConfig } from '@antv/g6';
import { NODE_TYPE, PERA_LAYER, EDGE_TYPE } from '../types/enum';
import { AssetModel, AssetUserConfig } from '../types';
/* 第三方模块 */
import { toRaw, unref } from 'vue';
import { uuid } from '@guolisec/utils';
import { message } from '@guolisec/toast';
/* 业务模块 */
import { PeraLayerLayout } from './g6/registryLayout';
import { useTopologyStoreWithOut } from '../model/store';
import { getAssetConnectionApi, getAllAssetApi } from '../model/editor';

/**
 * 在实例上画拓扑
 */
async function drawTopology(
  graphic: Graph,
  graphData: GraphData,
  options?: {
    peraLayerLayout?: boolean;
    keepView?: boolean;
  }
) {
  const { peraLayerLayout = false, keepView = false } = options || {};
  if (!graphic) {
    console.warn('drawEditTopology: 画拓扑找不到g6实例!');
    return;
  }
  if (!graphData) {
    console.warn('drawEditTopology: 画拓扑找不到g6渲染数据!');
    return;
  }
  const instance = toRaw(graphic);
  refreshContainer(graphic);
  addLayer(graphData);
  if (peraLayerLayout) {
    const instance = new PeraLayerLayout({
      nodes: graphData?.nodes || [],
    });
    instance.execute();
  }
  if (keepView) {
    instance.changeData(graphData);
    instance.paint();
  } else {
    instance.read(graphData);
    instance.fitView(0);
  }
}

// 更新画布大小
function refreshContainer(graphic: Graph) {
  if (graphic) {
    const containerDom = graphic.getContainer();
    const width = containerDom.offsetWidth;
    const height = containerDom.offsetHeight;
    unref(graphic)?.changeSize(width, height);
  }
}

// 添加普渡模型的层级
function addLayer(graphData: GraphData) {
  let hasControllerLayerNode = false;
  let hasMonitorLayerNode = false;
  let hasOperationLayerNode = false;
  if (!graphData.nodes) {
    graphData.nodes = [];
  }
  graphData.nodes.forEach((node) => {
    if (node.id === PERA_LAYER.CONTROLLER_LAYER) {
      hasControllerLayerNode = true;
    }
    if (node.id === PERA_LAYER.MONITOR_LAYER) {
      hasMonitorLayerNode = true;
    }
    if (node.id === PERA_LAYER.OPERATION_LAYER) {
      hasOperationLayerNode = true;
    }
  });
  if (!hasControllerLayerNode) {
    graphData.nodes.unshift({
      id: PERA_LAYER.CONTROLLER_LAYER,
      type: NODE_TYPE.BOX_NODE,
      x: 1500,
      y: 1250,
      label: 'LEVEL 1',
      style: {
        width: 3000,
        height: 500,
        stroke: '#999999',
        fill: '#ffffff',
        lineWidth: 1,
        lineDash: [0, 0],
      },
      data: {
        subTitle: '基本控制层',
        showBar: true,
        layer: 1,
      },
    });
  }

  if (!hasMonitorLayerNode) {
    graphData.nodes.unshift({
      id: PERA_LAYER.MONITOR_LAYER,
      type: NODE_TYPE.BOX_NODE,
      x: 1500,
      y: 750,
      label: 'LEVEL 2',
      style: {
        width: 3000,
        height: 500,
        stroke: '#999999',
        fill: '#ffffff',
        lineWidth: 1,
        lineDash: [0, 0],
      },
      data: {
        subTitle: '区域监控系统层',
        showBar: true,
        layer: 2,
      },
    });
  }

  if (!hasOperationLayerNode) {
    graphData.nodes.unshift({
      id: PERA_LAYER.OPERATION_LAYER,
      type: NODE_TYPE.BOX_NODE,
      x: 1500,
      y: 250,
      label: 'LEVEL 3',
      style: {
        width: 3000,
        height: 500,
        stroke: '#999999',
        fill: '#ffffff',
        lineWidth: 1,
        lineDash: [0, 0],
      },
      data: {
        subTitle: '现场运营层',
        showBar: true,
        layer: 3,
      },
    });
  }
}

/**
 * 自动生成拓扑
 */
async function drawLatestTopology() {
  const topologyStore = useTopologyStoreWithOut();
  // 获取连接关系
  const assetConnectionList = await getAssetConnectionApi({
    topoId: topologyStore.topologyInfo.id,
  });

  // 获取所有资产数据
  const assetList = await getAllAssetApi({
    assetGroupIdsIn: topologyStore.topologyInfo.assetGroup.map(
      (item) => item.id
    ),
    runStatus: 1,
  });

  // 存在layer字段为空的资产
  const assetsNotHavelayer: AssetModel[] = [];

  // 生成点数据nodes
  const nodes = assetList.map((asset) => {
    const assetUserConfig: AssetUserConfig = {
      uuid: uuid(),
      ...asset,
    };
    const assetModel: AssetModel = {
      id: assetUserConfig.uuid,
      type: NODE_TYPE.ASSET_NODE,
      label: assetUserConfig.name,
      labelCfg: {
        position: 'bottom',
        offset: 25,
      },
      data: assetUserConfig,
    };
    if (!asset.layer) {
      assetsNotHavelayer.push(assetModel);
    }
    return assetModel;
  });

  if (assetsNotHavelayer.length > 0) {
    const ips = assetsNotHavelayer
      .map((i) => i?.data?.assetIp)
      .filter((i) => Boolean(i))
      .join();
    message.warning(`${ips}不在任何普渡模型范围内，请仔细检查`);
  }

  // 生成edges数据
  const formatEdges = assetConnectionList
    .map((assetConnection) => {
      let result: EdgeConfig | undefined = undefined;

      let sourceNode: AssetModel | undefined = undefined;
      let targetNode: AssetModel | undefined = undefined;
      nodes.forEach((node) => {
        if (isMatch(assetConnection.srcIp, assetConnection.srcMac, node.data)) {
          sourceNode = node;
        }
        if (isMatch(assetConnection.dstIp, assetConnection.dstMac, node.data)) {
          targetNode = node;
        }
      });

      if (sourceNode !== undefined && targetNode !== undefined) {
        result = {
          id: uuid(),
          source: sourceNode.id,
          target: targetNode.id,
          type: EDGE_TYPE.ASSET_POLYLINE_EDGE,
        };
      }
      return result;
    })
    .filter((i) => i !== undefined) as unknown as AssetModel[];
  // 重复关系去重（两端一样，顺序不同）
  const keys: string[] = [];
  const edges: AssetModel[] = [];
  formatEdges.forEach((item) => {
    let key1 = `${item.source}-${item.target}`;
    let key2 = `${item.target}-${item.source}`;
    if (!keys.includes(key1) && !keys.includes(key2)) {
      edges.push(item);
      keys.push(key1, key2);
    }
  });
  const graphData: GraphData = {
    nodes,
    edges,
  };
  // 添加普渡模型的层级
  addLayer(graphData);

  // 执行布局， 修改数据
  if (!graphData.nodes) {
    console.warn('drawEditTopology: 画拓扑找不到g6渲染数据!');
    return;
  }
  const instance = new PeraLayerLayout({
    nodes: graphData.nodes,
  });
  instance.execute();

  // 渲染数据
  const graphic = topologyStore.graphic;
  if (!graphic) {
    return;
  }
  graphic.read(graphData);
  graphic.fitView(0);

  topologyStore.setAutoTopologyStatus(true);
}

function isMatch(ip, mac, data) {
  return ip
    ? ip === data.assetIp && toUpperCase(mac) === toUpperCase(data.assetMac)
    : toUpperCase(mac) === toUpperCase(data.assetMac);
}

function toUpperCase(str: string) {
  if (str) {
    return str.toLocaleUpperCase();
  } else {
    return str;
  }
}

export { drawTopology, drawLatestTopology, addLayer };
