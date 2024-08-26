/**
 * @name: unocss 插件配置
 * @description: The instant on-demand atomic CSS engine.
 * @see https://github.com/unocss/unocss
 */

import type { PluginOption } from 'vite';
import Unocss from 'unocss/vite';
import { presetIcons, presetUno } from 'unocss';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';

const PREFIX = 'i-';

type UnocssOptions = {
  // 是否解析宿主环境本地的icons
  local?: boolean;
  // 插入解析后css的方式
  mode?: 'global' | 'per-module' | 'vue-scoped' | 'dist-chunk' | 'shadow-dom';
  // 是否引入全局uno属性
  useSafelist?: boolean;
  // 宿主环境icons路径
  iconFolderPath?: string;
  // 是否在宿主环境注入unocss预设
  preflight?: boolean;
};

function configUnocssPlugin(opt: UnocssOptions = {}): PluginOption {
  const {
    local = true,
    mode = 'global',
    useSafelist = false,
    iconFolderPath = './src/shared/assets/icons',
    preflight = true,
  } = opt;

  return Unocss({
    mode,
    content: {
      pipeline: {
        exclude: ['.git', 'dist'],
      },
    },
    presets: [
      presetIcons({
        collections: {
          local: getLocaLcollection(local, iconFolderPath),
          base: () =>
            // @ts-ignore
            import('@iconify-icons/base/index.mjs').then((i) => i.default),
        },
        prefix: PREFIX,
        extraProperties: {
          display: 'inline-block',
        },
      }),
      presetUno({
        preflight,
      }),
    ],
    safelist: getSafelist(useSafelist),
    rules: [
      ['align-icon', { 'vertical-align': '-0.125em' }],
      [
        'shadow-3xl',
        {
          'box-shadow': `0 3px 6px 0 rgba(0, 0, 0, 0.09),
                         0 3px 18px -3px rgba(0, 0, 0, 0.06),
                         0 6px 12px 0 rgba(0, 0, 0, 0.06)`,
        },
      ],
    ],
    shortcuts: {
      'flex-center': 'flex justify-center items-center',
      'flex-between': 'flex justify-between items-center',
      'flex-end': 'flex justify-end items-center',
    },
  });
}

/**
 * @description 格式化路径
 * @param absolutePath 初始路径
 * @returns
 */
function normalizePath(absolutePath: string) {
  return absolutePath.replace(/\\/g, '/');
}

/**
 * 获取白名单
 * @deprecated 目前尽量不使用，因为会给宿主环境注入多份unocss 预设
 * @param useSafelist 是否使用白名单
 */
function getSafelist(useSafelist: boolean) {
  return useSafelist ? undefined : undefined;
}

function getLocaLcollection(local: boolean, iconFolderPath: string) {
  try {
    return local
      ? FileSystemIconLoader(normalizePath(iconFolderPath))
      : () => undefined;
  } catch (error) {
    return () => undefined;
  }
}

export { configUnocssPlugin, type UnocssOptions };
