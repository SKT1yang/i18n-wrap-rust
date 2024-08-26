/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-21 10:40:43
 * @path: \glsec\apps\rsmp\src\domain\topology\views\ContextMenu\useContextMenu.ts
 */
import { onUnmounted, getCurrentInstance } from 'vue'
import { createContextMenu, destroyContextMenu } from './index'
import type { ContextMenuItem } from './index'
export type { ContextMenuItem }
export function useContextMenu(authRemove = true) {
  if (getCurrentInstance() && authRemove) {
    onUnmounted(() => {
      destroyContextMenu()
    })
  }
  return [createContextMenu, destroyContextMenu]
}
