/*
 * @Name: 注册box节点
 * @Description:
 */

import type { Graph } from '@antv/g6';
import type { BoxModel } from '../../types';
import { cssVar } from '@guolisec/utils';
import { SHAPE_TYPE, STATE_TYPE, PERA_LAYER } from '../../types/enum';

type BoxPointType =
  | SHAPE_TYPE.BOX_LEFT_CONTROL_POINT
  | SHAPE_TYPE.BOX_TOP_CONTROL_POINT
  | SHAPE_TYPE.BOX_RIGHT_CONTROL_POINT
  | SHAPE_TYPE.BOX_BOTTOM_CONTROL_POINT;

function registerBoxNodeCfg() {
  return {
    draw(cfg: BoxModel, group) {
      const style = this.getStyle(cfg); // node 样式
      console.log('boxDragZoom draw', cfg, style);
      const shape = group.addShape('rect', {
        attrs: {
          ...style,
          // 当是layer盒子时这个fill不能不写，且不允许是其他值，不然edge会被遮住
          fill: [
            PERA_LAYER.CONTROLLER_LAYER,
            PERA_LAYER.MONITOR_LAYER,
            PERA_LAYER.OPERATION_LAYER,
          ].includes(cfg.id as PERA_LAYER)
            ? ''
            : style.fill,
          lineAppendWidth: 20,
        },
        visible: true,
        zIndex: -1,
        name: SHAPE_TYPE.BOX_RECT_SHAPE,
      });

      // 一级标题
      group.addShape('text', {
        name: SHAPE_TYPE.BOX_TEXT_LABEL_SHAPE,
        attrs: {
          x: -style.width / 2 + 40,
          y: -style.height / 2 + 60,
          fill: cssVar('--color-text-base'),
          text: cfg.label,
          fontSize: 40,
        },
        draggable: true,
        zIndex: 3,
      });

      // 二级标题
      if (cfg.data && cfg.data.subTitle) {
        group.addShape('text', {
          name: SHAPE_TYPE.BOX_TEXT_SUB_LABEL_SHAPE,
          attrs: {
            x: -style.width / 2 + 40,
            y: -style.height / 2 + 110,
            fill: '#999999',
            text: cfg.data.subTitle,
            fontSize: 30,
          },
          draggable: true,
          zIndex: 3,
        });
      }

      if (cfg.data && cfg.data.showBar) {
        group.addShape('rect', {
          attrs: {
            x: -style.width / 2,
            y: -style.height / 2,
            width: 20,
            height: style.height,
            fill: '#1283e5',
          },
          name: SHAPE_TYPE.BOX_LEFT_BAR_SHAPE,
        });
      }

      group.addShape('rect', {
        attrs: {
          ...style,
          fill: '#E7F7FE',
          stroke: '#1890ff',
          fillOpacity: 0.7,
        },
        visible: false,
        name: SHAPE_TYPE.BOX_RECT_MASK_SHAPE,
        className: SHAPE_TYPE.BOX_RECT_MASK_SHAPE,
      });
      this.addControlPoint(group, style);

      return shape;
    },
    addControlPoint(group, style) {
      group.addShape('circle', {
        attrs: {
          r: 4,
          fill: '#1890ff',
          stroke: cssVar('--color-bg-base'),
          strokeOpacity: 0,
          lineWidth: 20,
          x: 0,
          y: -style.height / 2,
          cursor: 'ns-resize',
        },
        visible: false,
        className: 'control-point',
        name: SHAPE_TYPE.BOX_TOP_CONTROL_POINT,
      });
      group.addShape('circle', {
        attrs: {
          r: 4,
          fill: '#1890ff',
          stroke: '#fff',
          strokeOpacity: 0,
          lineWidth: 20,
          x: style.width / 2,
          y: 0,
          cursor: 'ew-resize',
        },
        visible: false,
        className: 'control-point',
        name: SHAPE_TYPE.BOX_RIGHT_CONTROL_POINT,
      });
      group.addShape('circle', {
        attrs: {
          r: 4,
          fill: '#1890ff',
          stroke: '#fff',
          strokeOpacity: 0,
          lineWidth: 20,
          x: 0,
          y: style.height / 2,
          cursor: 'ns-resize',
        },
        visible: false,
        className: 'control-point',
        name: SHAPE_TYPE.BOX_BOTTOM_CONTROL_POINT,
      });
      group.addShape('circle', {
        attrs: {
          r: 4,
          fill: '#1890ff',
          stroke: '#fff',
          strokeOpacity: 0,
          lineWidth: 20,
          x: -style.width / 2,
          y: 0,
          cursor: 'ew-resize',
        },
        visible: false,
        className: 'control-point',
        name: SHAPE_TYPE.BOX_LEFT_CONTROL_POINT,
      });
    },
    update(cfg, item) {
      console.log('boxDragZoom update');
      const model = item.getModel();
      const group = item.getContainer();

      const { width, height } = cfg.style;
      const node = group.getFirst();
      node.attr({
        ...model.style,
        x: -width / 2,
        y: -height / 2,
      });

      group.getChildren().forEach((child) => {
        if (child.cfg) {
          if (child.cfg.name) {
            if (child.cfg.name === SHAPE_TYPE.BOX_RECT_MASK_SHAPE) {
              child.attr({
                width,
                height,
                x: -width / 2,
                y: -height / 2,
              });
            }
            if (child.cfg.name === SHAPE_TYPE.BOX_TEXT_LABEL_SHAPE) {
              child.attr({
                x: -width / 2 + 40,
                y: -height / 2 + 60,
              });
            }
            if (child.cfg.name === SHAPE_TYPE.BOX_TEXT_SUB_LABEL_SHAPE) {
              child.attr({
                x: -width / 2 + 40,
                y: -height / 2 + 110,
              });
            }
            if (child.cfg.name === SHAPE_TYPE.BOX_LEFT_BAR_SHAPE) {
              child.attr({
                x: -width / 2,
                y: -height / 2,
                height: height,
              });
            }
          }

          if (child.cfg.className) {
            if (child.cfg.className === 'control-point') {
              switch (child.cfg.name) {
                case SHAPE_TYPE.BOX_TOP_CONTROL_POINT:
                  child.attr({ y: -height / 2 });
                  break;
                case SHAPE_TYPE.BOX_RIGHT_CONTROL_POINT:
                  child.attr({ x: width / 2 });
                  break;
                case SHAPE_TYPE.BOX_BOTTOM_CONTROL_POINT:
                  child.attr({ y: height / 2 });
                  break;
                case SHAPE_TYPE.BOX_LEFT_CONTROL_POINT:
                  child.attr({ x: -width / 2 });
                  break;
              }
            }
          }
        }
      });
    },
    setState(name, value, item) {
      if (name === STATE_TYPE.BOX_DRAG_STATE) {
        const visible = value === 'drag';
        const group = item.getContainer();
        const children = group.getChildren();

        children.forEach((child) => {
          if (child.cfg && child.cfg.className) {
            if (
              child.cfg.className === 'control-point' ||
              child.cfg.className === SHAPE_TYPE.BOX_RECT_MASK_SHAPE
            ) {
              if (visible) {
                child.show();
              } else {
                child.hide();
              }
            }
          }
        });
      }
    },
    /**
     * 获取节点的样式，供基于该节点自定义时使用
     * @param {Object} cfg 节点数据模型
     * @return {Object} 节点的样式
     */
    getStyle(cfg) {
      const width = cfg.style.width;
      const height = cfg.style.height;
      const styles = Object.assign(
        {
          x: -width / 2,
          y: -height / 2,
        },
        cfg.style
      );
      return styles;
    },
  };
}

