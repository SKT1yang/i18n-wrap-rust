/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-12 10:46:22
 * @path: \schedule\test\test.ts
 */
import { AsyncParallelHook } from "../src";
async function test() {
  const hook = new AsyncParallelHook();

  /**
   * 基础功能测试
   */
  hook.on("logout", {
    handler: (config) => {
      console.log("run logout sync", config);
      return "return sync";
    },
  });

  const result1 = await hook.emit("logout", {
    params: [
      {
        a: 1,
        b: 2,
      },
    ],
  });

  console.log("result1", result1);

  /**
   * once功能测试
   */
  hook.on("once", {
    once: true,
    handler: (config) => {
      console.log("run once", config);
      return "return once";
    },
  });

  const result2 = await hook.emit("once", {
    params: [1],
  });

  const result3 = await hook.emit("once", {
    params: [1],
  });

  console.log("result2 result3", result2, result3);

  /**
   * 5秒 setTimeout测试
   */
  hook.on("setTimeout", {
    handler: async (config) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("run setTimeout", config);
          resolve("return setTimeout");
        }, 5000);
      });
    },
  });

  const result4 = await hook.emit("setTimeout", {
    params: [
      {
        a: 1,
        b: 2,
      },
    ],
  });

  console.log("result4", result4);
}

/**
 * 测试Notify的Handler属性是否生效
 */
async function testNotifyHandler() {
  const hook = new AsyncParallelHook();
  hook.on("testNotifyHandler", {
    handler: (config) => {
      console.log("run testNotifyHandler");
      const result = "return testNotifyHandler";
      if (config?.handler) {
        config?.handler(result);
      }
      return result;
    },
  });

  const result1 = await hook.emit("testNotifyHandler", {
    handler(result) {
      console.log("Notify的Handler属性生效了");
    },
  });

  console.log("result1", result1);
}

export { test, testNotifyHandler };
