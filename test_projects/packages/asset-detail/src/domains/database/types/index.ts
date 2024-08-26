interface DatabaseInfo {
  id: number;
  free: number;
  tableSpaceName: string;
  deviceIp: string;
  deviceMac: string;
  tableSpaceType: string;
  total: number;
  usage: number;
  used: number;
}

interface LinkDatabaseInfo {
  id: number;
  connectionTime: string;
  host: string;
  deviceIp: string;
  deviceMac: string;
  osUser: string;
  program: string;
  sid: number;
  status: string;
  user: string;
}

interface SlowDatabaseInfo {
  id: number;
  bufferReads: number;
  cpuTime: number;
  deviceIp: string;
  deviceMac: string;
  diskReads: number;
  elapsedTime: number;
  executions: number;
  firstLoadTime: string;
  lastLoadTime: string;
  sqlId: string;
  sqlText: string;
}

interface DatabaseBasicInfo {
  dbVersion: string;
  ip: string;
  port: number;
  serviceName: string;
  type: string;
}

export type {
  DatabaseInfo,
  LinkDatabaseInfo,
  SlowDatabaseInfo,
  DatabaseBasicInfo
};
