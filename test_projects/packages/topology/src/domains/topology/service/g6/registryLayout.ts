import { LAYOUT_TYPE, PERA_LAYER } from '../../types/enum';

function registerLayout(G6) {
  G6.registerLayout(LAYOUT_TYPE.PERA_LAYER_LAYOUT, {
    execute() {
      const instance = new PeraLayerLayout(this);
      instance.execute();
    },
    updateCfg(cfg) {
      Object.assign(this, cfg);
    },
  });
}

type LayoutConfig = {
  nodes: any[];
  skip?: boolean;
  start?: [number, number];
  layerSep?: number;
  orientation?: Orientation;
  options?: RectOption[];
};

type RectOption = {
  type: PERA_LAYER;
  nodeFilter: (nodes: any[]) => any[];
  orientationNum: number;
  nodeSep: number;
  nodeSize: number;
  margin: number;
  minWidth?: number;
  minHeight: number;
};

type LayoutOption = {
  start: [number, number];
  orientationNum: number;
  nodeSep: number;
  nodeSize: number;
  margin: number;
  orientation: Orientation;
};

type Orientation = 'vertical' | 'horizontal';

type Bound = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

class PeraLayerLayout {
  nodes: any[] = [];
  skip: boolean;
  start: [number, number];
  layerSep: number;
  orientation: Orientation;
  options: RectOption[];
  constructor(config: LayoutConfig) {
    const {
      nodes,
      options,
      skip = false,
      start = [0, 0],
      layerSep = 10,
      orientation = 'vertical',
    } = config;
    this.nodes = nodes;
    this.skip = skip;
    this.start = start;
    this.layerSep = layerSep;
    this.orientation = orientation;
    this.options = options || [
      {
        type: PERA_LAYER.OPERATION_LAYER,
        nodeFilter(nodes: any[]) {
          return nodes.filter((node) => {
            return (
              node.data &&
              node.data.id &&
              node.data.layer === 3 &&
              node.data.assetTypeCode !== 8
            );
          });
        },
        nodeSep: 10,
        nodeSize: 300,
        orientationNum: 15,
        margin: 40,
        minHeight: 300,
      },
      {
        type: PERA_LAYER.OPERATION_LAYER,
        nodeFilter(nodes: any[]) {
          return nodes.filter((node) => {
            return (
              node.data &&
              node.data.id &&
              node.data.layer === 3 &&
              node.data.assetTypeCode === 8
            );
          });
        },
        nodeSep: 10,
        nodeSize: 300,
        orientationNum: 15,
        margin: 40,
        minHeight: 0,
      },
      {
        type: PERA_LAYER.MONITOR_LAYER,
        nodeFilter(nodes: any[]) {
          return nodes.filter((node) => {
            return (
              node.data &&
              node.data.id &&
              node.data.layer === 2 &&
              node.data.assetTypeCode !== 8
            );
          });
        },
        nodeSep: 10,
        nodeSize: 300,
        orientationNum: 15,
        margin: 40,
        minHeight: 300,
      },
      {
        type: PERA_LAYER.MONITOR_LAYER,
        nodeFilter(nodes: any[]) {
          return nodes.filter((node) => {
            return (
              node.data &&
              node.data.id &&
              node.data.layer === 2 &&
              node.data.assetTypeCode === 8
            );
          });
        },
        nodeSep: 10,
        nodeSize: 300,
        orientationNum: 15,
        margin: 40,
        minHeight: 0,
      },
      {
        type: PERA_LAYER.CONTROLLER_LAYER,
        nodeFilter(nodes: any[]) {
          return nodes.filter((node) => {
            return (
              node.data &&
              node.data.id &&
              node.data.layer === 1 &&
              node.data.assetTypeCode !== 8
            );
          });
        },
        nodeSep: 10,
        nodeSize: 300,
        orientationNum: 15,
        margin: 40,
        minHeight: 300,
      },
      {
        type: PERA_LAYER.CONTROLLER_LAYER,
        nodeFilter(nodes: any[]) {
          return nodes.filter((node) => {
            return (
              node.data &&
              node.data.id &&
              node.data.layer === 1 &&
              node.data.assetTypeCode === 8
            );
          });
        },
        nodeSep: 10,
        nodeSize: 300,
        orientationNum: 15,
        margin: 40,
        minHeight: 0,
      },
    ];
  }

