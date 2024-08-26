interface PLCErrorLog {
  errorModule: string;
  errorClass: string;
  errorTypeDescribe: string;
  errorCode: string;
  description: string;
  errorReason: string;
  errorType: 0 | 1;
  time: string;
}

interface PLCErrorQuery {
  deviceIp?: string;
  deviceMac?: string;
  errorModule?: string;
  errorModules?: string[];
  errorType?: 0 | 1;
  errorTypes?: (0 | 1)[];
  errorTime?: string[];
  errorCode?: string;
  description?: string;
  page: number;
  size: number;
  sort: string;
}

export type {
  PLCErrorLog,
  PLCErrorQuery,
};
