import { Dayjs } from "dayjs";

type fileType = {
  types: baseType[];
  files: baseType[];
  status: baseType[];
  importences: baseType[];
};
type selectedObj = {
  name?: string;
  assetIp?: string;
  assetTypeCode?: number;
  field?: string;
  fieldId?: string;
  runStatus?: any;
  importance?: number;
  assetGroupId?: string;
};
type text = string | number | undefined;
type editForm = {
  data: {
    name: text;
    assetField: any;
    assetTypeCode: text;
    assetGroup: text;
    assetGroupLabel: text;
    trademarkName: text;
    assetSeriesNameLong: text;
    sn: text;
    assetIp: text;
    assetMac: text;
    softwareVersion: text;
    assetLocation: text;
    runStatus: text;
    productionDate: text | Dayjs;
    hardwareModel: text;
    importance: text;
    security: text;
    os: text;
    port: text;
    safeFieldId: text;
    assetGroupId: text;
    assetFieldName: text;
    fieldId: text;
    trademarkCode: text;
    assetSeriesCode: text;
  };
};

type baseType = {
  label: number | string;
  value: number | string;
};
type editFile = {
  assetFiles: baseType[];
  assetType: baseType[];
  assetSafeFieldList: baseType[];
  assetBrands: baseType[];
  runStatus: baseType[];
  importance: baseType[];
  assetOSList: baseType[];
  seriesTypes?: baseType[];
  treeData: any;
};
type newForm = {
  assetFiles: baseType[];
  assetType: baseType[];
  assetSafeFieldList: baseType[];
  assetBrands: baseType[];
  runStatus: baseType[];
  importance: baseType[];
  assetOSList: baseType[];
  treeData: any;
  assetBrandDicts: baseType[];
};
type newObj = {
  data: {
    name: text;
    fieldId: any;
    assetTypeCode: text;
    assetGroup: any;
    assetGroupLabel: text;
    trademarkName: text;
    assetSeriesCode: text;
    sn: text;
    assetIp: text;
    assetMac: text;
    softwareVersion: text;
    assetLocation: text;
    runStatus: text;
    productionDate: text;
    assetHardWareType: text;
    importance: text;
    security: text;
    os: text;
    port: text;
    safeFieldId: text;
    assetGroupId: text;
  };
};
type backType = {
  totalElements: number;
  totalPages: number;
  content: FieldAsset[];
};

interface FieldAsset {
  id: number;
  name: string;
  runStatus: number;
  assetSeriesNameLong: string;
  assetTypeName: string;
  assetMac: string;
  assetIp: string;
  assetGroup: {
    label: string;
  };
  networkAssetList: any[];
  assetField: {
    id: string;
    name: string;
  };
}

type downLoadType = {
  name?: number | string;
  assetIp?: number | string;
  assetTypeCode?: number | string;
  importance?: number | string;
  runStatus?: number | string;
  assetGroupId?: number | string;
  signP?: number | string;
};

export type {
  fileType,
  selectedObj,
  baseType,
  editForm,
  downLoadType,
  backType,
  newObj,
  newForm,
  editFile,
};

const FullAsset = {
  assetGroupId: 0,
  assetIp: "",
  assetMac: "",
  assetSeriesCode: 0,
  assetSeriesName: "",
  assetSeriesNameLong: "",
  assetTypeCode: 0,
  assetTypeName: "",
  availableSshPwd: false,
  clarityLevel: 0,
  counterNum: 0,
  createTime: "",
  dyExtendMemSize: 0,
  dyMemPipeNum: 0,
  errorLog: "",
  fieldId: "",
  fireStatus: 0,
  firmwareVersion: "",
  flag: 0,
  https: false,
  ifaceNum: 0,
  ioIface: "",
  ioMemSize: 0,
  memCardSize: 0,
  memCardType: "",
  name: "",
  networkAdapterType: "",
  networkAssetList: [],
  nodeX: 0,
  nodeY: 0,
  os: "",
  programChecksum: "",
  programMemSize: 0,
  protect: 0,
  protectCps: 0,
  runStatus: 0,
  score: 0,
  scoreLevel: 0,
  supVlan: 0,
  timeInfo: "",
  trademarkCode: 0,
  trademarkName: "",
  tranferSpeed: 0,
  trust: 0,
  type: 0,
  uid: "",
  updateTime: "",
  sn: "",
  softwareVersion: "",
  assetLocation: "",
  importance: 0,
  security: "",
  hardwareModel: "",
  deviceModel: "",
  cpuRate: null,
  memoryRate: null,
};

export { FullAsset, type FieldAsset };