  execute() {
    // 跳过，不执行布局
    if (this.skip) {
      return this.nodes;
    }

    let nextStart = this.start.slice() as [number, number];
    let layerTypeInfo: {
      bounds: Bound[];
      currentLayerType?: PERA_LAYER;
    } = {
      currentLayerType: undefined,
      bounds: [],
    };
    // 逐个渲染rect
    for (let index = 0; index < this.options.length; index++) {
      const option = this.options[index];
      layerTypeInfo.currentLayerType = option.type;
      const currentNodes = option.nodeFilter(this.nodes);
      this.layout(currentNodes, {
        start: nextStart,
        orientation: this.orientation,
        ...option,
      });

      // 计算宽高
      const { width, height } = this.getBoundingClientRect(
        option,
        currentNodes.length,
        this.orientation
      );

      const bound = {
        x: nextStart[0],
        y: nextStart[1],
        width: width,
        height: height,
      };
      layerTypeInfo.bounds.push(bound);
      if (this.orientation === 'vertical') {
        nextStart = [nextStart[0], nextStart[1] + height + this.layerSep];
      } else {
        nextStart = [nextStart[0] + width + this.layerSep, nextStart[1]];
      }

      // 如果layer信息发生改变或者是最后一层，可以布局对应layer容器元素了
      const nextLayerOption = this.options[index + 1];
      if (
        nextLayerOption === undefined ||
        (nextLayerOption &&
          nextLayerOption.type !== layerTypeInfo.currentLayerType)
      ) {
        const renderBound: Bound = {};
        for (let index = 0; index < layerTypeInfo.bounds.length; index++) {
          const bound = layerTypeInfo.bounds[index];
          if (renderBound.x === undefined) {
            renderBound.x = bound.x;
          }
          if (renderBound.y === undefined) {
            renderBound.y = bound.y;
          }
          if (renderBound.width === undefined) {
            renderBound.width = bound.width;
          } else {
            renderBound.width =
              bound.width > renderBound.width ? bound.width : renderBound.width;
          }
          if (renderBound.height === undefined) {
            renderBound.height = bound.height;
          } else {
            renderBound.height =
              renderBound.height +
              bound.height +
              (nextLayerOption === undefined ? 0 : this.layerSep);
          }
        }
        // 找到对应layer node配置项，更改配置
        const targetNode = this.nodes.find(
          (node) => node.id === layerTypeInfo.currentLayerType
        );
        if (targetNode) {
          targetNode.x = renderBound.x + renderBound.width / 2;
          targetNode.y = renderBound.y + renderBound.height / 2;
          targetNode.style.width = renderBound.width;
          targetNode.style.height = renderBound.height;
        }
        layerTypeInfo = {
          currentLayerType: undefined,
          bounds: [],
        };
      }
    }
    return this.nodes;
  }

  /**
   * 计算当前矩形宽高（逻辑宽高，不是combo宽高）
   * @param orientationNum
   * @param nodeSep
   * @param nodeSize
   * @param margin
   * @param nodeNumber
   * @returns
   */
  getBoundingClientRect(
    option: RectOption,
    nodeNumber: number,
    orientation: Orientation
  ) {
    const { orientationNum, nodeSize, nodeSep, margin, minHeight } = option;
    // node数量为0 无长宽
    if (nodeNumber === 0) {
      return {
        width: orientationNum * nodeSize + orientationNum * nodeSep,
        height: minHeight || 0,
      };
    }
    const rows = Math.ceil(nodeNumber / orientationNum);
    // 计算宽高
    let width = orientationNum * nodeSize + orientationNum * nodeSep;
    let height = rows * nodeSize + rows * nodeSep;

    if (orientation === 'horizontal') {
      width += margin * 2;
    } else {
      height += margin * 2;
    }

    return {
      width,
      height,
    };
  }

  /**
   * 执行矩形布局
   * @param nodes 节点集合
   * @param option 配置项
   */
  layout(nodes: any[], option: LayoutOption) {
    const { start, orientationNum, nodeSep, nodeSize, margin, orientation } =
      option;

    // 首节点坐标
    let firstNodeX = start[0] + nodeSep / 2 + nodeSize / 2;
    let firstNodeY = start[1] + nodeSep / 2 + nodeSize / 2;

    if (orientation === 'horizontal') {
      firstNodeX += margin;
    } else {
      firstNodeY += margin;
    }
    // 遍历并修改坐标
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      const colIndex = index % orientationNum;
      const rowIndex = Math.floor(index / orientationNum);

      /***************************************************************************/
      /********************** 修改节点坐标，最终影响显示的代码 **********************/
      /***************************************************************************/
      node.x = firstNodeX + (colIndex * nodeSep + colIndex * nodeSize);
      node.y = firstNodeY + (rowIndex * nodeSep + rowIndex * nodeSize);
    }
  }
}

export { registerLayout, PeraLayerLayout };
