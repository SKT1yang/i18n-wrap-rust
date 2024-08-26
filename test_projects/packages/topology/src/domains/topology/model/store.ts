/*
 * @Name: 拓扑编辑全局共享状态
 * @Description: Do not edit
 * @Author: ygd
 * @Date: 2022-03-02 08:47:59
 * @LastEditTime: 2023-06-05 17:13:04
 * @LastEditors: Please set LastEditors
 */
import type { Ref } from 'vue';
import type {
  Graph,
  Node,
  NodeConfig,
  EdgeConfig,
  ComboConfig,
  GraphData,
} from '@antv/g6';
import {
  AssetUserConfig,
  LineUserConfig,
  BoxUserConfig,
  TextUserConfig,
  TopologyInfo,
  BoxData,
} from '../types';
import { NODE_TYPE, EDGE_TYPE } from '../types/enum';
import { useStore } from '@guolisec/storable';
import { ref, shallowRef } from 'vue';
import { defineStore } from 'pinia';
import { Asset } from '@guolisec/utils';
import {
  getTopoInformationById,
  getTopologyId,
} from '../service/getTopologyInfo';

interface State {
  // 编辑前的拓扑信息
  topologyInfo: Ref<TopologyInfo>;
  refreshTopologyInfo: () => Promise<TopologyInfo>;
  getAllAssetElementDataList(): (AssetUserConfig | BoxData | undefined)[];
  setTopologyInfo: (info: TopologyInfo) => void;
  // canvas 挂载节点(div)
  canvasElement: Ref<HTMLDivElement>;
  setCanvasElement(dom: HTMLDivElement): void;
  // G6实例
  graphic: Ref<Graph | undefined>;
  setGraphic: (info: Graph) => void;
  // 更新节点
  updateNodeItem(node: Node, model: NodeConfig): void;
  // 更新当前激活节点信息
  updateActiveNodeItem(): void;
  activeElementInfo: Ref<{
    uuid: string;
    type: '' | NODE_TYPE;
  }>;
  // 当前激活的 资产 元素
  activeAssetElement: Ref<AssetUserConfig>;
  setAsset: (config: AssetUserConfig) => void;
  // 当前激活的 线条 元素
  activeLineElement: Ref<LineUserConfig>;
  setLine(config: LineUserConfig): void;
  // 当前激活的 矩形 元素
  activeBoxElement: Ref<BoxUserConfig>;
  setBox(config: BoxUserConfig): void;
  // 当前激活的 文字 元素
  activeTextElement: Ref<TextUserConfig>;
  setText(config: TextUserConfig): void;
  edgeName: Ref<EDGE_TYPE>;
  isNeedAutoTopologyStatus: Ref<boolean>;
  setAutoTopologyStatus(value: boolean): void;
  setToBackActionCache(ids: string[]): void;
  getToBackActionCache(): string[];
  addToBackActionCache(id: string): void;
  // 初始化所有状态
  resetState(): void;
}

