/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { ThemeCenter } from './themerable/themeCenter';
import { ThemeScope, type ThemeName } from './themerable/themeScope';
import { __APP_GLOBAL_THEME_CENTER__ } from './themerable/constant';
import { SeedToken, AliasToken } from './internal/interface';

declare global {
  export var __APP_GLOBAL_THEME_CENTER__: ThemeCenter | undefined;
}

function setupTheme(themeCenter: ThemeCenter) {
  if (!globalThis[__APP_GLOBAL_THEME_CENTER__]) {
    globalThis[__APP_GLOBAL_THEME_CENTER__] = themeCenter;
  } else {
    console.warn(`[ThemeCenter Warning] 全局主题中心已存在！`);
  }
}

function useTheme() {
  return globalThis[__APP_GLOBAL_THEME_CENTER__] as ThemeCenter;
}

export {
  setupTheme,
  useTheme,
  ThemeScope,
  ThemeCenter,
  type ThemeName,
  type SeedToken,
  type AliasToken,
};
