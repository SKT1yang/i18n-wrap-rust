/* 类型文件 */
import type { IG6GraphEvent } from '@antv/g6';
import type { CommonElementTypeInfo } from '../types';
import { Asset } from '@guolisec/utils';
import { IAsset } from '@guolisec/types';
/* 第三方模块 */
import { Graph } from '@antv/g6';
import { uuid } from '@guolisec/utils';
import { message } from '@guolisec/toast';
/* 本地模块 */

import { NODE_TYPE, DRAGGABLE_ELEMENT_TYPE } from '../types/enum.ts';
import {
  AssetUserConfig,
  LineUserConfig,
  BoxUserConfig,
  TextUserConfig,
} from '../types';

import {
  useTopologyStoreWithOut,
  lineUserConfigFactory,
  boxUserConfigFactory,
  textUserConfigFactory,
} from '../model/store';

/**
 * 创建资产节点
 * @param Graphic G6实例
 * @param e G6事件
 * @param data 资产信息
 */
async function dragCreateAssetNode(
  Graphic: Graph,
  e: IG6GraphEvent,
  assetInfo: IAsset
) {
  const store = useTopologyStoreWithOut();
  const elementEmptyData: AssetUserConfig = {
    uuid: uuid(),
    ...new Asset(),
    ...assetInfo,
  };
  const assetList = store.getAllAssetElementDataList();
  const ids = assetList.map((i) => i?.id);
  if (elementEmptyData.id && ids.includes(elementEmptyData.id)) {
    message.warning('资产已存在');
    return;
  }
  const { canvasX, canvasY } = e;
  const { x, y } = Graphic.getPointByCanvas(canvasX, canvasY);
  const block = {
    id: elementEmptyData.uuid,
    type: NODE_TYPE.ASSET_NODE,
    x,
    y,
    label: assetInfo.name,
    labelCfg: {
      position: 'bottom',
      offset: 25,
    },
    data: elementEmptyData,
  };
  Graphic?.addItem('node', block, true);
  store.setAsset(elementEmptyData);
}

/**
 * 创建通用类型节点
 * @param Graphic G6实例
 * @param e G6事件
 * @param elementInfo 通用节点信息
 */
async function dragCreateCommonNode(
  Graphic: Graph,
  e: IG6GraphEvent,
  elementInfo: CommonElementTypeInfo
) {
  const { canvasX, canvasY } = e;
  const { x, y } = Graphic.getPointByCanvas(canvasX, canvasY);

  const store = useTopologyStoreWithOut();
  switch (elementInfo.elementType) {
    case DRAGGABLE_ELEMENT_TYPE.LINE:
      const lineUserConfig: LineUserConfig = {
        ...lineUserConfigFactory(),
        uuid: uuid(),
      };
      Graphic?.addItem(
        'node',
        {
          id: lineUserConfig.uuid,
          type: NODE_TYPE.LINE_NODE,
          x,
          y,
          style: {
            lineWidth: lineUserConfig.lineWidth,
            stroke: lineUserConfig.stroke,
            path: lineUserConfig.path,
            lineDash: lineUserConfig.lineDash,
          },
        },
        true
      );
      store.setLine(lineUserConfig);
      break;
    case DRAGGABLE_ELEMENT_TYPE.BOX:
      const boxUserConfig: BoxUserConfig = {
        ...boxUserConfigFactory(),
        uuid: uuid(),
      };
      Graphic?.addItem(
        'node',
        {
          id: boxUserConfig.uuid,
          type: NODE_TYPE.BOX_NODE,
          x,
          y,
          style: {
            width: boxUserConfig.width,
            height: boxUserConfig.height,
            stroke: boxUserConfig.stroke,
            fill: boxUserConfig.fill,
            lineWidth: boxUserConfig.lineWidth,
            lineDash: boxUserConfig.lineDash,
          },
        },
        true
      );
      store.setBox(boxUserConfig);
      break;
    case DRAGGABLE_ELEMENT_TYPE.TEXT:
      const textUserConfig: TextUserConfig = {
        ...textUserConfigFactory(),
        uuid: uuid(),
      };
      Graphic?.addItem(
        'node',
        {
          id: textUserConfig.uuid,
          type: NODE_TYPE.TEXT_NODE,
          x,
          y,
          label: textUserConfig.label,
          labelCfg: {
            style: {
              fill: textUserConfig.color,
              fontSize: textUserConfig.fontSize,
            },
          },
        },
        true
      );
      store.setText(textUserConfig);
      break;
    default:
      break;
  }
}

export { dragCreateAssetNode, dragCreateCommonNode };
