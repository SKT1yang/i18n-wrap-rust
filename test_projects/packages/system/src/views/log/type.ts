interface Log {
  id: number;
  username: string;
  description: string;
  method: string;
  params: string;
  logType: boolean;
  requestIp: string;
  address: string;
  browser: string;
  time: string;
  message: string;
  exceptionDetail: string;
  createTime: string;
}

export type { Log };
