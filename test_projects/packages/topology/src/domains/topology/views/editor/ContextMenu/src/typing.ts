/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-21 10:29:13
 * @path: \glsec\apps\rsmp\src\domain\topology\views\ContextMenu\typing.ts
 */
import { IG6GraphEvent } from '@antv/g6';
export interface Axis {
  x: number;
  y: number;
}

export type ContextMenuEvent = MouseEvent | IG6GraphEvent;

export interface ContextMenuItem {
  label: string;
  icon?: string;
  hidden?: boolean;
  disabled?: boolean;
  handler?: Function;
  divider?: boolean;
  children?: ContextMenuItem[];
}
export interface CreateContextOptions {
  event: ContextMenuEvent;
  icon?: string;
  styles?: any;
  items?: ContextMenuItem[];
}

export interface ContextMenuProps {
  event?: ContextMenuEvent;
  styles?: any;
  items: ContextMenuItem[];
  customEvent?: ContextMenuEvent;
  axis?: Axis;
  width?: number;
  showIcon?: boolean;
}

export interface ItemContentProps {
  showIcon: boolean | undefined;
  item: ContextMenuItem;
  handler: Function;
}
