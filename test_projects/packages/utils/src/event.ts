/*
 * @name: Do not edit
 * @description: 存在副作用，尽量不要使用
 * @date: 2023-05-16 11:06:20
 * @path: \utils\src\event.ts
 */
// @ts-nocheck
import { type AnyFn, isClient } from "@vueuse/core";

const resizeHandler = (entries: ResizeObserverEntry[]) => {
  for (const entry of entries) {
    const listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach((fn: AnyFn) => {
        fn();
      });
    }
  }
};

/**
 *
 * @deprecated 存在副作用，尽量不要使用
 * @param element
 * @param fn
 */
export const addResizeListener = (
  element: HTMLElement,
  fn: (...args: unknown[]) => unknown
) => {
  if (!isClient || !element) return;
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
};

export const removeResizeListener = (
  element: HTMLElement,
  fn: (...args: unknown[]) => unknown
) => {
  if (!element || !element.__resizeListeners__) return;
  element.__resizeListeners__.splice(
    element.__resizeListeners__.indexOf(fn),
    1
  );
  if (!element.__resizeListeners__.length) {
    element.__ro__?.disconnect();
  }
};
