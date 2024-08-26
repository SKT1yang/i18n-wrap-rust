/*
 * @name: 创建G6实例
 * @description: createGraphic -> drawTopology -> saveTopology
 * @date: 2023-05-22 13:26:38
 * @path: \glsec\apps\rsmp\src\domain\topology\service\createGraphic.ts
 */

/* 类型文件 */
import { TopologyMode } from '../types';
/* 第三方模块 */
import G6 from '@antv/g6';

/* 本地共享模块 */
import {
  NODE_TYPE,
  EDGE_TYPE,
  BEHAVIOR_TYPE,
  STATE_TYPE,
  SHAPE_TYPE,
} from '../types/enum';
import { useTopologyStoreWithOut } from '../model/store';
import { cssVar } from '@guolisec/utils';
/* 业务模块 */
import { bindEvents, bindViewEvents } from './g6/bindEvents';
import registerNode from './g6/registerNode';
import registerEdge from './g6/registerEdge';
import registerPlugin from './g6/registerPlugin';
import registerCombo from './g6/registerCombo';
import registerBehavior from './g6/registerBehavior';

/**
 * 创建G6实例 (编辑态)
 */
function createGraphic(canvasElement: HTMLDivElement) {
  const store = useTopologyStoreWithOut();
  registerElement();
  // 生成graphic实例
  const graphic = new G6.Graph({
    container: canvasElement,
    plugins: registerPlugin(), // 配置 Grid 插件
    defaultNode: {
      type: NODE_TYPE.ASSET_NODE,
    },
    defaultEdge: {
      type: EDGE_TYPE.ASSET_POLYLINE_EDGE,
      style: {
        stroke: cssVar('--color-text-base'),
        lineWidth: 1,
      },
    },
    minZoom: 0.1,
    // 自环边hover样式
    edgeStateStyles: {
      'edge-hover': {
        fill: 'transparent',
        stroke: cssVar('--blue'),
        lineWidth: 3,
        cursor: 'pointer',
      },
    },
    enabledStack: true,
    ...createOptions({}),
  });

  graphic.get('canvas').set('localRefresh', false);

  store.setGraphic(graphic);

  bindEvents();

  return graphic;
}

/**
 * 创建G6实例 (展示态)
 */
function createViewGraphic(canvasElement: HTMLDivElement, mode: TopologyMode) {
  registerElement();
  // 生成graphic实例
  const graphic = new G6.Graph({
    container: canvasElement,
    modes: {
      default: mode === 'thumbnail' ? [] : ['drag-canvas', 'zoom-canvas'],
    },
    nodeStateStyles: {
      // 资产node 聚焦状态
      [STATE_TYPE.ASSET_NODE_FOCUS_STATE]: {
        [SHAPE_TYPE.DEVICE_IMAGE_SHAPE]: {
          shadowColor: '#00acfc',
          shadowBlur: 10,
        },
      },
    },
  });
  graphic.get('canvas').set('localRefresh', false);
  bindViewEvents(graphic);
  return graphic;
}

/**
 * 生成G6实例配置
 * @param option
 * @returns
 */
function createOptions(option) {
  const { modes } = option || {};
  const defaultModes = {
    default: [
      'drag-canvas',
      'zoom-canvas',
      'drag-node',
      'drag-combo',
      {
        type: 'click-select',
        mutiple: false,
      },
      {
        type: BEHAVIOR_TYPE.CREATE_DYNAMIC_EDGE,
        trigger: 'click',
        key: 'control',
      },
    ],
  };
  return {
    ...option,
    modes: modes || defaultModes,
  };
}

/**
 * 注册元素
 */
function registerElement() {
  // 注册自定义节点
  registerNode(G6);
  // 注册自定义边
  registerEdge(G6);
  // 注册自定义combo
  registerCombo(G6);
  // 注册自定义行为
  registerBehavior(G6);
}

export { createGraphic, createViewGraphic };
