/*
 * @Name: 绑定拓扑事件
 * @Description: 所有拓扑事件绑定和处理中心
 */

/* 类型文件 */
import type { Item, Edge, Graph, Node, NodeConfig } from '@antv/g6';
import type { ContextMenuItem } from '../../views/editor/ContextMenu/useContextMenu';
import { AssetUserConfig } from '../../types';
/* 第三方模块 */
/* 共享模块 */
import {
  STATE_TYPE,
  NODE_TYPE,
  ANCHOR_TYPE,
  PERA_LAYER,
} from '../../types/enum';
/* 业务模块 */
import { useContextMenu } from '../../views/editor/ContextMenu/useContextMenu';
import {
  useTopologyStoreWithOut,
  boxUserConfigFactory,
  lineUserConfigFactory,
  textUserConfigFactory,
} from '../../model/store';
import { BoxDragZoomEvent } from './boxDragZoom';

interface IGraphEvent {
  item: Item;
  edge: Edge;
}

function bindEvents() {
  const store = useTopologyStoreWithOut();

  const graphic = store.graphic;
  if (!graphic) return;
  /***************************************************************************
   *                                 容器Canvas逻辑                              *
   ***************************************************************************/

  /***************************************************************************
   *                                 节点NODE逻辑                              *
   ***************************************************************************/
  const boxDragInstance = new BoxDragZoomEvent(graphic);
  boxDragInstance.bootstrap();

  graphic.on('node:mouseenter', (e) => {
    if (e.item !== null) {
      const item = e.item as Node;
      const model = item.getModel() as NodeConfig;

      // 资产节点
      if (model?.type === NODE_TYPE.ASSET_NODE && model.data) {
        graphic.setItemState(e.item, STATE_TYPE.SHOW_ACHOR_STATE, true);
      }

      // line节点
      if (model?.type === NODE_TYPE.LINE_NODE) {
        graphic.setItemState(e.item, STATE_TYPE.SHOW_ACHOR_STATE, true);
      }
    }
  });

  graphic.on('node:mouseleave', (e) => {
    if (e.item !== null) {
      const item = e.item as Node;
      const model = item.getModel() as NodeConfig;

      // 资产节点
      if (model?.type === NODE_TYPE.ASSET_NODE && model.data) {
        graphic.setItemState(e.item, STATE_TYPE.SHOW_ACHOR_STATE, false);
      }

      // line节点
      if (model?.type === NODE_TYPE.LINE_NODE) {
        graphic.setItemState(e.item, STATE_TYPE.SHOW_ACHOR_STATE, false);
      }
    }
  });

  // 边hover高亮--关
  graphic.on('node:dblclick', (e) => {
    if (e.item) {
      const item = e.item as Node;
      const model = item.getModel() as NodeConfig;

      // 资产节点可配置项赋值
      if (model?.type === NODE_TYPE.ASSET_NODE && model.data) {
        const data = model.data as AssetUserConfig;
        store.setAsset(data);
      }
      // 线节点可配置项赋值
      if (model?.type === NODE_TYPE.LINE_NODE) {
        const factoryLineUserConfig = lineUserConfigFactory();
        store.setLine({
          uuid: model.id,
          path: model.style?.path || factoryLineUserConfig.path,
          lineWidth: model.style?.lineWidth || factoryLineUserConfig.lineWidth,
          stroke: model.style?.stroke || factoryLineUserConfig.stroke,
          lineDash: model.style?.lineDash || factoryLineUserConfig.lineDash,
        });
      }

      // 矩形节点可配置项赋值
      if (model?.type === NODE_TYPE.BOX_NODE) {
        const style = model.style;
        const factoryBoxUserConfig = boxUserConfigFactory();
        store.setBox({
          uuid: model.id,
          width: style?.width || factoryBoxUserConfig.width,
          height: style?.height || factoryBoxUserConfig.height,
          lineWidth: style?.lineWidth || factoryBoxUserConfig.lineWidth,
          stroke: style?.stroke || factoryBoxUserConfig.stroke,
          lineDash: style?.lineDash || factoryBoxUserConfig.lineDash,
          fill: style?.fill || factoryBoxUserConfig.fill,
        });
      }

      // 文本节点可配置项赋值
      if (model?.type === NODE_TYPE.TEXT_NODE) {
        const factoryTextUserConfig = textUserConfigFactory();
        const label = model?.label as string;
        store.setText({
          uuid: model.id,
          label: label ?? factoryTextUserConfig.label,
          fontSize:
            model.labelCfg?.style?.fontSize ?? factoryTextUserConfig.fontSize,
          color: model.labelCfg?.style?.fill ?? factoryTextUserConfig.color,
        });
      }
    }
  });

  // 元素右键菜单
  graphic.on('node:contextmenu', (e) => {
    const item = e.item;
    const [createContextMenu] = useContextMenu();
    const contextMenuItems: ContextMenuItem[] = [];
    if (item) {
      const model = item.getModel() as NodeConfig;
      // 除layer元素之外，都可以删除
      if (
        ![
          PERA_LAYER.CONTROLLER_LAYER,
          PERA_LAYER.MONITOR_LAYER,
          PERA_LAYER.OPERATION_LAYER,
        ].includes(model.id)
      ) {
        contextMenuItems.push({
          label: '删除',
          icon: 'delete',
          handler() {
            if (item) {
              graphic.removeItem(item);
            }
          },
        });
      }

      // box节点
      if (model?.type === NODE_TYPE.BOX_NODE) {
        //
        contextMenuItems.push({
          label: '置于底层',
          icon: 'dropbox',
          handler() {
            /**
             * antv-g6源码bug
             * 改源码底层库@antv/g-base toBack方法生效，但配置同步未更新，也就是 实现和配置 不同步,源码如下：
             * Element.prototype.toBack = function () {
             * var parent = this.getParent();
             * if (!parent) {
             *     return;
             * }
             * var children = parent.getChildren();
             * var el = this.get('el');
             * var index = children.indexOf(this);
             * children.splice(index, 1);
             * children.unshift(this);
             * this.onCanvasChange('zIndex');
             * };
             *
             * 解决方案：记录 toBack 动作，在save时重新执行一遍这个动作
             */
            item.toBack();
            store.addToBackActionCache(model.id);
          },
        });
        const states = item.getStates();
        if (
          Array.isArray(states) &&
          states.includes(`${STATE_TYPE.BOX_DRAG_STATE}:drag`)
        ) {
          contextMenuItems.push({
            label: '取消矩形编辑',
            icon: 'command',
            handler() {
              // box节点
              graphic.setItemState(item, STATE_TYPE.BOX_DRAG_STATE, 'default');
            },
          });
        } else {
          contextMenuItems.push({
            label: '编辑矩形大小',
            icon: 'command',
            handler() {
              // box节点
              graphic.setItemState(item, STATE_TYPE.BOX_DRAG_STATE, 'drag');
            },
          });
        }
      }
    }
    createContextMenu({
      event: e,
      items: contextMenuItems,
    });
  });

  /**
   * 虚实线节点拖拽逻辑
   */
  const p = {
    isInit: true,
    x: 0,
    y: 0,
  };

  graphic.on('node:dragstart', (e) => {
    if (e.item) {
      const item = e.item as Node;
      const model = e.item?.getModel() as NodeConfig;
      // 通用虚实线禁止拖拽，开启线条拉伸状态
      if (
        e.item &&
        model?.type &&
        [NODE_TYPE.LINE_NODE].includes(model.type as NODE_TYPE) &&
        [
          ANCHOR_TYPE.LINE_NODE_LEFT_ACHOR,
          ANCHOR_TYPE.LINE_NODE_RIGHT_ACHOR,
        ].includes(e.target.cfg.name)
      ) {
        p.x = e.x;
        p.y = e.y;
        p.isInit = false;
        if (!item?.hasLocked()) {
          item?.lock();
        }
      }
    }
  });

  graphic.on('node:mouseup', (e) => {
    if (e.item) {
      const item = e.item as Node;
      const model = e.item?.getModel() as NodeConfig;
      // 通用虚实线禁止拖拽，开启线条拉伸状态
      if (
        e.item &&
        model?.type &&
        [NODE_TYPE.LINE_NODE].includes(model.type as NODE_TYPE) &&
        [
          ANCHOR_TYPE.LINE_NODE_LEFT_ACHOR,
          ANCHOR_TYPE.LINE_NODE_RIGHT_ACHOR,
        ].includes(e.target.cfg.name) &&
        !p.isInit
      ) {
        if (item?.hasLocked()) {
          item?.unlock();
        }

        graphic.setItemState(
          e.item,
          e.target.cfg.name === ANCHOR_TYPE.LINE_NODE_LEFT_ACHOR
            ? STATE_TYPE.LINE_NODE_DRAG_LEFT_STATE
            : STATE_TYPE.LINE_NODE_DRAG_RIGHT_STATE,
          `${e.x - p.x}$$$${e.y - p.y}`
        );
        p.isInit = true;
      }
    }
  });

  /***************************************************************************
   *                                 边EDGE逻辑                              *
   ***************************************************************************/

  // 边hover高亮--开
  graphic.on('edge:mouseenter', (e: IGraphEvent) => {
    graphic.setItemState(e.item, 'edge-hover', true);
  });

  // 边hover高亮--关
  graphic.on('edge:mouseleave', (e: IGraphEvent) => {
    graphic.setItemState(e.item, 'edge-hover', false);
  });

  // 边hover高亮--关
  graphic.on('edge:beforecreateedge', (e) => {
    console.log(e, 'beforecreateedge');
  });

  // 修改创建边逻辑
  graphic.on('aftercreateedge', (e: IGraphEvent) => {
    const { edge } = e;
    // loop自环边删除
    if (edge._cfg.currentShape === 'loop') {
      setTimeout(() => {
        graphic.removeItem(edge._cfg.id as string);
      });
    }
    const sourceNodeType = edge.getSource().getModel().type;
    const targetNodeType = edge.getTarget().getModel().type;
    if (
      [NODE_TYPE.LINE_NODE].includes(sourceNodeType as NODE_TYPE) ||
      [NODE_TYPE.LINE_NODE].includes(targetNodeType as NODE_TYPE)
    ) {
      setTimeout(() => {
        graphic.removeItem(edge._cfg.id as string);
      });
    }
  });

  // 连线右键菜单
  graphic.on('edge:contextmenu', (e) => {
    const [createContextMenu] = useContextMenu();
    createContextMenu({
      event: e,
      items: [
        {
          label: '删除',
          icon: 'basic-delete',
          handler() {
            if (e.item) {
              graphic.removeItem(e.item);
            }
          },
        },
      ],
    });
  });

  /***************************************************************************
   *                                 分组COMBO逻辑                              *
   ***************************************************************************/

  // 连线右键菜单
  graphic.on('combo:contextmenu', (e) => {
    const [createContextMenu] = useContextMenu();
    createContextMenu({
      event: e,
      items: [
        {
          label: '删除',
          icon: 'basic-delete',
          handler() {
            if (e.item) {
              graphic.removeItem(e.item);
            }
          },
        },
      ],
    });
  });
}

function bindViewEvents(graphic: Graph) {}

export { bindEvents, bindViewEvents };
