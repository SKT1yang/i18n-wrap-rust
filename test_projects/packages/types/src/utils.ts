/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-04-13 18:36:41
 * @path: \types\src\utils.ts
 */
import { type Component } from "vue";
/**
 * 任意类型的异步函数
 */
type AnyPromiseFunction<T> = (...arg: T[]) => PromiseLike<T>;

/**
 * 任意类型的普通函数
 */
type AnyNormalFunction<T> = (...arg: T[]) => T;

/**
 * 任意类型的函数
 */
type AnyFunction<T> = AnyNormalFunction<T> | AnyPromiseFunction<T>;

/**
 *  T | null 包装
 */
type Nullable<T> = T | null;

/**
 * T | Not null 包装
 */
type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * 字符串类型对象
 */
type Recordable<T> = Record<string, T>;

/**
 * 字符串类型对象（只读）
 */
interface ReadonlyRecordable<T = any> {
  readonly [key: string]: T;
}

/**
 * setTimeout 返回值类型
 */
type TimeoutHandle = ReturnType<typeof setTimeout>;

/**
 * setInterval 返回值类型
 */
type IntervalHandle = ReturnType<typeof setInterval>;

/**
 * 懒加载数据
 */
type Lazy<T> = () => Promise<T>;

/**
 * 懒加载Vue组件
 */
type lazyLoadComponent = Lazy<{ default: Component }>;

/**
 * 深度可选
 */
type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

interface VoidFunction {
  (): void;
}

export type {
  AnyFunction,
  AnyNormalFunction,
  AnyPromiseFunction,
  IntervalHandle,
  NonNullable,
  Nullable,
  ReadonlyRecordable,
  Recordable,
  TimeoutHandle,
  Lazy,
  lazyLoadComponent,
  DeepPartial,
  VoidFunction,
};
