/*
 * @name: ts 类型
 * @description: 数据快照
 * @date: 2023-10-10 14:00:10
 * @path: \front\data-backup\src\types\dataSnapshot.ts
 */
interface Snapshot {
  snapshotName: string;
  id: number;
  dateCreated: string;
  isRecover: boolean;
}

export type { Snapshot };
