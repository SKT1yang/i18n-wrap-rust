/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-28 15:03:10
 * @path: \utils\src\cache.ts
 */
import { isObject } from "lodash-es";
import { isJson } from "./is";

class WebStorage {
  private storage: Storage;
  constructor(storage = globalThis.localStorage) {
    this.storage = storage;
  }

  /*
   * 设置缓存
   * @param {string} key
   * @param {*} value
   * @memberof WebStorage
   */
  set(key: string, value: any) {
    if (value && isObject(value)) {
      return this.storage.setItem(key, JSON.stringify(value));
    } else {
      this.storage.setItem(key, value);
    }
  }

  /*
   * 读取缓存
   * @param {string} key
   * @memberof WebStorage
   */
  get<T extends Record<any, any> | string | null>(key: string) {
    const string = this.storage.getItem(key);
    if (string && isJson(string)) {
      return JSON.parse(string) as T;
    } else {
      return this.storage.getItem(key) as T;
    }
  }

  /*
   * 删除缓存
   * @param {string} key
   * @memberof WebStorage
   */
  remove(key: string) {
    return this.storage.removeItem(key);
  }
}

const localStorageInstance = new WebStorage();
const sessionStorageInstance = new WebStorage(globalThis.sessionStorage);

export { WebStorage, localStorageInstance as ls, sessionStorageInstance as ss };
