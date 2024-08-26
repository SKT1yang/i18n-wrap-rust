/*
 * @name: 拓扑中元素类型
 * @description: Do not edit
 * @date: 2023-02-15 18:35:29
 * @path: \glsec\apps\rsmp\src\domain\topology\enum.ts
 */
type ElementType = NODE_TYPE | EDGE_TYPE | COMBO_TYPE;

// 节点
enum NODE_TYPE {
  // 资产
  ASSET_NODE = 'asset-node',
  // 线条
  LINE_NODE = 'line-node',
  // 文本
  TEXT_NODE = 'text-node',
  // 矩形
  BOX_NODE = 'box-node',
}

// 边
enum EDGE_TYPE {
  // 直线
  ASSET_LINE_EDGE = 'asset-line-edge',
  // 折线
  ASSET_POLYLINE_EDGE = 'asset-polyline-edge',
}

// combo
enum COMBO_TYPE {}

enum PERA_LAYER {
  // 基本控制层
  CONTROLLER_LAYER = 'pera-layer-1',
  // 区域监控系统层
  MONITOR_LAYER = 'pera-layer-2',
  // 现场运营层（操作层）
  OPERATION_LAYER = 'pera-layer-3',
}

// behavior行为
enum BEHAVIOR_TYPE {
  // 创建连线（边）
  CREATE_DYNAMIC_EDGE = 'create-dynamic-edge',
}

enum LAYOUT_TYPE {
  // 普渡模型布局层
  PERA_LAYER_LAYOUT = 'pera-layer-layout',
}
// 锚点
enum ANCHOR_TYPE {
  // 设备连线锚点
  DEVICE_ACHOR = 'device-anchor',
  // 线条做锚点
  LINE_NODE_LEFT_ACHOR = 'line-node-left-anchor',
  // 线条右锚点
  LINE_NODE_RIGHT_ACHOR = 'line-node-right-anchor',
  COMBO_LEFT_TOP_ACHOR = 'combo-left-top-anchor',
  COMBO_RIGHT_TOP_ACHOR = 'combo-right-top-anchor',
  COMBO_LEFT_BOTTOM_ACHOR = 'combo-left-bottom-anchor',
  COMBO_RIGHT_BOTTOM_ACHOR = 'combo-right-bottom-anchor',
}

// 图形
enum SHAPE_TYPE {
  DEVICE_MAIN_BOX_SHAPE = 'asset-main-box-shape',
  DEVICE_IMAGE_SHAPE = 'asset-image-shape',
  DEVICE_TEXT_SHAPE = 'asset-text-shape',
  SOLID_LINE_PATH_SHAPE = 'solid-line-path-shape',
  BOX_RECT_SHAPE = 'box-rect-shape',
  BOX_TEXT_LABEL_SHAPE = 'box-text-label-shape',
  BOX_TEXT_SUB_LABEL_SHAPE = 'box-text-sub-label-shape',
  BOX_LEFT_BAR_SHAPE = 'box-left-bar-shape',
  BOX_RECT_MASK_SHAPE = 'box-rect-mask-shape',
  BOX_LEFT_CONTROL_POINT = 'box-left-control-point-shape',
  BOX_TOP_CONTROL_POINT = 'box-top-control-point-shape',
  BOX_RIGHT_CONTROL_POINT = 'box-right-control-point-shape',
  BOX_BOTTOM_CONTROL_POINT = 'box-bottom-control-point-shape',
}

// 状态
enum STATE_TYPE {
  SHOW_ACHOR_STATE = 'show-achor-state',
  LINE_NODE_DRAG_LEFT_STATE = 'line-node-drag-left-state',
  LINE_NODE_DRAG_RIGHT_STATE = 'line-node-drag-right-state',
  BOX_DRAG_STATE = 'box-drag-state',
  ASSET_NODE_FOCUS_STATE = 'asset-node-focus-state',
}

/**
 * 左边自定义可拖拽元素类型
 */
enum DRAGGABLE_ELEMENT_TYPE {
  ASSET = NODE_TYPE.ASSET_NODE,
  LINE = 'line',
  BOX = 'box',
  TEXT = 'text',
}

export {
  NODE_TYPE,
  EDGE_TYPE,
  ANCHOR_TYPE,
  SHAPE_TYPE,
  STATE_TYPE,
  DRAGGABLE_ELEMENT_TYPE,
  COMBO_TYPE,
  PERA_LAYER,
  BEHAVIOR_TYPE,
  LAYOUT_TYPE,
  type ElementType,
};