const useTopologyStore = defineStore<string, State>('topology::editor', () => {
  /********************** G6逻辑 **********************/

  const canvasElement = ref(document.createElement('div'));
  function setCanvasElement(dom: HTMLDivElement) {
    canvasElement.value = dom;
  }

  // 不能用ref，必须用shallowRef，参考https://github.com/antvis/G6/issues/4855
  const graphic = shallowRef<Graph>();
  function setGraphic(info: Graph) {
    graphic.value = info;
  }

  function updateNodeItem(
    node: Node,
    model: NodeConfig | EdgeConfig | ComboConfig
  ) {
    if (graphic.value && node.getID() && model) {
      graphic.value.updateItem(node, model, true);
    }
  }

  function updateActiveNodeItem() {
    if (!graphic.value) {
      console.log('更新node信息失败,graphic不存在');
      return;
    }
    const node = graphic.value.findById(activeElementInfo.value.uuid);
    if (!node) {
      console.log('更新node信息失败,node未找到');
      return;
    }
    const model = node.getModel() as NodeConfig;
    // 已经处理好的model
    const handledModel = getUpdateModel(model);
    if (!handledModel) {
      console.log('更新node信息失败,model数据不存在');
      return;
    }
    // 文字节点如果文字为空，自动删除文字节点
    if (handledModel.type === NODE_TYPE.TEXT_NODE && !handledModel.label) {
      graphic.value.removeItem(model.id, true);
      resetUserConfigState();
      return;
    }
    graphic.value.updateItem(node, handledModel, true);
  }

  /********************** 编辑前的拓扑信息 **********************/

  const topologyInfo = ref<TopologyInfo>(topologyInfoFactory());

  async function refreshTopologyInfo() {
    // 处理拓扑id
    const id = getTopologyId();
    // 处理已有的拓扑数据
    topologyInfo.value = await getTopoInformationById(id);
    return topologyInfo.value;
  }

  function setTopologyInfo(info: TopologyInfo) {
    topologyInfo.value = info;
  }

  function getAllAssetElementDataList() {
    if (!graphic.value) {
      return [];
    }
    const graphData = graphic.value.save();
    const nodes = (graphData.nodes as NodeConfig[]) || [];
    const assetNodes = nodes.filter((node) => {
      return node.type === NODE_TYPE.ASSET_NODE && Boolean(node?.data);
    });
    return assetNodes.map((i) => {
      return i.data;
    });
  }

  /********************** 编辑元素可配置项逻辑 **********************/

  const activeElementInfo = ref<{
    uuid: string;
    type: '' | NODE_TYPE;
  }>({
    uuid: '',
    type: '', // asset line box text
  });

  function getUpdateModel(model: NodeConfig) {
    switch (activeElementInfo.value.type) {
      case NODE_TYPE.ASSET_NODE:
        return getUpdateAssetModel(model);

      case NODE_TYPE.BOX_NODE:
        return getUpdateBoxModel(model);

      case NODE_TYPE.LINE_NODE:
        return getUpdateLineModel(model);

      case NODE_TYPE.TEXT_NODE:
        return getUpdateTextModel(model);

      default:
        return model;
    }
  }

  // 资产元素
  const activeAssetElement = ref<AssetUserConfig>({
    uuid: '',
    ...new Asset(),
  });
  function setAsset(config: AssetUserConfig) {
    activeAssetElement.value = config;
    if (activeAssetElement.value.uuid) {
      activeElementInfo.value = {
        uuid: activeAssetElement.value.uuid,
        type: NODE_TYPE.ASSET_NODE,
      };
    }
  }

  function getUpdateAssetModel(model: NodeConfig) {
    model.data = activeAssetElement.value;
    return model;
  }

  // 线条元素
  const activeLineElement = ref<LineUserConfig>(lineUserConfigFactory());
  function setLine(config: LineUserConfig) {
    activeLineElement.value = config;
    if (activeLineElement.value.uuid) {
      activeElementInfo.value = {
        uuid: activeLineElement.value.uuid,
        type: NODE_TYPE.LINE_NODE,
      };
    }
  }

  function getUpdateLineModel(model: NodeConfig) {
    if (!model.style) {
      model.style = {};
    }
    model.style.lineWidth = activeLineElement.value.lineWidth;
    model.style.lineDash = activeLineElement.value.lineDash;
    // model.style.path = activeLineElement.value.path
    model.style.stroke = activeLineElement.value.stroke;
    return model;
  }

  // 矩形元素
  const activeBoxElement = ref<BoxUserConfig>(boxUserConfigFactory());

  function setBox(config: BoxUserConfig) {
    activeBoxElement.value = config;
    if (activeBoxElement.value.uuid) {
      activeElementInfo.value = {
        uuid: activeBoxElement.value.uuid,
        type: NODE_TYPE.BOX_NODE,
      };
    }
  }

  function getUpdateBoxModel(model: NodeConfig) {
    if (!model.style) {
      model.style = {};
    }
    // model.style.width = activeBoxElement.value.width
    // model.style.height = activeBoxElement.value.height
    model.style.fill = activeBoxElement.value.fill;
    model.style.lineDash = activeBoxElement.value.lineDash;
    model.style.lineWidth = activeBoxElement.value.lineWidth;
    model.style.stroke = activeBoxElement.value.stroke;
    return model;
  }

  // 文字元素
  const activeTextElement = ref<TextUserConfig>(textUserConfigFactory());
  function setText(config: TextUserConfig) {
    activeTextElement.value = config;
    if (activeTextElement.value.uuid) {
      activeElementInfo.value = {
        uuid: activeTextElement.value.uuid,
        type: NODE_TYPE.TEXT_NODE,
      };
    }
  }

  function getUpdateTextModel(model: NodeConfig) {
    if (!model.style) {
      model.style = {};
    }
    if (!model.labelCfg) {
      model.labelCfg = {
        style: {},
      };
    }
    if (!model.labelCfg.style) {
      model.labelCfg.style = {};
    }

    model.labelCfg.style.fill = activeTextElement.value.color;
    model.label = activeTextElement.value.label;
    model.labelCfg.style.fontSize = activeTextElement.value.fontSize;
    return model;
  }

  const edgeName = ref(EDGE_TYPE.ASSET_POLYLINE_EDGE);

  /********************** 区分是否是自动生成状态下，保存拓扑 **********************/
  const isNeedAutoTopologyStatus = ref(false);

  function setAutoTopologyStatus(value: boolean) {
    isNeedAutoTopologyStatus.value = value;
  }

  /********************** toBack **********************/
  // toBack action 缓存, 存的 node id
  let toBackActionCache: string[] = [];

  function setToBackActionCache(ids: string[]) {
    toBackActionCache = ids || [];
  }

  function getToBackActionCache() {
    return toBackActionCache;
  }

  function addToBackActionCache(id: string) {
    toBackActionCache.push(id);
  }

  /********************** 初始化状态 **********************/

  function resetState() {
    canvasElement.value = document.createElement('div');
    graphic.value = undefined;
    resetUserConfigState();
    setAutoTopologyStatus(false);
    edgeName.value = EDGE_TYPE.ASSET_POLYLINE_EDGE;
  }

  function resetUserConfigState() {
    activeAssetElement.value = {
      uuid: '',
      ...new Asset(),
    };
    activeLineElement.value = lineUserConfigFactory();
    activeBoxElement.value = boxUserConfigFactory();
    activeTextElement.value = textUserConfigFactory();
    activeElementInfo.value = {
      uuid: '',
      type: '', // asset line box text
    };
  }

  return {
    topologyInfo,
    refreshTopologyInfo,
    setTopologyInfo,
    getAllAssetElementDataList,
    canvasElement,
    setCanvasElement,
    graphic,
    setGraphic,
    updateNodeItem,
    updateActiveNodeItem,
    activeElementInfo,
    activeAssetElement,
    setAsset,
    activeLineElement,
    setLine,
    activeBoxElement,
    setBox,
    activeTextElement,
    setText,
    edgeName,
    isNeedAutoTopologyStatus,
    setAutoTopologyStatus,
    setToBackActionCache,
    getToBackActionCache,
    addToBackActionCache,
    resetState,
  };
});

