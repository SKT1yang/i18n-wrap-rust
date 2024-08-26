/*
 * @name: ts 类型
 * @description: 报表管理
 * @date: 2023-02-16 16:09:02
 * @path: \front\reports\src\types\reports.ts
 */

export interface ReportsConfig {
  id: number;
  beanName: string;
  createTime: string;
  cronExpression: string;
  isPause: boolean;
  jobName: string;
  methodName: string;
  remark: string;
}

export interface Report {
  id: number;
  content: string;
  createTime: string;
  format: string;
  enable: boolean;
  reportName: string;
  type: 1 | 2 | 3; // 1:日报，2：周报，3：年报
  remark: string;
}
