/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-07-06 15:16:07
 * @path: \theme\src\utils.ts
 */
import { getAlphaColor } from "./internal";

function isObject(value: any) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}

function isJson(str: string) {
  if (typeof str === "string") {
    try {
      const obj = JSON.parse(str);
      return typeof obj === "object" && obj;
    } catch (e) {
      return false;
    }
  }
}

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

type CssVariable = `--${string}`;

function getCssVariableValue(
  prop: string,
  element: HTMLElement = document.body
) {
  const computedStyle = window.getComputedStyle(element);
  return computedStyle.getPropertyValue(prop).trim();
}

function getOriginalCssVarProperty(
  prop: CssVariable,
  element: HTMLElement = document.body
) {
  return element.style.getPropertyValue(prop);
}

/**
 * css var的js函数版本
 * @param cssVariable css 变量key，"--" 开头
 * @param defaultValue 默认值
 * @param element 目标元素，未找到会向上递归
 */
function cssVar(
  prop: CssVariable,
  defaultValue: string = "",
  element: HTMLElement = document.body
) {
  // 计算后的样式，已经计算了继承
  return getCssVariableValue(prop, element) || defaultValue;
}

export {
  localStorageInstance as ls,
  cssVar,
  getAlphaColor,
  getOriginalCssVarProperty,
};
