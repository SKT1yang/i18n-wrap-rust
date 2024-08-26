/*
 * @name: api 接口
 * @description: 数据快照
 * @date: 2023-10-10 13:58:54
 * @path: \data-backup\src\model\dataSnapshot.ts
 */
/* 类型文件 */
import type { Snapshot } from "../types/dataSnapshot";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 获取生成数据包数据
 * @param data 查询条件
 * @returns
 */
async function getSnapshots(params: { startTime?: string; endTime?: string }) {
  return http.get<Snapshot[]>({
    url: "/api/snapshots",
    params,
  });
}

export { getSnapshots };
