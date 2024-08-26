/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-12 10:46:22
 * @path: \emitter\src\mittSync.ts
 */
import { SyncParallelHook, type Good } from "@guolisec/schedule";
import { isUnitData } from "./utils";

function mitt(): Emitter {
  const emitter = new SyncParallelHook({
    delayTrigger: false,
  });

  function emit<T = any>(topic: string, data?: any) {
    const result =
      data !== undefined
        ? emitter.emit<T>(topic, {
            data,
          })
        : emitter.emit<T>(topic);
    if (Array.isArray(result)) {
      return result.map((item) => {
        if (isUnitData(item)) {
          return item.directData;
        } else {
          return item;
        }
      });
    } else {
      return [];
    }
  }

  function on<T = any>(topic: string, handler: (data: any) => any) {
    const result = emitter.on<T>(topic, {
      handler(notify) {
        return handler(notify?.data);
      },
    });
    if (result !== undefined) {
      let dataList = result.dataList.map((list) => {
        return list.map((item) => {
          if (isUnitData(item)) {
            return item.directData;
          } else {
            return item;
          }
        });
      });

      return {
        good: result.good,
        dataList,
      };
    } else {
      return undefined;
    }
  }

  function off(topic: string, good?: Good) {
    emitter.off(topic, good);
  }

  function clear() {
    emitter.clear();
  }

  return {
    on,
    emit,
    off,
    clear,
    emitter,
  };
}

interface Emitter {
  on: <T = any>(
    topic: string,
    handler: (data: any) => any
  ) =>
    | {
        good: Good;
        dataList: T[][];
      }
    | undefined;
  emit: <T = any>(topic: string, data?: any) => T[];
  off: (topic: string, good?: Good) => void;
  clear: () => void;
  // 请勿使用，为了方便查看有什么订阅消息
  emitter: SyncParallelHook;
}

export { mitt, type Emitter };
