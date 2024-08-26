/*
 * @name: vite插件
 * @description: Do not edit
 */

import { type PluginOption } from 'vite';
import { type ApplicationPluginOptions } from '../types/plugin';
import { configCompressPlugin } from './compress';
import { configHttpsPlugin } from './https';
import { configUnocssPlugin } from './unocss';
import { createVueDevToolsPlugin } from './devtools';

async function createPlugins({
  dropConsole,
  compress,
  useHttps,
  proxyList,
  useUnocss,
  unocssOptions,
  useVueDevTools,
}: ApplicationPluginOptions) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [];

  // unocss
  if (useUnocss) {
    vitePlugins.push(configUnocssPlugin(unocssOptions));
  }

  // http2
  if (useHttps) {
    vitePlugins.push(configHttpsPlugin(proxyList));
  }

  // The following plugins only work in the production environment
  if (dropConsole) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin({
        compress,
      })
    );
  }

  // vue开发者工具
  if (useVueDevTools) {
    vitePlugins.push(createVueDevToolsPlugin());
  }

  return vitePlugins;
}

export { createPlugins };
