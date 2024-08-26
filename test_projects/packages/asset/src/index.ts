/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-17 19:33:58
 * @path: \asset\src\index.ts
 */
import 'uno.css';
import TabsAsset from '@/views/asset-list/widgets/TabsAsset.vue';
import AssetsTrustPage from './views/asset-trust/index.vue';
import AssetsStatusPage from './views/asset-status/index.vue';
import AssetsFieldPage from './views/asset-field/index.vue';
import AssetRelation from './views/asset-relation/AssetRelation.vue';
import AssetImportance from './views/asset-list/widgets/AssetImportance.vue';
import AssetIdle from './views/asset-list/widgets/AssetIdle.vue';
import AssetOffline from './views/asset-list/widgets/AssetOffline.vue';
import AssetRegistered from './views/asset-list/widgets/AssetRegistered.vue';
import TableStockAsset from './views/asset-scan/stock/TableStockAsset.vue';
import CardListVerifyAsset from './views/asset-scan/verify/CardListVerifyAsset.vue';
import ConfirmScanAsset from './views/asset-scan/widgets/ConfirmScanAsset.vue';
import AssetCompare from './views/asset-compare/Compare.vue';
import TableUpdateAssetBatch from './views/asset-scan/stock/TableUpdateAssetBatch.vue';
import SelectTreeAssetGroup from './views/form/SelectTreeAssetGroup.vue';
import SelectAssetType from './views/form/SelectAssetType.vue'

export {
  // 资产清单 （已注册资产）
  AssetRegistered,
  // 资产清单（tabs）
  TabsAsset,
  // 资产清单（关键资产）
  AssetImportance,
  // 资产清单（闲置资产）
  AssetIdle,
  // 资产清单（离线资产）
  AssetOffline,
  AssetsTrustPage,
  //资产状态
  AssetsStatusPage,
  //资产域管理
  AssetsFieldPage,
  AssetRelation,
  // 资产对比
  AssetCompare,
  TableStockAsset,
  TableUpdateAssetBatch,
  CardListVerifyAsset,
  ConfirmScanAsset,
  // 选择资产组树组件
  SelectTreeAssetGroup,
  // 选择资产类型组件
  SelectAssetType
};
