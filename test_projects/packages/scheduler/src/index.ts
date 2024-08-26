/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-30 16:17:50
 * @path: \scheduler\src\index.ts
 */
import {
  AsyncParallelHook,
  type UserGood,
  type Notify,
  type Good,
} from "@guolisec/schedule";

declare global {
  export var __APP_GLOBAL_SCHEDULER_INSTANCE__: AsyncParallelHook;
}

const __APP_GLOBAL_SCHEDULER_INSTANCE__ = "__APP_GLOBAL_SCHEDULER_INSTANCE__";

if (!globalThis[__APP_GLOBAL_SCHEDULER_INSTANCE__]) {
  globalThis[__APP_GLOBAL_SCHEDULER_INSTANCE__] = new AsyncParallelHook();
}

async function on<T = any>(topic: string, body: UserGood) {
  return globalThis[__APP_GLOBAL_SCHEDULER_INSTANCE__].on<T>(topic, body);
}

async function emit<T = any>(topic: string, body?: Omit<Notify, "topic">) {
  return globalThis[__APP_GLOBAL_SCHEDULER_INSTANCE__].emit<T>(topic, body);
}

function off(topic: string, body: Good) {
  globalThis[__APP_GLOBAL_SCHEDULER_INSTANCE__].off(topic, body);
}

export { on, emit, off };
