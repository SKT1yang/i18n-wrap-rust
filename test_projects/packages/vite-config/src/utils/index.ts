/*
 * @name: Do not edit
 * @description: Do not edit
 */

import { resolve } from 'path';
import { cloneDeep } from '@guolisec/utils';

function pathResolve(pathname: string) {
  const root = process.cwd();
  const result = resolve(root, pathname);
  return result;
}

/**
 * 给umd格式包定义全局名
 * @param dependencies
 */
function resolveUmdGlobals(dependencies: Record<string, string>) {
  const object = cloneDeep(dependencies);
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object[key] = toCamelCase(key);
    }
  }
  return object;
}

/**
 * 英文转驼峰
 * @param str
 */
function toCamelCase(str: string) {
  const result = str
    .replace(/\@/g, '')
    .replace(/[-\/](.)/g, function (_match, group1) {
      return group1.toUpperCase();
    });
  return result;
}

export { pathResolve, resolveUmdGlobals };
