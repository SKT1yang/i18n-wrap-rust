interface Hardware {
  boardName: string;
  cpuName: string;
  diskName: string;
  networkName: string;
  ramName: string;
  networkInfoList: {
    ip: string;
    mac: string;
    networkAdapterName: string;
    id: number;
  }[];
}

interface CPUsage {
  cpuName: string;
  id: number;
  cpuUsage: number;
  createTime: string;
  deviceIp: string;
  deviceMac: string;
}

interface CPU {
  cpuName: string;
  cpuUsage: CPUsage[];
}

interface DiskUsage {
  createTime: string;
  id: number;
  deviceIp: string;
  deviceMac: string;
  diskFree: number;
  diskName: string;
  diskTotal: number;
  diskUsage: number;
  diskUsed: number;
}

interface Disk {
  diskName: string;
  diskUsage: DiskUsage[];
}

interface NetworkUsage {
  createTime: string;
  deviceIp: string;
  deviceMac: string;
  networkName: string;
  rxSpeed: number;
  txSpeed: number;
}

interface Network {
  networkName: string;
  networkUsage: NetworkUsage[];
}

interface RamUsage {
  createTime: string;
  deviceIp: string;
  deviceMac: string;
  ramName: string;
  id: number;
  ramTotal: number;
  ramUsage: number;
  ramUsed: number;
  ramFree: number;
  ramCached?: number;
}

interface Ram {
  ramName: string;
  ramUsage: RamUsage[];
}

export type { Hardware, CPU, Disk, Network, Ram };
