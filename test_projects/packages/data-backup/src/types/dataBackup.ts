/*
 * @name: ts 类型
 * @description: 数据备份
 * @date: 2023-10-08 10:12:07
 * @path: \front\data-backup\src\types\dataBackup.ts
 */

interface QueryDataBackup {
  createTime?: string[];
  fileName?: string[];
  page: number;
  size: number;
  sort: string;
  status?: 0 | 1 | 2; //导出中 1成功 2失败
  type?: string;
}

interface DataBackup {
  createTime: string;
  endTime: string;
  fileName: string;
  filePath: string;
  id: number;
  size: number;
  sizeStr: string;
  startTime: string;
  status: 0 | 1 | 2 | 3;
  type: number;
}

export type { QueryDataBackup, DataBackup };
