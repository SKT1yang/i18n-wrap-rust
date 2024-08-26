/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 11:23:35
 * @path: \utils\src\validate\helper.ts
 */
import { isFunction } from "lodash-es";

function resolve(callback: Function, allowCallback: boolean) {
  return allowCallback && isFunction(callback) ? callback() : Promise.resolve();
}

function reject(msg: string, callback: Function, allowCallback: boolean) {
  return allowCallback && isFunction(callback)
    ? callback(new Error(msg))
    : Promise.reject(msg);
}

export { resolve, reject };
