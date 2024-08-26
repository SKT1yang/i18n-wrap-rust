/*
 * @name: 简单的获取topology的一些信息
 * @description: 纯函数
 */

/* 类型文件 */
import type { GraphData, NodeConfig } from '@antv/g6';
/* 第三方模块 */
import { isJson } from '@guolisec/utils';
import { getTopoInformationByIdsApi } from '../model/editor';
import { topologyInfoFactory, graphDataFactory } from '../model/store';
import { useRouter } from '@guolisec/routerable';
import { NODE_TYPE } from '../types/enum';
import type { AssetUserConfig } from '../types';

async function getTopoInformationById(id: number) {
  let topologyInfo = topologyInfoFactory();
  try {
    const response = await getTopoInformationByIdsApi({
      topoIds: [id],
    });
    topologyInfo = response[0];
  } catch (error) {
    console.log(`getTopoInformationById api error`);
  }
  return topologyInfo;
}

function getTopologyId() {
  const router = useRouter();
  const { currentRoute } = router;
  const id = Number(currentRoute.value.query.id);
  if (!id) {
    console.warn(
      '[useTopologyEditCanvas getGraphData]: require topoogy id failed!'
    );
  }
  return id;
}

function transformInformation(information: string) {
  const graphData = (
    isJson(information) ? JSON.parse(information) : graphDataFactory()
  ) as GraphData;
  return graphData;
}

function getAllAssetNodeConfigList(nodes: NodeConfig[]) {
  return nodes.filter((node) => {
    return node.type === NODE_TYPE.ASSET_NODE && Boolean(node?.data);
  });
}

function getAllAssetNodeDataList(nodes: NodeConfig[]) {
  const assetNodes = getAllAssetNodeConfigList(nodes);
  const assetList = assetNodes.map((i) => {
    return i.data;
  }) as AssetUserConfig[];
  return assetList;
}

export {
  getTopoInformationById,
  getTopologyId,
  transformInformation,
  getAllAssetNodeConfigList,
  getAllAssetNodeDataList,
};
