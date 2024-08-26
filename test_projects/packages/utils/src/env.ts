/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \utils\src\env.ts
 */
/// <reference types="vite/client" />
/**
 * @description: Development mode
 */
const devMode = 'development';

/**
 * @description: Production mode
 */
const prodMode = 'production';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
function isDev(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
function isProd(): boolean {
  return import.meta.env.PROD;
}

/**
 * 判断当前网页是否被iframe嵌套
 */
function isInIframe() {
  try {
    return globalThis.self !== globalThis.top;
  } catch (error) {
    return false;
  }
}

function warn(...data: any[]) {
  isDev() ? console.warn(data) : undefined;
}

function log(...data: any[]) {
  isDev() ? console.log(...data) : undefined;
}

export { devMode, prodMode, getEnv, isDev, isProd, isInIframe, warn, log };
