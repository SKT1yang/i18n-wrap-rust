/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 16:09:02
 * @path: \glsec\domains\permission\src\types\user.ts
 */

export interface UserListData {
  name?: string
  username?: string
  role?: number
  phone?: string
  page: number
  size: number
}

export interface UserListModel {
  id: number
  username: string
  password: string
  role: number
  rolename: string
  name: string
  phone: string
  createtime: Date
  lastmodifytime: Date
  pwdLastmodifytime: Date
  privilege: number
  accountNonLocked: boolean
  online?: boolean
}

export interface ActiveUserListModel {
  username: string
  clientId: string
  role: string
}
