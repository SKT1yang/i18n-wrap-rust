/*
 * @name: Do not edit
 * @description: Do not edit
 */

import { join } from 'path';

import dotenv from 'dotenv';
import { readFile } from 'fs-extra';
import type { ViteEnv } from '../types/plugin';
import { isJson } from '@guolisec/utils';

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script as string;
  const reg = /--mode ([a-z_\d]+)/;
  const result = reg.exec(script);
  if (result) {
    const mode = result[1];
    return ['.env', `.env.${mode}`];
  }
  return ['.env', '.env.production'];
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
export async function getEnvConfig(
  match = 'VITE_GLOB_',
  confFiles = getConfFiles()
) {
  let envConfig = {};

  for (const confFile of confFiles) {
    try {
      const envPath = await readFile(join(process.cwd(), confFile), {
        encoding: 'utf8',
      });
      const env = dotenv.parse(envPath);
      envConfig = { ...envConfig, ...env };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Error in parsing ${confFile}`, e);
    }
  }
  const reg = new RegExp(`^(${match})`);
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });
  return envConfig;
}

/**
 * 字符串配置转换成实际配置对象
 * @param envConf node读取的vite env 配置，为纯字符串
 */
type ViteEnvKey = keyof ViteEnv;
export function wrapperEnv(envConf: Record<string, any>): ViteEnv {
  const viteEnv: Partial<ViteEnv> = {};
  for (const key of Object.keys(envConf)) {
    let realname = envConf[key].replace(/\\n/g, '\n');
    realname =
      realname === 'true' ? true : realname === 'false' ? false : realname;

    if (realname && isJson(realname)) {
      try {
        realname = JSON.parse(realname.replace(/'/g, '"'));
      } catch (error) {
        realname = '';
      }
    }

    viteEnv[key as unknown as ViteEnvKey] = realname;
    if (typeof realname === 'string') {
      process.env[key] = realname;
    } else if (typeof realname === 'object') {
      process.env[key] = JSON.stringify(realname);
    }
  }
  return viteEnv as ViteEnv;
}
