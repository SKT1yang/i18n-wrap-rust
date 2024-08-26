interface Firewall {
  action: string;
  deviceIp: string;
  deviceMac: string;
  firewallFrom: string;
  firewallTo: string;
  id: number;
  domainStatus: "Enable" | "Disable";
  privateStatus: "Enable" | "Disable";
  publicStatus: "Enable" | "Disable";
}

export type {
  Firewall,
};
