/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-03 10:26:21
 * @path: \types\src\permission.d.ts
 */
export interface UserInfo {
  id: number;
  name: string;
  username: string;
  password?: string;
  phone: string;
  roleId: number;
  roleName: string;
  privilege: 0 | 1; // 0:特权角色用户，1：普通角色用户
}

export interface SystemInfo {
  active: boolean;
  clientId: string | number;
  description?: string;
  id: number;
  sysName: string;
  homePageUrl?: string;
  model: string;
}

export type PermissionInfo = PermissionItem[];

export type PermissionItem = {
  id: number;
  pid?: number;
  path: string;
  name: string;
  component: string;
  fullPath: string;
  redirect: string;
  orderNo: number;
  hasChildClick: string;
  icon: string;
  props?: string;
  title: string;
  dynamicLevel?: number;
  realPath: string;
  ignoreAuth: boolean;
  ignoreKeepAlive: boolean;
  affix: boolean;
  frameSrc: string;
  transitionName: string;
  hideBreadcrumb: boolean;
  hideChildrenInMenu: boolean;
  carryParam: boolean;
  single: boolean;
  currentActiveMenu?: string;
  hideTab: boolean;
  hideMenu: boolean;
  isLink: boolean;
  ignoreRoute: boolean;
  hidePathForChildren: boolean;
  backgroundColor?: string;
  subNavigator: boolean;
  monitorBehavior: boolean;
};

export type PermissionTree = PermissionTreeItem[];

export type PermissionTreeItem = PermissionItem & {
  pid: number;
  children?: PermissionTreeItem[];
};

/**
 * 权限模式 路由映射/后端
 */
export type PermissionMode = "ROUTE_MAPPING" | "BACK";
