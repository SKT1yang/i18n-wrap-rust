/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 15:36:14
 * @path: \vue-package-quickstart\src\model\user.ts
 */

/* 类型文件 */
import type { DataListResult } from "@guolisec/types";
import type { User } from "../types/user";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 获取用户列表
 * @param data 查询条件
 * @returns
 */
export async function getUserList(data) {
  return http.post<DataListResult<User>>({
    url: "/api/user/getUserList",
    data,
  });
}
