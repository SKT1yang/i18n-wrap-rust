/*
 * @name: api 接口
 * @description: 数据快照
 * @date: 2023-10-10 14:18:03
 * @path: \front\data-backup\src\service\dataSnapshot.ts
 */

/* 类型文件 */
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 创建快照
 */
async function createSnapshot() {
  return http.post({
    url: "/api/snapshots",
  });
}

/**
 * 恢复分表数据备份
 */
async function recoverSnapshot(name) {
  return http.post<{ accepted: boolean }>({
    url: `/api/snapshots/${name}/restore`,
  });
}

/**
 * 删除数据备份
 */
async function deleteSnapshot(name) {
  return http.delete({
    url: `/api/snapshots/${name}`,
  });
}

export * from "../model/dataSnapshot";
export { createSnapshot, recoverSnapshot, deleteSnapshot };
