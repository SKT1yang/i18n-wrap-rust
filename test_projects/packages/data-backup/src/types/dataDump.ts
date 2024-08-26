/*
 * @name: ts 类型
 * @description: 数据转储
 * @date: 2023-10-10 09:05:33
 * @path: \front\data-backup\src\types\dataDump.ts
 */

interface FtpSettings {
  host: string; // FTP 服务器
  id: number;
  port: number; // FTP 端口
  password: string; // FTP 密码
  userName: string; // FTP 用户名
  status: boolean;
}

export type { FtpSettings };
