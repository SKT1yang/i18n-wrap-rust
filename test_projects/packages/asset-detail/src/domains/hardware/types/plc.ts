interface PlcDeviceDetail {
  ioRate: IoRate;
  memory: PLCMemory[];
  cipInfo: CipInfo;
  cpuInfo: CpuInfo;
  hmiInfo: HmiInfo;
  tcpInfo: TcpInfo;
  eventLog: EventLog[];
  ioPacket: IoPacket;
  linkInfo: LinkInfo;
  ledStatus: LedStatus[];
  plcStatus: PlcStatus;
  application: Application[];
  protectLevel: ProtectLevel;
  hmiConnection: HmiConnection;
  networkConfig: NetworkConfig;
  transCounters: TransCounters;
  interfaceConfig: InterfaceConfig;
  interfaceCounters: InterfaceCounters;
  communication: Communication[]
}

interface Application {
  class: string;
  state: string;
  otSize: string;
  otType: string;
  portId: string;
  toSize: string;
  toType: string;
  uptime: string;
  connSer: string;
  toMcast: string;
  linkAddr: string;
  appObject: string;
  localOrig: string;
  otRpiMsec: string;
  tableName: 'Application Connection';
  toApiMsec: string;
  timeoutMsec: string;
  missedRxPkts: string;
}

interface CipInfo {
  activeIo: string;
  tableName: 'CIP Connection Statistics (All Ports)';
  activeTotal: string;
  activeMessaging: string;
  maximumTotalObserved: string;
  maximumTotalSupported: string;
}

interface CpuInfo {
  cpu: string;
  tableName: 'Module Resource Utilization (All Ports)';
  ioCommsUtilizationActual: string;
  ioCommsUtilizationTheoretical: string;
}

interface EventLog {
  p1: string;
  p2: string;
  file: string;
  line: string;
  time: string;
  event: string;
  number: string;
  tableName: 'Event Log';
}

interface HmiConnection {
  tableName: 'HMI/MSG Connected (EtherNet/IP Port)';
  sentPacketCount: string;
  sentBytesPerSecond: string;
  receivedPacketCount: string;
  sentPacketsPerSecond: string;
  receivedBytesPerSecond: string;
  receivedPacketsPerSecond: string;
}

interface HmiInfo {
  tableName: 'HMI/MSG Unconnected (EtherNet/IP Port)';
  sentPacketCount: string;
  receivedPacketCount: string;
  sentPacketsPerSecond: string;
  receivedPacketsPerSecond: string;
}

interface InterfaceConfig {
  switches: string;
  tableName: 'Ethernet Interface Configuration';
  obtainNetworkConfiguration: string;
}

interface InterfaceCounters {
  inErrors: string;
  inOctets: string;
  outErrors: string;
  outOctets: string;
  tableName: 'Interface Counters';
  inDiscards: string;
  outDiscards: string;
  inUcastPackets: string;
  inNucastPackets: string;
  inUnknownProtos: string;
  outUcastPackets: string;
  outNucastPackets: string;
}

interface IoPacket {
  sent: string;
  total: string;
  missed: string;
  received: string;
  rejected: string;
  tableName: 'I/O and Prod/Cons Packet Counts (EtherNet/IP Port)';
}

interface IoRate {
  sent: string;
  total: string;
  received: string;
  tableName: 'I/O and Prod/Cons Packets Per Second (EtherNet/IP Port)';
}

interface LinkInfo {
  speed: string;
  duplex: string;
  tableName: 'Ethernet Link';
  autonegotiateStatus: string;
}

interface NetworkConfig {
  hostName: string;
  ipAddress: string;
  tableName: 'Network Interface';
  smtpServer: string;
  subnetMask: string;
  defaultGateway: string;
  nameResolution: string;
  defaultDomainName: string;
  primaryNameServer: string;
  ethernetAddressMac: string;
  secondaryNameServer: string;
}

interface PlcStatus {
  type: string;
  plcStatus: number; // 0-运行，1-停止
  errorStatus: number; // 0-无故障，1-有故障
}

interface ProtectLevel {
  bitProLevel: string;
  butProLevel: string;
  runProLevel: string;
  stopProLevel: string;
  paramProLevel: string;
}

interface TcpInfo {
  active: string;
  tableName: 'TCP Connections (EtherNet/IP Port)';
  maximumObserved: string;
  maximumSupported: string;
}

interface TransCounters {
  fcsErrors: string;
  tableName: 'Media Counters';
  frameTooLong: string;
  sqeTestErrors: string;
  lateCollisions: string;
  alignmentErrors: string;
  macReceiveErrors: string;
  singleCollisions: string;
  macTransmitErrors: string;
  carrierSenseErrors: string;
  multipleCollisions: string;
  excessiveCollisions: string;
  deferredTransmissions: string;
}

// Network Communication
interface Communication {
  tableName: 'Network Communication';
  state: string;
  localAddress: string;
  localPort: string;
  remoteAddress: string;
  remotePort: string;
}

interface PLCMemory {
  free: number;
  name: string;
  rate: number;
  total: number;
  type: string;
  used: number;
  detail: PLCMemoryDetail[];
}

interface PLCMemoryDetail {
  name: string;
  serialNum: string;
  size: number;
}

interface LedStatus {
  rack: number;
  slot: number;
  module: string;
  name: string;
  status: 0 | 1; // 0-亮，1-暗
  flash: 0 | 1; // 0-闪烁，1-不闪烁
}

export type {
  PlcDeviceDetail,
  Application,
  Communication,
  EventLog,
  LedStatus
}
