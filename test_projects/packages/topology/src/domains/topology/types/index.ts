import { NodeConfig } from '@antv/g6';
import { DRAGGABLE_ELEMENT_TYPE } from './enum';
import { IAsset, IAssetGroup } from '@guolisec/types';

/********************** 元素区 **********************/

/**
 * 通用元素类型信息
 */
interface CommonElementTypeInfo {
  id: string;
  label: string;
  elementType: DRAGGABLE_ELEMENT_TYPE;
}

/********************** G6 **********************/
declare module '@antv/g6' {
  interface NodeConfig {
    data?: AssetUserConfig | BoxData;
  }
}

/**
 * asset node model
 */
interface AssetModel extends NodeConfig {
  data: AssetUserConfig;
}

/**
 * line node model
 */
type LineModel = NodeConfig;

/**
 * box node model
 */
interface BoxModel extends NodeConfig {
  data: BoxData;
}

type BoxData = {
  subTitle?: string;
  showBar?: boolean;
  layer?: number;
};

/**
 * text node model
 */
type TextModel = NodeConfig;

// 拓扑模式
type TopologyMode = 'edit' | 'view' | 'thumbnail';

/********************** 可配置项 **********************/

// 资产node可配置项
type AssetUserConfig = IAsset & {
  uuid: string;
  // 拓扑变更（资产信息发生变更）
  isChange?: boolean;
};

// 线条可配置项
type LineUserConfig = {
  uuid: string;
  // 线宽(px)
  lineWidth: number;
  // 颜色
  stroke: string;
  // 线型
  lineDash: LineDashStyle;
  path: string | any[];
};

// 矩形可配置项
type BoxUserConfig = {
  uuid: string;
  width: number;
  height: number;
  // 线宽(px)
  lineWidth: number;
  // 描边颜色
  stroke: string;
  // 线型
  lineDash: LineDashStyle;
  // 填充颜色
  fill: string;
};

// 文字可配置项
type TextUserConfig = {
  uuid: string;
  label: string;
  // 文字大小(px)
  fontSize: number;
  // 文字颜色
  color: string;
};

// 线型
type LineDashStyle = number[];

/********************** 后端数据结构 **********************/

interface TopologyInfo {
  id: number;
  information: string;
  assetGroupIds?: number[];
  assetGroup: IAssetGroup[];
  switchConnectionVO: SwitchConnectionVO[];
  topoName: string;
  mainTopo: boolean;
  description: string;
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
  recordId?: number;
}

interface SwitchConnectionVO {
  srcIp: string;
  srcMac: string;
  srcLayer: number;
  srcType: string;
  srcTypeCode: number;
  dstIp: string;
  dstMac: string;
  dstLayer: number;
  dstType: string;
  dstTypeCode: number;
}

interface TopologyQuery {
  id?: number;
  information: string;
  description: string;
  assetGroupIds?: string[];
  topoName: string;
  mainTopo: boolean;
  sourceTopoId?: number;
}

export type {
  CommonElementTypeInfo,
  AssetModel,
  LineModel,
  BoxModel,
  TextModel,
  AssetUserConfig,
  LineUserConfig,
  BoxUserConfig,
  TextUserConfig,
  LineDashStyle,
  TopologyMode,
  TopologyInfo,
  SwitchConnectionVO,
  TopologyQuery,
  BoxData,
};
