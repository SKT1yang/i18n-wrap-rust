/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 15:36:14
 * @path: \permission\src\src\model\user.ts
 */

/* 类型文件 */
import type { DataListResult } from "@guolisec/types";
import type {
  UserListModel,
  ActiveUserListModel,
  UserListData,
} from "../types/user";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 获取用户列表
 * @param data 查询条件
 * @returns
 */
export async function getUserList(data: UserListData) {
  return http.post<DataListResult<UserListModel>>({
    url: "/api/user/getUserList",
    data,
  });
}

/**
 * 获取当前所有登录用户
 * @param data 查询条件
 * @returns
 */
export async function getActiveUserList() {
  return http.get<ActiveUserListModel[]>({
    url: "/api/user/getActiveUsers",
  });
}

/**
 * 获取用户最大失败次数
 * @param data 查询条件
 * @returns
 */
export async function getUserMaxFaildNum() {
  return http.post<number>({
    url: "/api/user/getMaxFaildNum",
  });
}
