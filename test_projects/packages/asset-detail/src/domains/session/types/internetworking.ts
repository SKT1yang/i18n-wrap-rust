interface AssetCommunicationQuery {
  deviceIp?: string;
  deviceMac?: string;
  remoteIp?: string;
  remotePort?: string;
  page: number;
  size: number;
  sort: string;
  localIp?: string;
  localPort?: string;
  programNames?: string[];
  states?: string[];
  protocols?: string[];
  pidNot: number
}

interface AssetCommunication {
  deviceIp: string;
  deviceMac: string;
  remoteIp: string;
  remotePort: number;
  id: number;
  networkName: string;
  pid: number;
  programName: string;
  protocol: string;
  localPort: number;
  localIp: string;
  state: string;
}

export type {
  AssetCommunicationQuery,
  AssetCommunication,
};
