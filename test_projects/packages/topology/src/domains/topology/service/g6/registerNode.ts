/*
 * @Name: 注册自定义节点
 * @Description: Do not edit
 */
import type { AssetModel, LineModel, TextModel } from '../../types';
import type { Node } from '@antv/g6';
import {
  cloneDeep,
  getProductImageByAssetTypeCode,
  cssVar,
} from '@guolisec/utils';
import {
  NODE_TYPE,
  ANCHOR_TYPE,
  SHAPE_TYPE,
  STATE_TYPE,
} from '../../types/enum';
import { handleFoucus, SIDE_WIDTH, SIDE_HEIGHT } from './nodeHelp';
import { useTopologyStoreWithOut } from '../../model/store';
import { registerBoxNodeCfg } from './boxDragZoom';
import imgDiff from '../../assets/img-diff.svg';

const registerNode = (G6) => {
  // asset node
  G6.registerNode(
    NODE_TYPE.ASSET_NODE,
    {
      draw(cfg: AssetModel, group) {
        const data = cfg.data;
        const img = getProductImageByAssetTypeCode(data.assetTypeCode, {
          color: cssVar('--color-text-base'),
        });
        const shape = group.addShape('rect', {
          name: SHAPE_TYPE.DEVICE_MAIN_BOX_SHAPE,
          attrs: {
            x: 0,
            y: 0,
            width: SIDE_WIDTH,
            height: SIDE_HEIGHT * 1.2,
          },
          zIndex: 1,
          draggable: true,
        });

        group.addShape('image', {
          name: SHAPE_TYPE.DEVICE_IMAGE_SHAPE,
          attrs: {
            x: 0,
            y: 0,
            width: SIDE_WIDTH,
            height: SIDE_HEIGHT,
            cursor: 'pointer',
            img,
          },
          draggable: true,
          zIndex: 2,
        });
        group.addShape('text', {
          name: SHAPE_TYPE.DEVICE_TEXT_SHAPE,
          attrs: {
            x: SIDE_HEIGHT * 0.5,
            y: SIDE_HEIGHT * 1.2,
            lineHeight: 20,
            fill: cssVar('--color-text-base'),
            textAlign: 'center',
            text: cfg.label || data.name,
            fontSize: 18,
          },
          draggable: true,
          zIndex: 3,
        });

        // 发生资产信息变更事件
        if (data.isChange) {
          group.addShape('image', {
            attrs: {
              x: -SIDE_WIDTH * 0.2,
              y: -SIDE_HEIGHT * 0.1,
              width: SIDE_WIDTH * 1.4,
              height: SIDE_HEIGHT * 1.4,
              img: imgDiff,
            },
            name: 'img',
            draggable: true,
            zIndex: 0,
          });
        }

        group.sort();
        return shape;
      },

      // draw anchor-point circles according to the anchorPoints in afterDraw
      afterDraw(cfg: AssetModel, group) {
        const bbox = group.getBBox();
        const anchorPoints = this.getAnchorPoints(cfg);
        anchorPoints.forEach((_anchorPos, i) => {
          group.addShape('circle', {
            attrs: {
              r: 5,
              x: bbox.x + bbox.width * 0.5,
              y: bbox.y + bbox.height * 0.5,
              fill: cssVar('--color-bg-base'),
              stroke: '#5F95FF',
            },
            name: ANCHOR_TYPE.DEVICE_ACHOR, // the name, for searching by group.find(ele => ele.get('name') === 'anchor-point')
            anchorPointIdx: i, // flag the idx of the anchor-point circle
            visible: false, // invisible by default, shows up when links > 1 or the node is in showAnchors state
            draggable: true, // allow to catch the drag events on this shape
            zIndex: 100,
          });
        });
        // 子元素层叠排序
        group.sort();
      },
      getAnchorPoints() {
        return [[0.5, 0.5]];
      },
      // response the state changes and show/hide the link-point circles
      setState(name, value, item) {
        if (name === STATE_TYPE.SHOW_ACHOR_STATE) {
          const anchorPoints = item
            .getContainer()
            .findAll((ele) => ele.get('name') === ANCHOR_TYPE.DEVICE_ACHOR);

          anchorPoints.forEach((point) => {
            point.toFront();
            if (value || point.get('links') > 0) point.show();
            else point.hide();
          });
        }
        if (name === STATE_TYPE.ASSET_NODE_FOCUS_STATE) {
          const group = item.getContainer();
          // 聚焦资产
          handleFoucus(value, group, item);
        }
      },
      // 不能删掉，覆盖继承的update方法
      update(cfg: AssetModel, node: Node) {
        const group = node.getContainer();
        const assetTypeCode = cfg.data.assetTypeCode;
        if (assetTypeCode !== undefined) {
          // 设备图片更新
          const imageShape = group.find((item) => {
            return item.cfg.name === SHAPE_TYPE.DEVICE_IMAGE_SHAPE;
          });
          if (imageShape) {
            const img = getProductImageByAssetTypeCode(assetTypeCode);
            const oldImg = imageShape.attr('img');
            if (oldImg !== img) {
              imageShape.attr('img', img);
            }
          }
        }
        // 更新label
        if (cfg.label) {
          const textShape = group.getChildByIndex(2);
          if (textShape.cfg.name === SHAPE_TYPE.DEVICE_TEXT_SHAPE) {
            textShape.attr('text', cfg.label);
          }
        }
        group.sort();
      },
    },
    'rect'
  );

  // line node
  G6.registerNode(NODE_TYPE.LINE_NODE, {
    draw(cfg: LineModel, group) {
      const shape = group.addShape('path', {
        name: SHAPE_TYPE.SOLID_LINE_PATH_SHAPE,
        attrs: {
          ...cfg.style,
          lineAppendWidth: 5,
        },
        zIndex: 1,
        draggable: true,
      });
      group.sort();
      return shape;
    },

    afterDraw(_cfg: LineModel, group) {
      const keyShape = group.getChildByIndex(0);
      const endTangent = keyShape.getEndTangent();
      const achorWidth = 4;
      // 添加左端锚点
      group.addShape('circle', {
        attrs: {
          r: achorWidth,
          x: endTangent[0][0],
          y: endTangent[0][1],
          fill: '#fff',
          stroke: cssVar('--color-primary'),
        },
        name: ANCHOR_TYPE.LINE_NODE_LEFT_ACHOR,
        anchorPointIdx: 0,
        visible: false,
        draggable: true,
        zIndex: 101,
      });

      group.addShape('circle', {
        attrs: {
          r: achorWidth,
          x: endTangent[1][0],
          y: endTangent[1][1],
          fill: '#fff',
          stroke: cssVar('--color-primary'),
        },
        name: ANCHOR_TYPE.LINE_NODE_RIGHT_ACHOR,
        anchorPointIdx: 1,
        visible: false,
        draggable: true,
        zIndex: 101,
      });
    },
    getAnchorPoints() {
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    },
    setState(name, value: string | boolean, item: Node) {
      const shape = item.get('keyShape');
      // 不知道为啥 必须提前克隆path 不然后面取不到
      const lastPath = cloneDeep(shape.attr('path'));
      // achor显示隐藏逻辑
      if (name === STATE_TYPE.SHOW_ACHOR_STATE) {
        const anchorPoints = item.getContainer().findAll((shape) => {
          const name = shape.get('name');
          return [
            ANCHOR_TYPE.LINE_NODE_LEFT_ACHOR,
            ANCHOR_TYPE.LINE_NODE_RIGHT_ACHOR,
          ].includes(name);
        });

        anchorPoints.forEach((point) => {
          point.toFront();
          if (value) point.show();
          else point.hide();
        });

        return;
      }

      if (typeof value === 'string' && value.includes('$$$')) {
        const model = item.getModel() as LineModel;
        const splits = value.split('$$$');
        const x = Number(splits[0]);
        const y = Number(splits[1]);
        const topologyStore = useTopologyStoreWithOut();
        // 左端拖拽
        if (name === STATE_TYPE.LINE_NODE_DRAG_LEFT_STATE) {
          const result = [
            ['M', lastPath[0][1] + x, lastPath[0][2] + y],
            ['L', lastPath[1][1], lastPath[1][2]],
          ];
          if (!model.style) {
            model.style = {};
          }
          model.style.path = result;
          topologyStore.updateNodeItem(item, model);
        }

        // 右端拖拽
        if (name === STATE_TYPE.LINE_NODE_DRAG_RIGHT_STATE) {
          const result = [
            ['M', lastPath[0][1], lastPath[0][2]],
            ['L', lastPath[1][1] + x, lastPath[1][2] + y],
          ];
          if (!model.style) {
            model.style = {};
          }
          model.style.path = result;
          topologyStore.updateNodeItem(item, model);
        }
      }
    },
    // 不能删掉，覆盖继承的update方法
    update: undefined,
  });

  // box node
  G6.registerNode(NODE_TYPE.BOX_NODE, registerBoxNodeCfg(), 'rect');

  // 文本节点
  G6.registerNode(NODE_TYPE.TEXT_NODE, {
    /**
     * 绘制节点/边，包含文本
     * @override
     * @param  {Object} cfg 节点的配置项
     * @param  {G.Group} group 节点的容器
     * @return {IShape} 绘制的图形
     */
    draw(cfg: TextModel, group) {
      const shape = group.addShape('text', {
        name: SHAPE_TYPE.DEVICE_TEXT_SHAPE,
        attrs: {
          x: 0,
          y: 0,
          lineHeight: 20,
          fill: cfg?.labelCfg?.style?.fill ?? '#000000',
          textAlign: 'center',
          text: cfg.label,
          fontSize: cfg?.labelCfg?.style?.fontSize ?? 16,
          shadowBlur: 0,
        },
        draggable: true,
        zIndex: 4,
      });
      group.sort();
      return shape;
    },
    update: undefined,
  });
};

export default registerNode;
