// 资产（主）
type IAsset = {
  assetField: IAssetField;
  assetGroup: IAssetGroup;
  assetGroupId: string;
  assetIp: string; // 资产IP
  assetMac: string; // 资产Mac地址
  assetSeriesCode: number;
  assetSeriesName: string; // 资产系列
  assetSeriesNameLong: string; // 资产系列
  assetTypeCode: number;
  assetTypeName: string; // 资产类型
  assetLocation: string; // 所处位置
  availableSshPwd: boolean;
  clarityLevel: number;
  counterNum: number;
  cpuRate: number | null;
  createTime: string; // 入网时间
  deviceModel: string;
  dyExtendMemSize: number;
  dyMemPipeNum: number;
  errorLog: string;
  fieldId: string;
  fireStatus: number;
  firmwareVersion: string;
  flag: number;
  hardwareModel: string; // 硬件型号
  https: boolean;
  id: number;
  ifaceNum: number;
  importance: number; // 重要程度
  ioIface: string;
  ioMemSize: number;
  layer: number;
  malfunction?: 0 | 1; // 业务状态
  memoryRate: number | null;
  memCardSize: number;
  memCardType: string;
  name: string; // 资产名称
  networkAdapterType: string;
  networkAssetList: INetwork[]; // 合并的网口资产
  networkId?: number;
  nodeX: number;
  nodeY: number;
  os?: string; // 操作系统
  port: number; // http端口
  programChecksum: string;
  programMemSize: number;
  productionDate: string;
  protect: number;
  protectCps: number;
  runStatus: RunStatus; // 运行状态
  safeFieldId: string;
  safeField?: ISafeField; // 安全域
  score: number;
  scoreLevel: number;
  security: string; // 责任部门
  sn?: string; // 硬件序列号
  softwareVersion: string; // 软件版本
  supVlan: number;
  timeInfo: string;
  trademarkCode: number;
  trademarkName: string; // 资产品牌
  tranferSpeed: number;
  trust: number;
  type: number;
  uid: string;
  updateTime: string;
  osDict?: string[]; //操作系统列表
} & Partial<AssetScanProperties>;

// 资产的网口
interface INetwork {
  assetList: INetworkAsset[];
  id: number;
  mainUid: string;
  networkName: string;
}

// 网口资产
interface INetworkAsset {
  assetGroupId: number;
  assetIp: string;
  assetMac: string;
  assetSeriesCode: number;
  assetSeriesName: string;
  assetTypeCode: number;
  assetTypeName: string;
  fieldId: string;
  flag: number;
  https: boolean;
  id: number;
  name: string;
  nodeX: number;
  nodeY: number;
  runStatus: RunStatus;
  trademarkCode: number;
  trademarkName: string;
  type: number;
  uid: string;
}

// 资产组树
interface IAssetGroupTreeItem {
  assetNum: number;
  children?: IAssetGroupTreeItem[];
  id: string;
  ipLimit?: string;
  label: string;
  level: number | null;
  name: string;
  parentId: string;
  remarks?: string;
}

// 资产域
interface IAssetField {
  id: string;
  name: string;
}

// 资产组
interface IAssetGroup {
  id: number;
  label: string;
  parentId: number;
}

// 安全域
interface ISafeField {
  id: string;
  name: string;
  sn: string;
  createType?: string;
  createTime?: string;
}

interface IAssetTrademark {
  trademarkCode: number;
  trademarkName: string;
  splitCode: string;
  assetDicts: IAssetSeries[];
}

interface IAssetSeries {
  id: number;
  trademarkCode: number;
  trademarkName: string;
  assetTypeCode: number;
  assetTypeName: string;
  assetSeriesCode: number;
  assetSeriesName: string;
  assetSeriesNameShort: string;
}

interface AssetScanProperties {
  systemLevel: number;
  systemName: string;
  serverType: string;
  redundancy: string;
  databaseVersion: string;
  mainSoftware: string;
  protectSoftwareType: string;
  protectSoftwareName: string;
  usbSituation: string;
  restoreWay: string;
  restoreCycle: string;
  restoreMedium: string;
  manageProtocol: string;
  workingWay: string;
  deviceNo: string;
  instrumentName: string;
  functionDes: string;
}

type RunStatus = 0 | 1 | 2;

export type {
  IAsset,
  INetwork,
  INetworkAsset,
  IAssetGroupTreeItem,
  IAssetField,
  ISafeField,
  IAssetGroup,
  IAssetTrademark,
  IAssetSeries,
  RunStatus,
  AssetScanProperties,
};
