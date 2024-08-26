/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-03 10:26:21
 * @path: \types\src\toast.ts
 */
import type { CSSProperties } from "vue";
import type { VoidFunction } from "./utils";

export type ToastCSSProperties = CSSProperties | string;

export type NoticeType = "info" | "success" | "error" | "warning" | "loading";

export type JointContent = string | ArgsProps;

export interface ArgsProps {
  content: string;
  duration?: number;
  type?: NoticeType;
  icon?: string;
  key?: string | number;
  style?: ToastCSSProperties;
  className?: string;
  single?: boolean; // single模式用户当前只显示一个消息
  onClose?: () => void;
  onClick?: (e: any) => void;
}

export interface MessageType extends PromiseLike<boolean> {
  (): void;
}

export interface ConfigOptions {
  top?: number;
  duration?: number;
  prefixCls?: string;
  getContainer?: () => any;
  transitionName?: string;
  maxCount?: number;
  rtl?: boolean;
}

export type TypeOpen = (
  content: JointContent,
  duration?: number | VoidFunction, // Also can use onClose directly
  onClose?: VoidFunction,
  single?: boolean // single模式用户当前只显示一个消息
) => MessageType;

export interface MessageInstance {
  info: TypeOpen;
  success: TypeOpen;
  error: TypeOpen;
  warning: TypeOpen;
  loading: TypeOpen;
  open(args: ArgsProps): MessageType;
  destroy(key?: string): void;
}

export { CSSProperties };