class BoxDragZoomEvent {
  graphic: Graph;
  startPointType = '';
  startPoint = {
    x: 0,
    y: 0,
  };
  boxGragging = false;

  constructor(graphicInstance: Graph) {
    this.graphic = graphicInstance;
  }

  set setGragging(value) {
    this.boxGragging = Boolean(value);
  }

  set setStartPoint(position) {
    this.startPoint = position;
  }

  handleMousedown() {
    this.onMousedown(SHAPE_TYPE.BOX_LEFT_CONTROL_POINT);
    this.onMousedown(SHAPE_TYPE.BOX_TOP_CONTROL_POINT);
    this.onMousedown(SHAPE_TYPE.BOX_RIGHT_CONTROL_POINT);
    this.onMousedown(SHAPE_TYPE.BOX_BOTTOM_CONTROL_POINT);
  }

  onMousedown(shapeName: BoxPointType) {
    this.graphic.on(`${shapeName}:mousedown`, (e) => {
      this.startPointType = shapeName;
      this.startPoint = {
        x: e.x,
        y: e.y,
      };
      if (!this.boxGragging) {
        this.boxGragging = true;
      }
    });
  }

  handleMousemove() {
    this.onMousemove(SHAPE_TYPE.BOX_LEFT_CONTROL_POINT);
    this.onMousemove(SHAPE_TYPE.BOX_TOP_CONTROL_POINT);
    this.onMousemove(SHAPE_TYPE.BOX_RIGHT_CONTROL_POINT);
    this.onMousemove(SHAPE_TYPE.BOX_BOTTOM_CONTROL_POINT);
  }

