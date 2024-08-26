/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-03 10:26:21
 * @path: \glsec\packages\types\src\menu.ts
 */
import type { RouteMeta } from 'vue-router'

interface MenuItem {
  name: string
  path: string
  icon?: string
  routeName?: string
  paramPath?: string
  disabled?: boolean
  children?: MenuItem[]
  orderNo?: number
  roles?: string[]
  meta?: Partial<RouteMeta>
  hideMenu?: boolean
  hiddInConfig?: boolean
}

type Menu = MenuItem[]

export type { MenuItem, Menu }
