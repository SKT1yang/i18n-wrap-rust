/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-04-24 11:03:04
 * @path: \glsec\packages\utils\src\hooks\useWindowSizeFn.ts
 */
import { type AnyFunction } from "@guolisec/types";
import { tryOnMounted, tryOnUnmounted, useDebounceFn } from "@vueuse/core";

interface UseWindowSizeFnOptions {
  /**
   * @description 节流时间
   * @default 150
   */
  wait?: number;
  /**
   * @description 立即执行
   * @default false
   */
  immediate?: boolean;
  /**
   * @description 只执行一次
   * @default false
   */
  once?: boolean;
}

function useWindowSizeFn(
  fn: AnyFunction<any>,
  options: UseWindowSizeFnOptions = {}
) {
  const { wait = 150, immediate } = options;

  let handler = () => {
    fn();
  };

  handler = useDebounceFn(handler, wait);

  const start = () => {
    if (immediate) {
      handler();
    }
    window.addEventListener("resize", handler);
  };

  const stop = () => {
    window.removeEventListener("resize", handler);
  };

  tryOnMounted(() => {
    start();
  });

  tryOnUnmounted(() => {
    stop();
  });
  return { start, stop };
}

export { useWindowSizeFn, type UseWindowSizeFnOptions };
