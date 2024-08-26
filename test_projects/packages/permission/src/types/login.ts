/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-14 14:39:22
 * @path: \permission\src\types\login.ts
 */
import type { UserInfo, SystemInfo, PermissionInfo } from "@guolisec/types";

/**
 * @description: Login interface parameters
 */
interface LoginFormData {
  username: string;
  password: string;
  validateCode: string;
  validateCodeUUid: string;
  client_id: string;
  client_secret: string;
  grant_type: string;
  scope: string;
  ret: string;
  sn: string;
  pin: string;
  mode: 0 | 1; // usbkey登录模式，0为正常模式，1为紧急登录模式，默认为0
  recoveryCode: string; // 恢复代码
  random: string; // 随机数，用于生成恢复代码
}

/**
 * @description: Login interface return value
 */
interface LoginModel {
  access_token: string;
  expires_in: number;
  privilege: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  username: string;
  authorities: {
    [propName: number]: string;
  };
  user: {
    username: string;
    name: string;
    phone: string;
    role: number;
    roleName: string;
  };
}

/**
 * @description: 登录系统过后，获取本次登录基本信息
 */
interface AfterLoginInfoModel {
  // 1. 用户信息
  user: UserInfo;
  // 2. 系统信息
  dynamicSystem: SystemInfo;
  // 3. 权限信息
  permission: PermissionInfo;
}

/**
 * @description: 登录系统过后，获取本次登录基本信息
 */
interface AfterLoginInfoStandard {
  // 1. 用户信息
  userInfo: UserInfo;
  // 2. 系统信息
  systemInfo: SystemInfo;
  // 3. 权限信息
  permissionInfo: PermissionInfo;
}

export type {
  LoginFormData,
  LoginModel,
  AfterLoginInfoModel,
  AfterLoginInfoStandard,
};
