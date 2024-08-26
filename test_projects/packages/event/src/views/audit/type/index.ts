export interface IAsset {
  assetField: IAssetField;
  assetGroup: IAssetGroup;
  assetGroupId: number;
  assetIp: string;
  assetMac: string;
  assetSeriesCode: number;
  assetSeriesName: string;
  assetSeriesNameLong: string;
  assetTypeCode: number;
  assetTypeName: string;
  availableSshPwd: boolean;
  clarityLevel: number;
  counterNum: number;
  createTime: string;
  dyExtendMemSize: number;
  dyMemPipeNum: number;
  errorLog: string;
  fieldId: string;
  fireStatus: number;
  firmwareVersion: string;
  flag: number;
  https: boolean;
  id: number;
  ifaceNum: number;
  ioIface: string;
  ioMemSize: number;
  memCardSize: number;
  memCardType: string;
  name: string;
  networkAdapterType: string;
  networkAssetList: INetworkAsset[];
  networkId: number;
  nodeX: number;
  nodeY: number;
  os: string;
  programChecksum: string;
  programMemSize: number;
  protect: number;
  protectCps: number;
  runStatus: RunStatus;
  score: number;
  scoreLevel: number;
  supVlan: number;
  timeInfo: string;
  trademarkCode: number;
  trademarkName: string;
  tranferSpeed: number;
  trust: number;
  type: number;
  uid: string;
  updateTime: string;
  sn: string;
  softwareVersion: string;
  assetLocation: string;
  importance: number;
  security: string;
  hardwareModel: string;
  deviceModel: string;
  cpuRate: number | null;
  memoryRate: number | null;
}

export interface IAssetField {
  id: string;
  name: string;
}

export interface IAssetGroup {
  id: number;
  label: string;
  parentId: number;
}

export interface INetworkAsset {
  assetList: ISubAsset[];
  id: number;
  mainUid: string;
  networkName: string;
}

export interface ISubAsset {
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

export interface IAssetGroupTree {
  assetNum: number;
  children?: IAssetGroupTree[];
  id: string;
  ipLimit?: string;
  label: string;
  name: string;
  parentId: string;
  remarks?: string;
}

export type RunStatus = 0 | 1 | 2;

export interface IAssetProps {
  haveAssetMerge?: boolean; // 是否有资产合并功能，默认 true
  haveAddDevice?: boolean; // 是否有添加设备功能，默认 true
  haveAssetField?: boolean; // 是否包含资产域功能，默认 true
  haveAssetRelation?: boolean; // 资产详情是否有资产关系，默认 true
  haveAssetFlow?: boolean; // 资产详情是否包含资产流量，默认 true
  haveAssetVul?: boolean; // 资产详情是否包含资产漏洞，默认 true
  havePlcMonitor?: boolean; // 资产详情是否有资产监测项(PLC)，默认 true
  haveBaselineModify?: boolean; // 资产详情是否包含组态变更(PLC)，默认 true
  haveHardwareInfo?: boolean; // 资产详情是否有资产监测项(HOST)，默认 true
  haveInterfaceStatusTable?: boolean; // 资产详情是否有资产监测项(SWITCH)，默认 true
  haveAssetSession?: boolean; // 资产详情-资产事件是否有会话信息，默认 true
}
