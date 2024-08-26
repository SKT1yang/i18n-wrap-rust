/* 类型文件 */
import type { DefineOptions, ViteEnv } from '../types/plugin';
/* 第三方模块 */
import { resolve } from 'path';
import dayjs from 'dayjs';
import { readPackageJSON } from 'pkg-types';
import { defineConfig, loadEnv, mergeConfig, type UserConfig } from 'vite';
/* 本地模块 */
import { createPlugins } from '../plugins';
import { commonConfig } from './common';
import { wrapperEnv } from '../utils/env';
import { resolveProxy } from '../plugins/https';

function defineApplicationConfig(defineOptions: DefineOptions = {}) {
  const { overrides = {} } = defineOptions;

  return defineConfig(async ({ command, mode }) => {
    const root = process.cwd();
    const isBuild = command === 'build';
    const envRecord = loadEnv(mode, root);
    const env = wrapperEnv(envRecord);
    const {
      VITE_BUILD_COMPRESS = 'gzip',
      VITE_ENABLE_ANALYZE = true,
      VITE_PROXY,
      VITE_PUBLIC_PATH = './',
      VITE_DEV_TOOLS = true,
      VITE_DROP_CONSOLE = isBuild,
    } = env;

    const defineData = await createDefineData(root, env);
    const plugins = await createPlugins({
      dropConsole: VITE_DROP_CONSOLE,
      enableAnalyze: VITE_ENABLE_ANALYZE,
      compress: VITE_BUILD_COMPRESS,
      proxyList: VITE_PROXY,
      useUnocss: true,
      useVueDevTools: VITE_DEV_TOOLS,
    });

    const pathResolve = (pathname: string) => resolve(root, '.', pathname);

    const applicationConfig: UserConfig = {
      base: VITE_PUBLIC_PATH === undefined ? './' : VITE_PUBLIC_PATH,
      esbuild: {
        drop: isBuild ? ['debugger', 'console'] : [],
      },
      resolve: {
        alias: [
          {
            find: /@\//,
            replacement: pathResolve('src') + '/',
          },
        ],
        extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
      },
      define: defineData,
      server: {
        port: 5173,
        host: true,
        hmr: true,
        proxy: Boolean(VITE_PROXY) ? resolveProxy(VITE_PROXY) : undefined,
      },
      build: {
        rollupOptions: {
          output: {
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'js/_entry-[name]-[hash].js',
            assetFileNames: '[ext]/[name]-[hash].[ext]',
            manualChunks: {
              vue: ['vue', 'pinia', 'vue-router', 'ant-design-vue'],
            },
          },
        },
      },
      plugins: [...plugins],
    };

    const mergedConfig = mergeConfig(commonConfig, applicationConfig);

    return mergeConfig(mergedConfig, overrides);
  });
}

async function createDefineData(root: string, env: ViteEnv) {
  try {
    const pkgJson = await readPackageJSON(root);
    const { dependencies, devDependencies, name, version } = pkgJson;

    const __APP_GLOBAL_BUILD_INFO__ = {
      pkg: { dependencies, devDependencies, name, version },
      lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      lastBUildTimestamp: new Date().getTime().toString(),
      ...env,
    };
    return {
      __APP_GLOBAL_BUILD_INFO__: JSON.stringify(__APP_GLOBAL_BUILD_INFO__),
    };
  } catch (error) {
    return {};
  }
}

export { defineApplicationConfig };
