import {
  IAsset,
  IAssetField,
  ISafeField,
  IAssetGroup,
  IAssetGroupTreeItem,
  INetwork,
  INetworkAsset,
  RunStatus,
} from "@guolisec/types";

export class Asset implements IAsset {
  assetField = new AssetField();
  safeFieldId = '';
  assetGroup = new AssetGroup();
  assetGroupId = '';
  assetIp = '';
  assetMac = '';
  assetSeriesCode = 0;
  assetSeriesName = '';
  assetSeriesNameLong = '';
  assetTypeCode = 0;
  assetTypeName = '';
  availableSshPwd = false;
  clarityLevel = 0;
  counterNum = 0;
  createTime = '';
  dyExtendMemSize = 0;
  dyMemPipeNum = 0;
  errorLog = '';
  fieldId = '';
  fireStatus = 0;
  firmwareVersion = '';
  flag = 0;
  https = false;
  id = 0;
  ifaceNum = 0;
  ioIface = '';
  ioMemSize = 0;
  layer = 1;
  memCardSize = 0;
  memCardType = '';
  name = '';
  networkAdapterType = '';
  networkAssetList: INetwork[] = [];
  networkId = 0;
  nodeX = 0;
  nodeY = 0;
  os = '';
  port = 0;
  productionDate = '';
  programChecksum = '';
  programMemSize = 0;
  protect = 0;
  protectCps = 0;
  runStatus: RunStatus = 0;
  score = 0;
  scoreLevel = 0;
  supVlan = 0;
  systemLevel = 0;
  timeInfo = '';
  trademarkCode = 0;
  trademarkName = '';
  tranferSpeed = 0;
  trust = 0;
  type = 0;
  uid = '';
  updateTime = '';
  sn = '';
  softwareVersion = '';
  assetLocation = '';
  importance = 0;
  security = '';
  hardwareModel = '';
  deviceModel = '';
  cpuRate = null;
  memoryRate = null;
}

export class AssetField implements IAssetField {
  id = "";
  name = "";
}

export class AssetGroup implements IAssetGroup {
  id = 0;
  label = "";
  parentId = 0;
}

export class SubAsset implements INetworkAsset {
  assetGroupId = 0;
  assetIp = "";
  assetMac = "";
  assetSeriesCode = 0;
  assetSeriesName = "";
  assetTypeCode = 0;
  assetTypeName = "";
  fieldId = "";
  flag = 0;
  https = true;
  id = 0;
  name = "";
  nodeX = 0;
  nodeY = 0;
  runStatus: RunStatus = 0;
  trademarkCode = 0;
  trademarkName = "";
  type = 0;
  uid = "";
}

export class NetworkAsset implements INetwork {
  assetList = [new SubAsset()];
  id = 0;
  mainUid = "";
  networkName = "";
}

export class AssetGroupTree implements IAssetGroupTreeItem {
  assetNum = 0;
  children = [];
  id = "";
  label = "";
  level = 1;
  name = "";
  parentId = "";
}

class SafeField implements ISafeField {
  id = '';
  name = "";
  sn = "";
  createTime = "";
  createType = "";
}

export {
  SafeField
}