/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 15:13:01
 * @path: \permission\src\service\user.ts
 */
/* 类型文件 */
import type { UserListData } from '../types/user';
/* 第三方模块 */
import { http } from '@guolisec/request';
/* 本地共享模块 */

/* 业务模块 */
import {
  getUserList,
  getActiveUserList,
  getUserMaxFaildNum,
} from '../model/user';

export async function getUser(query: UserListData) {
  const userList = await getUserList(query);
  const activeUserList = await getActiveUserList();
  userList.content.forEach((user) => {
    activeUserList.forEach((activeUser) => {
      if (user.username === activeUser.username) {
        user.online = true;
      }
    });
  });
  return userList;
}

export async function modifyMaxFailedNum(data: { num: number }) {
  return http.post<string>({
    url: '/api/user/modifyMaxFailedNum',
    data,
  });
}

export async function deleteUser(params: { id: number }) {
  return http.delete({
    url: `/api/user/deleteUser`,
    params,
  });
}

export async function modifyUser(data: {
  name: string;
  phone: string;
  username: string;
}) {
  return http.post<string>({
    url: '/api/user/modifyUser',
    data,
  });
}

export async function modifyUserPw(data: {
  username: string;
  password: string;
  rawPassword: string;
}) {
  return http.post<string>({
    url: '/api/user/modifyUserPw',
    data,
  });
}

/**
 * 使用新密码重置用户密码
 * @param data
 * @returns
 */
export async function resetNewPassword(data: {
  systemId: number;
  id: number;
  password: string;
  rawPassword: string;
}) {
  return http.post<string>({
    url: '/api/user/resetNewPassword',
    data,
  });
}

/**
 * 直接重置用户密码
 * @param data
 * @returns
 */
export async function resetPassword(data: { id: number }) {
  return http.post({
    url: '/api/user/resetPassword',
    data,
  });
}

/**
 * 使当前登录用户退出登录
 * @param data
 * @returns
 */
export async function revokeUsers(params: {
  clientId: number | string;
  username: string;
}) {
  return http.get({
    url: '/api/user/revokeUsers',
    params,
  });
}

/**
 * 个人修改密码
 * @param data
 * @returns
 */
async function modifyUserPassword(data: {
  username: string;
  // 新密码
  password: string;
  // 老密码
  rawPassword: string;
}) {
  return http.post({
    url: '/api/user/modifyUserPw',
    data,
  });
}

export { getUserMaxFaildNum, modifyUserPassword };
