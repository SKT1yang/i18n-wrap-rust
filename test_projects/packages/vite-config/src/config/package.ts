/*
 * @name: 组件打包配置
 * @description: Do not edit
 */

/* 类型文件 */
import type { DefineOptions } from '../types/plugin';
/* 第三方模块 */
import { readPackageJSON } from 'pkg-types';
import { defineConfig, mergeConfig, type UserConfig, loadEnv } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-inject-css';
import dts from 'vite-plugin-dts';
/* 本地模块 */
import { createPlugins } from '../plugins';
import { commonConfig } from './common';
import { wrapperEnv } from '../utils/env';
import { resolveProxy } from '../plugins/https';

function definePackageConfig(defineOptions: DefineOptions = {}) {
  const { overrides = {}, options } = defineOptions;
  const root = process.cwd();
  const { extraCss = false, unocssOptions = {} } = options || {};

  return defineConfig(async ({ command, mode }) => {
    const { dependencies = {}, peerDependencies = {} } =
      await readPackageJSON(root);
    const envRecord = loadEnv(mode, root);
    const env = wrapperEnv(envRecord);
    const {
      VITE_BUILD_COMPRESS = 'none',
      VITE_ENABLE_ANALYZE = true,
      VITE_PROXY,
      VITE_DEV_TOOLS = true,
      VITE_DROP_CONSOLE = false,
    } = env;

    const plugins = await createPlugins({
      dropConsole: VITE_DROP_CONSOLE,
      enableAnalyze: VITE_ENABLE_ANALYZE,
      compress: VITE_BUILD_COMPRESS,
      proxyList: VITE_PROXY,
      useUnocss: true,
      unocssOptions: {
        // todo test不应该参与打包
        iconFolderPath: './test/shared/assets/icons',
        // 开发模式时宿主环境注入 unocss preflight，打包模式不注入
        preflight: command === 'serve',
        ...unocssOptions,
      },
      useVueDevTools: VITE_DEV_TOOLS,
    });

    const packageConfig: UserConfig = {
      server: {
        host: true,
        hmr: true,
        proxy: VITE_PROXY ? resolveProxy(VITE_PROXY) : undefined,
      },
      build: {
        lib: {
          entry: ['src/index.ts'],
        },
        rollupOptions: {
          external: [
            ...Object.keys(dependencies),
            ...Object.keys(peerDependencies),
          ],
          output: [
            {
              format: 'es',
              dir: 'es',
            },
            {
              format: 'cjs',
              dir: 'cjs',
              exports: 'named',
            },
          ],
        },
        minify: false,
        copyPublicDir: false,
      },
      resolve: {
        alias: [
          {
            find: /@\//,
            replacement: process.cwd() + '/src/',
          },
          {
            find: /#\//,
            replacement: process.cwd() + '/test/',
          },
        ],
        extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
      },
      plugins: [
        ...plugins,
        dts({
          outDir: ['es', 'cjs'],
          logLevel: 'error',
          exclude: ['test'],
          pathsToAliases: true,
          ...options?.dts,
        }),
        !extraCss && cssInjectedByJsPlugin(),
      ],
    };
    const mergedConfig = mergeConfig(commonConfig, packageConfig);
    return mergeConfig(mergedConfig, overrides);
  });
}

export { definePackageConfig };
