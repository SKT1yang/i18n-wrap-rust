/*
 * @name: Do not edit
 * @description: Do not edit
 */

interface OpenPortAndService {
  abnormalFlag: boolean;
  port: number;
  server: string;
}

interface Port {
  createTime: string;
  deviceIp: string;
  deviceMac: string;
  id: number;
  path: string;
  pid: number;
  port: number;
  processName: string;
  protocol: string;
}

interface PortInfo {
  description: string;
  port: string;
  portMac: string;
  status: string;
  portDownSpeed: string;
  portUpSpeed: string;
}

interface PortUsageinfo {
  port: string;
  status: "connect" | "unconnect";
  portDownSpeed: string;
  portUpSpeed: string;
}

interface SwitchInfo {
  ip: string;
  mac: string;
  switchInfoVO: {
    portInfo: PortInfo[];
    portUsageinfo: PortUsageinfo[];
    sysInfo: {
      temperature: number;
    };
  };
}

export type { OpenPortAndService, SwitchInfo, Port, PortInfo, PortUsageinfo };
