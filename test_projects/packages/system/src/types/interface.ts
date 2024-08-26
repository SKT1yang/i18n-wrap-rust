interface NetworkInterface {
  id?: number;
  ip: string;
  networkCardName: string;
  subnetMask: string;
  gateway: string;
  operation?: string;
  switchStatus?: boolean;
  switchSet?: boolean;
  interfaceType?: boolean;
  interfaceDirection?: boolean;
  mgmt?: boolean;
  ipSet?: boolean;
  upFlow?: string;
  downFlow?: string;
  status?: boolean;
}

export { type NetworkInterface };
