/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { AsyncParallelHook, type Good } from '@guolisec/schedule';
import { isUnitData } from './utils';

function mittAsync(): AsyncMitter {
  const emitter = new AsyncParallelHook({
    delayTrigger: false,
  });

  async function emit<T = any>(topic: string, data?: any) {
    const result =
      data !== undefined
        ? await emitter.emit<T>(topic, {
            data,
          })
        : await emitter.emit<T>(topic);
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

  async function on<T = any>(
    topic: string,
    handler: (data: any) => Promise<any>
  ) {
    const result = await emitter.on<T>(topic, {
      async handler(notify) {
        return await handler(notify?.data);
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

interface AsyncMitter {
  on: <T = any>(
    topic: string,
    handler: (data: any) => Promise<any>
  ) => Promise<
    | {
        good: Good;
        dataList: T[][];
      }
    | undefined
  >;
  emit: <T = any>(topic: string, data?: any) => Promise<T[]>;
  off: (topic: string, good?: Good) => void;
  clear: () => void;
  // 请勿使用，为了方便查看有什么订阅消息
  emitter: AsyncParallelHook;
}

export { mittAsync, type AsyncMitter };
