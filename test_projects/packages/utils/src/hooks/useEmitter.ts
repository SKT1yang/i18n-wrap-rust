/*
 * @name: 最简单的事件总线封装，你值得拥有
 * @description: Do not edit
 * @path: \utils\src\hooks\useEmitter.ts
 */
import { mitt, mittAsync, type Good } from "../emitter";
import { onMountedOrActivated, onUnMountedOrDeactivated } from "./";

/**
 * 同步
 * @returns
 */
function useEmitter() {
  const emitter = mitt();

  function on(name: string, callback: (...args: any[]) => any) {
    onMountedOrActivated(() => {
      emitter.on(name, callback);
    });

    onUnMountedOrDeactivated(() => {
      emitter.off(name);
    });
  }

  function off(name: string) {
    emitter.off(name);
  }

  function emit(name: string, data: any) {
    emitter.emit(name, data);
  }

  function clear() {
    emitter.clear();
  }

  return {
    on,
    off,
    clear,
    emit,
    emitter,
  };
}

function useEmitterAsync() {
  const emitter = mittAsync();

  function on(
    name: string,
    callback: (...args: any[]) => Promise<any>
  ): Promise<
    | {
        good: Good;
        dataList: any[][];
      }
    | undefined
  > {
    return emitter.on(name, async () => {
      new Promise((resolve, reject) => {
        onMountedOrActivated(async () => {
          try {
            const result = await callback();
            resolve(result);
          } catch (error) {
            reject();
          }
        });

        onUnMountedOrDeactivated(() => {
          emitter.off(name);
        });
      });
    });
  }

  function off(name: string) {
    emitter.off(name);
  }

  function emit(name: string, data: any) {
    return emitter.emit(name, data);
  }

  function clear() {
    emitter.clear();
  }

  return {
    on,
    off,
    clear,
    emit,
    emitter,
  };
}

export { useEmitter, useEmitterAsync };
