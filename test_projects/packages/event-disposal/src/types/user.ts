/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 16:09:02
 * @path: \vue-package-quickstart\lib\types\user.ts
 */

interface User {
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

export { type User }
