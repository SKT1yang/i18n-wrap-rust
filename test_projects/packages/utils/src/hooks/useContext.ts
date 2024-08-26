/*
 * @name: 通用组件依赖注入
 * @description: Do not edit
 * @date: 2023-02-17 14:24:54
 * @path: \utils\src\hooks\useContext.ts
 */
import { InjectionKey, provide, inject } from "vue";

type Key<T> = InjectionKey<T> | string;

export function provideContext<T>(key: Key<T>, context: T) {
  provide(key, context);

  return {
    context,
  };
}

export function injectContext<T>(key: Key<T>): T | undefined;
export function injectContext<T>(
  key: Key<T>,
  defaultValue: T
): T extends undefined ? T | undefined : T;
export function injectContext<T>(key: Key<T>, defaultValue: T | (() => T)): T;
export function injectContext<T>(key: Key<T>, defaultValue?: T) {
  return inject(key, defaultValue);
}
