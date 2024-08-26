/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { ThemeScope } from './themeScope';
import type { SeedToken, AliasToken } from '../internal';
import { computeColorSchemeMode } from '../internal';
import { THEME_INFO, ROOT_ELEMENT_ID } from './constant';
import { ls } from '../utils';
import { ThemeStoreItem, ThemeEventName, ThemeChangeResponse } from './types';
import { ThemeName } from '../type';

class ThemeCenter {
  themeCenter = new Map<string, ThemeScope>();

  persist = true;
  constructor(option: {
    scopes: ThemeScope[];
    /**
     * @description 立即执行
     * @default false
     */
    immediate?: boolean;
    persist?: boolean;
  }) {
    const { scopes, immediate = true, persist = true } = option;
    this.persist = persist;
    scopes.forEach((scope) => {
      this.set(scope);
    });
    // 1.持久化
    if (this.persist) {
      this.analyzeThemeStore();
    }
    // 2. 渲染
    if (immediate) {
      this.render();
    }
  }

  set(scope: ThemeScope) {
    this.themeCenter.set(scope.id, scope);
  }

  change(
    theme: ThemeName,
    seed?: Partial<SeedToken>,
    id: string = ROOT_ELEMENT_ID,
    token?: Partial<AliasToken> | null
  ) {
    const targetScope = this.themeCenter.get(id);
    if (targetScope) {
      targetScope.changeTheme({
        id,
        theme,
        seed,
        token,
      });
    }
  }

  replace() {}

  clear() {}

  remove() {}

  render() {
    this.themeCenter.forEach((themeScope) => {
      this.renderScope(themeScope);
    });
  }

  renderScope(themeScope: ThemeScope) {
    themeScope.render();
    if (this.persist) {
      themeScope.persist();
    }
  }

  analyzeThemeStore() {
    const themeStore = ls.get<Record<string, ThemeStoreItem>>(THEME_INFO);
    if (!themeStore) {
      return;
    }
    for (const id in themeStore) {
      if (Object.prototype.hasOwnProperty.call(themeStore, id)) {
        const themeStoreItem = themeStore[id];
        let scope = new ThemeScope(themeStoreItem);
        this.set(scope);
      }
    }
  }
  /**
   * 监听事件
   */
  on(
    eventName: ThemeEventName,
    callback: (data: ThemeChangeResponse) => any,
    options?: EventOptions
  ) {
    const { id = ROOT_ELEMENT_ID } = options || {};
    const targetScope = this.themeCenter.get(id);
    if (targetScope) {
      targetScope.on(eventName, callback);
    }
  }
  getColorSchemeMode(id: string = ROOT_ELEMENT_ID) {
    const targetScope = this.themeCenter.get(id);
    if (targetScope) {
      return computeColorSchemeMode(targetScope.seed.colorScheme);
    }
  }
}

interface EventOptions {
  id: string;
}

export { ThemeCenter };