/********************** 工场函数 **********************/

function topologyInfoFactory(): TopologyInfo {
  return {
    id: 0,
    information: '{}',
    assetGroup: [],
    switchConnectionVO: [],
    topoName: '',
    createTime: '',
    updateTime: '',
    mainTopo: false,
    description: '',
    createBy: '',
    updateBy: '',
    recordId: undefined,
  };
}

function lineUserConfigFactory(): LineUserConfig {
  return {
    uuid: '',
    lineWidth: 4,
    stroke: '#cccccc',
    lineDash: [0, 0],
    path: [
      ['M', -50, 0],
      ['L', 50, 0],
    ],
  };
}

function boxUserConfigFactory(): BoxUserConfig {
  return {
    uuid: '',
    width: 500,
    height: 500,
    lineWidth: 4,
    stroke: '#cccccc',
    lineDash: [0, 0],
    fill: '#cccccc',
  };
}

function textUserConfigFactory(): TextUserConfig {
  return {
    uuid: '',
    label: '文本',
    fontSize: 16,
    color: '#cccccc',
  };
}

function graphDataFactory(): GraphData {
  return {
    nodes: [],
    edges: [],
    combos: [],
  };
}

// Need to be used outside the setup
function useTopologyStoreWithOut() {
  const store = useStore();
  return useTopologyStore(store);
}

export {
  useTopologyStore,
  useTopologyStoreWithOut,
  topologyInfoFactory,
  lineUserConfigFactory,
  boxUserConfigFactory,
  textUserConfigFactory,
  graphDataFactory,
};
