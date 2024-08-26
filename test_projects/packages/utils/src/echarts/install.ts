/*
 * @Name: Do not edit
 * @Description: Do not edit
 * @Author: lkq
 * @Date: 2022-03-02 08:47:59
 * @LastEditTime: 2023-09-13 21:54:45
 * @LastEditors: Please set LastEditors
 */
import * as echarts from 'echarts/core';

import {
  BarChart,
  LineChart,
  PieChart,
  PictorialBarChart,
  GaugeChart,
  ScatterChart,
  GraphChart,
  CustomChart,
  HeatmapChart,
} from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,
  AxisPointerComponent,
  DataZoomInsideComponent,
  DatasetComponent,
  GeoComponent,
} from 'echarts/components';

import {
  // SVGRenderer,
  CanvasRenderer,
} from 'echarts/renderers';

echarts.use([
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  BarChart,
  LineChart,
  PieChart,
  CanvasRenderer,
  PictorialBarChart,
  DataZoomComponent,
  VisualMapComponent,
  AxisPointerComponent,
  DataZoomInsideComponent,
  DatasetComponent,
  GeoComponent,
  GaugeChart,
  ScatterChart,
  GraphChart,
  CustomChart,
  HeatmapChart,
]);

export default echarts;
