/*
 * @Name: 注册自定义边
 * @Description: Do not edit
 * @Author: ygd
 * @Date: 2022-03-17 16:02:25
 * @LastEditTime: 2023-08-17 08:49:14
 * @LastEditors: Please set LastEditors
 */
import { EDGE_TYPE } from '../../types/enum';
import { Edge } from '@antv/g6';
import { cssVar } from '@guolisec/utils';

let currentStrokeColor = cssVar('--color-text-base');
const registerEdge = (G6) => {
  // 注册常规连线（折线）
  G6.registerEdge(
    EDGE_TYPE.ASSET_POLYLINE_EDGE,
    {
      getPath(points) {
        const startPoint = points[0];
        const endPoint = points[1];

        return [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y],
          ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y],
          ['L', endPoint.x, endPoint.y],
        ];
      },
      getShapeStyle(cfg) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const controlPoints = this.getControlPoints(cfg);
        let points = [startPoint];
        if (controlPoints) {
          points = points.concat(controlPoints);
        }

        points.push(endPoint);
        const path = this.getPath(points);
        const style = Object.assign(
          {},
          G6.Global.defaultEdge.style,
          {
            lineWidth: 4,
            path,
          },
          cfg.style,
          {
            stroke: currentStrokeColor,
          }
        );

        return style;
      },
      setState: setEdgeState,
    },
    'polyline'
  );

  // 注册直线
  G6.registerEdge(
    EDGE_TYPE.ASSET_LINE_EDGE,
    {
      getPath(points) {
        const startPoint = points[0];
        const endPoint = points[1];

        return [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x, endPoint.y],
        ];
      },
      getShapeStyle(cfg) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        const controlPoints = this.getControlPoints(cfg);
        let points = [startPoint];
        if (controlPoints) {
          points = points.concat(controlPoints);
        }

        points.push(endPoint);
        const path = this.getPath(points);
        const style = Object.assign(
          {},
          G6.Global.defaultEdge.style,
          {
            lineWidth: 4,
            path,
          },
          cfg.style,
          {
            stroke: currentStrokeColor,
          }
        );

        return style;
      },
      setState: setEdgeState,
    },
    'line'
  );
};

/**
 * edge状态动画回调函数
 * @param name
 * @param value
 * @param item
 */
function setEdgeState(name, value: string, item: Edge) {
  const shape = item.get('keyShape');
  const group = item.get('group');
  // 路径动画
  if (name === 'running') {
    if (value) {
      running(value, group, shape);
    }
  }
  // edge hover
  if (name === 'edge-hover') {
    if (value) {
      shape.attr({
        fill: 'transparent',
        stroke: cssVar('--color-primary'),
        lineWidth: 2,
        cursor: 'pointer',
      });
    } else {
      shape.attr({
        stroke: currentStrokeColor,
        lineWidth: 1,
      });
    }
  }
}

/**
 * 路径动画
 * @param value
 * @param group
 * @param shape
 */
function running(value, group, shape) {
  // 例子 `3000-1-0-0.123154`
  const [duration, direction, ratio, _idx] = value.split('-');
  const startPoint = shape.getPoint(Number(ratio));
  const circle = group.addShape('circle', {
    attrs: {
      r: 10,
      x: startPoint.x,
      y: startPoint.y,
      fill: 'white',
      stroke: 'red',
    },
    name: 'running-symbol-circle',
    zIndex: 100,
  });

  circle.animate(
    (ratio: number) => {
      const tmpPoint = shape.getPoint(
        Number(direction) === 1 ? ratio : 1 - ratio
      );
      return {
        x: tmpPoint.x,
        y: tmpPoint.y,
      };
    },
    {
      callback() {
        group.removeChild(circle);
      },
      duration: Number(duration),
    }
  );
}

export default registerEdge;
