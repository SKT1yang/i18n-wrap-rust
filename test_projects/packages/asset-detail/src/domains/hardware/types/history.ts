/*
 * @name: Do not edit
 * @description: Do not edit
 */

interface MemoryRate {
  memRateValueList: (number | undefined | null)[];
  memRateName: string;
  createTimeList: string[];
}

interface CPURate {
  cpuRate: number;
  dateTime: string;
}

export type { MemoryRate, CPURate };