  onMousemove(shapeName: BoxPointType) {
    this.graphic.on(`${shapeName}:mousemove`, (e) => {
      if (e.item !== null) {
        if (this.boxGragging) {
          this.boxGragging = true;
          this.updateNodeSize(
            this.graphic,
            e.item,
            e.x - this.startPoint.x,
            e.y - this.startPoint.y,
            shapeName
          );
          this.startPoint = {
            x: e.x,
            y: e.y,
          };
        }
      }
    });
  }

  handleMouseup() {
    this.onMouseup(SHAPE_TYPE.BOX_LEFT_CONTROL_POINT);
    this.onMouseup(SHAPE_TYPE.BOX_TOP_CONTROL_POINT);
    this.onMouseup(SHAPE_TYPE.BOX_RIGHT_CONTROL_POINT);
    this.onMouseup(SHAPE_TYPE.BOX_BOTTOM_CONTROL_POINT);
  }

  onMouseup(shapeName: BoxPointType) {
    this.graphic.on(`${shapeName}:mouseup`, (e) => {
      if (e.item !== null) {
        this.initState();
      }
    });
  }

  handleMouseleave() {
    this.onMouseleave(SHAPE_TYPE.BOX_LEFT_CONTROL_POINT);
    this.onMouseleave(SHAPE_TYPE.BOX_TOP_CONTROL_POINT);
    this.onMouseleave(SHAPE_TYPE.BOX_RIGHT_CONTROL_POINT);
    this.onMouseleave(SHAPE_TYPE.BOX_BOTTOM_CONTROL_POINT);
  }

  onMouseleave(shapeName: BoxPointType) {
    this.graphic.on(`${shapeName}:mouseleave`, (e) => {
      if (e.item !== null) {
        this.initState();
      }
    });
  }

  updateNodeSize(graphic, item, dx, dy, type: BoxPointType) {
    const model = item.getModel();

    switch (type) {
      case SHAPE_TYPE.BOX_LEFT_CONTROL_POINT:
        model.style.width -= 2 * dx;
        break;
      case SHAPE_TYPE.BOX_TOP_CONTROL_POINT:
        model.style.height -= 2 * dy;
        break;
      case SHAPE_TYPE.BOX_RIGHT_CONTROL_POINT:
        model.style.width += 2 * dx;
        break;
      case SHAPE_TYPE.BOX_BOTTOM_CONTROL_POINT:
        model.style.height += 2 * dy;
        break;
      default:
        break;
    }
    // 长宽为0禁止改变
    if (model.style.x <= 0 || model.style.x <= 0) {
      console.warn('禁止缩小长宽到0');
      this.initState();
      return;
    }
    graphic.updateItem(item, model);
  }

  initState() {
    this.startPointType = '';
    this.startPoint = {
      x: 0,
      y: 0,
    };
    if (this.boxGragging) {
      this.boxGragging = false;
    }
  }

  bootstrap() {
    this.handleMousedown();
    this.handleMousemove();
    this.handleMouseup();
    this.handleMouseleave();
  }
}

export { registerBoxNodeCfg, BoxDragZoomEvent };
