/*
 * @name: Do not edit
 * @description: Do not edit
 */
interface StockAsset {
  id: number;
  deviceIp: string;
  deviceMac: string;
  trademarkCode: number;
  trademarkName: string;
  assetTypeCode: number;
  assetTypeName: string;
  assetSeriesCode: number;
  assetSeriesName: string;
  runStatus: 0 | 1 | 2;
  deviceModel: string;
  firmwareVersion: string;
  threatScore: number;
  networkAdapterType: string;
  timeInfo: string;
  programMemSize: number;
  ioIface: string;
  ioMemSize: number;
  dyMemSize: number;
  counterNum: number;
  dyExtendMemSize: number;
  memCardType: string;
  memCardSize: number;
  logInfo: any;
  memRate: any[];
  malFunction: number;
  osDict: string[];
  os: string;
  programChecksum: string;
  ifaceNum: number;
  transferSpeed: string;
  supVlan: number;
  clarityLevel: number;
  errorLog: string;
  statusType: number;
  flag: number;
  name: string;
  openServer: OpenServer[];
  blockInfo: any[];
  timeStamp: string;
  cpuRate: number;
  deny: number;
  createTime: string;
  hardwareModel: string;
  assetLocation: string;
  sn: string;
  softwareVersion: string;
}

interface OpenServer {
  server: string;
  deviceIp: number;
  applayerProtocolId: number;
  translayerProtocolId: number;
  port: number;
  deviceMac: string;
  scripts: Scripts[];
}

interface Scripts {
  output: string;
  elements: any;
  id: string;
}

export type { StockAsset };
