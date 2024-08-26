/*
 * @name: 漏洞库 ts 类型
 * @description: Do not edit
 * @date: 2023-09-22 16:15:55
 * @path: \front\knowledge\src\types\vulStore.ts
 */
interface Vulnerability {
  vid: number;
  cnnvdId: string;
  cnnvdThreatType: string;
  cnnvdType: string;
  cnnvdUploadTime: string;
  cnnvdUrl: string;
  cnvdId: string;
  cnvdImpact: string;
  cnvdUrl: string;
  cpe: string;
  cveId: string;
  cvssBaseScore: string;
  cwe: string;
  detail: string;
  glsve: string;
  killchainType: string;
  level: string;
  msId: string;
  patch: string;
  pubDate: string;
  referenceUrl: string;
  solution: string;
  title: string;
}

export type { Vulnerability };
