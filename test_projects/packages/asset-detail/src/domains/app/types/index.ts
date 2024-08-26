interface Application {
  id: number;
  appName: string;
  appVersion: string;
  deviceIp: string;
  deviceMac: string;
  installTime: string;
  manufacture: number;
}

interface OS {
  boardName: string;
  deviceIp: string;
  deviceMac: string;
  hardwareArchitecture: string;
  hostName: string;
  id: number;
  ipv4Address: string;
  ipv6Address: string;
  kernelName: string;
  kernelVersion: string;
  osType: 0 | 1; // 0-Windows, 1-Linux
  osVersion: string;
}

export type {
  Application,
  OS
}