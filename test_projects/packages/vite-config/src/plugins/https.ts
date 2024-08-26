/**
 * Vite Plugin for Enable https and http2
 * 用于启用 https 和 http2 的 Vite 插件
 * @see https://github.com/swandir/vite-plugin-http2-proxy
 * @see https://github.com/liuweiGL/vite-plugin-mkcert
 */

import Mkcert from 'vite-plugin-mkcert';
import Proxy from 'vite-plugin-http2-proxy';
import { PluginOption, ProxyOptions } from 'vite';
import type { ProxyList, H2ProxyOptions } from '../types/plugin';

/**
 * Generate proxy
 * @param list
 */
function createH2Proxy(list: ProxyList = []) {
  const ret: H2ProxyOptions = {};
  for (const [prefix, target] of list) {
    // websocket协议排除
    const isWebsocket = /^ws:\/\//.test(target) || /^wss:\/\//.test(target);
    if (!isWebsocket) {
      ret[`^${prefix}`] = {
        target,
        rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      };
    }
  }
  return ret;
}

function configHttpsPlugin(proxyList: ProxyList) {
  const plugins: PluginOption[] = [];

  plugins.push(Mkcert());
  plugins.push(Proxy(createH2Proxy(proxyList)));
  return plugins;
}

/**
 * Configure according to the proxy list
 * @param proxyList
 */
function resolveProxy(proxyList: [string, string][] = []) {
  const proxy: Record<string, ProxyOptions> = {};
  for (const [prefix, target] of proxyList) {
    const isHttps = /^https:\/\//.test(target);
    // https://github.com/http-party/node-http-proxy#options
    proxy[prefix] = {
      target: target,
      changeOrigin: true,
      ws: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return proxy;
}

export { configHttpsPlugin, resolveProxy };
