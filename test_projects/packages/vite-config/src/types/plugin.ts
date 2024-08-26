/*
 * @name: Do not edit
 * @description: Do not edit
 */
import type { UnocssOptions } from '../plugins/unocss';
import type { UserConfig } from 'vite';
import type { PluginOptions as DtsPluginOptions } from 'vite-plugin-dts';

interface ApplicationPluginOptions {
  dropConsole: boolean;
  compress: string;
  proxyList: ProxyList;
  enableAnalyze?: boolean;
  useHttps?: boolean;
  useUnocss?: boolean;
  useVueDevTools?: boolean;
  unocssOptions?: UnocssOptions;
}

type ProxyItem = [string, string];
type ProxyList = ProxyItem[];

interface H2ProxyOptions {
  [regexp: string]: {
    target: string;
    rewrite?: (url: string) => string;
    headers?: Record<string, number | string | string[] | undefined>;
    secure?: boolean;
  };
}

interface ViteEnv {
  VITE_PUBLIC_PATH: string;
  VITE_PROXY: ProxyList;
  VITE_DROP_CONSOLE: boolean;
  VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
  VITE_ENABLE_ANALYZE?: boolean;
  VITE_DEV_TOOLS?: boolean;
}

// vite.config.ts 可配置选项
interface DefineOptions {
  overrides?: UserConfig;
  options?: {
    /**
     * 构建分离css
     * @default false
     */
    extraCss?: boolean;
    //
    useUnocss?: boolean;
    unocssOptions?: UnocssOptions;
    dts?: DtsPluginOptions;
  };
}

export type {
  ApplicationPluginOptions,
  H2ProxyOptions,
  ProxyList,
  ViteEnv,
  DefineOptions,
};
