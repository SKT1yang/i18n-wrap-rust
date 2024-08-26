/*
 * @name: Do not edit
 * @description: Do not edit
 */
/* 类型文件 */
import type { ThemeName } from '../type';
import type { SeedToken, AliasToken } from '../internal';
import type {
  ThemeStoreItem,
  ThemeChangeResponse,
  ThemeEventName,
} from './types';
/* 第三方模块 */
import { AsyncParallelHook } from '@guolisec/schedule';
/* 共享模块 */
import { ls } from '../utils';
/* 业务模块 */
import { generateCssVariables } from './utils';
import {
  generateToken,
  computeColorSchemeMode,
  seedTokenFactory,
} from '../internal';
import {
  __APP_THEME_STYLESHEET_CONTAINER__,
  ROOT_ELEMENT_ID,
  THEME_INFO,
} from './constant';

interface ThemeScopeOption {
  theme?: ThemeName;
  id?: string;
  seed?: Partial<SeedToken>;
  token?: Partial<AliasToken> | null;
}

type Token = AliasToken | null;

class ThemeScope {
  private _id: string = ROOT_ELEMENT_ID;
  private _theme: ThemeName = 'default';
  private _seed: SeedToken = seedTokenFactory();
  private _token: Token = null;

  get id() {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get theme() {
    return this._theme;
  }

  set theme(theme: ThemeName) {
    this._theme = theme;
  }

  get seed() {
    return this._seed;
  }

  set seed(seed: SeedToken) {
    this._seed = seed;
  }

  get token() {
    return this._token;
  }

  set token(token: Token) {
    // 1.预测主题变化
    let themeIsChange = this.judageThemeChanged(token);
    // 2.执行主题变化
    this._token = token;
    // 3.初始变化事件
    themeIsChange && this.emitThemeChange();
  }

  private emitter = new AsyncParallelHook({
    delayTrigger: false,
  });

  constructor(option?: ThemeScopeOption) {
    this.parseOption(option);
  }

  /**
   * 处理配置
   * @param option
   */
  private parseOption(option?: ThemeScopeOption) {
    const { id, theme, seed, token } = option || {};
    if (id) {
      this.id = id;
    }
    if (theme) {
      this.theme = theme;
      Object.assign(this.seed, { theme });
    }
    if (seed) {
      Object.assign(this.seed, seed);
    }
    if (token && this.token) {
      Object.assign(this.token, token);
    }
  }

  /**
   * 注入css变量
   */
  render() {
    let currentRules = this.getCurrentRules();
    let styleRule = this.generateStyleRule();
    let selectorText = this.getSelectorText();
    currentRules.set(selectorText, styleRule);

    this.insertRenderText(currentRules);
    this.persist();
  }

  /**
   * 清除css变量
   */
  clear() {
    let currentRules = this.getCurrentRules();
    let selectorText = this.getSelectorText();
    currentRules.delete(selectorText);

    this.insertRenderText(currentRules);
  }

  persist() {
    let themeStore = ls.get<Record<string, ThemeStoreItem>>(THEME_INFO) || {};
    themeStore[this.id] = {
      id: this.id,
      theme: this.theme,
      seed: this.seed,
      token: this.token,
    };
    ls.set(THEME_INFO, themeStore);
  }

  /**
   * 全量替换规则（其他scope规则不变）
   * @param rules 当前所有scope规则
   */
  private insertRenderText(rules: Map<string, string>) {
    const sheet = this.getThemeHtmlStyleElement();
    let renderText = '';
    rules.forEach((rule) => {
      renderText += rule;
    });
    // 根主题 增加class并且设置
    if (this.isRootTheme()) {
      const colorSchemeMode = computeColorSchemeMode(this.seed.colorScheme);
      document.documentElement.classList.remove(
        'dark',
        'light',
        'normal',
        'default',
        'compact'
      );
      document.documentElement.classList.add(this.seed.theme, colorSchemeMode);
      renderText += `html {
        color-scheme: ${this.seed.colorScheme}
      }`;
    }
    sheet.innerHTML = renderText;
  }

  /**
   * 生成当前css规则
   */
  private generateStyleRule() {
    this.token = generateToken(this.seed);
    const cssVariables = generateCssVariables(this.token);
    let selectorText = this.getSelectorText();
    const cssStatements = Object.entries(cssVariables).map(
      ([key, value]) => `${key}: ${value}`
    );
    const cssStatementText = cssStatements.join(';');
    let styleRule = `
    ${selectorText} {
      ${cssStatementText}
    }
    `;
    return styleRule;
  }

  /**
   * 判断规则是否存在
   * @param selectorText 要检测的规则选择器字符串
   */
  private getCurrentRules(): Map<string, string> {
    let currentRules = new Map();
    const sheet = this.getThemeStyleSheet();
    const cssRules = sheet?.cssRules;
    if (cssRules) {
      for (let i = 0; i < cssRules.length; i++) {
        const rule = cssRules[i] as CSSStyleRule;
        currentRules.set(rule.selectorText, rule.cssText);
      }
    }
    return currentRules;
  }

  /**
   * 获取style的元素对象
   */
  private getThemeHtmlStyleElement() {
    let styleElement = document.querySelector(
      `#${__APP_THEME_STYLESHEET_CONTAINER__}`
    );
    if (styleElement === null) {
      styleElement = document.createElement('style');
      styleElement.setAttribute('id', __APP_THEME_STYLESHEET_CONTAINER__);
      document.head.appendChild(styleElement);
    }
    return styleElement as HTMLStyleElement;
  }

  /**
   * 获取style对象的sheet对象
   */
  private getThemeStyleSheet() {
    const styleElement = this.getThemeHtmlStyleElement();
    return styleElement.sheet as CSSStyleSheet;
  }

  private getSelectorText() {
    return this.id === ROOT_ELEMENT_ID ? 'html' : `#${this.id}`;
  }

  private isRootTheme() {
    return this.id === ROOT_ELEMENT_ID;
  }

  on(eventName: ThemeEventName, callback: (data: ThemeChangeResponse) => any) {
    this.emitter.on(eventName, {
      async handler(notify) {
        return await callback(notify?.data);
      },
    });
  }

  changeTheme(option?: ThemeScopeOption) {
    this.parseOption(option);
    this.render();
  }

  judageThemeChanged(newToken: Token) {
    return (
      newToken?.theme !== this.token?.theme ||
      newToken?.colorScheme !== this.token?.colorScheme
    );
  }

  private emitThemeChange() {
    const colorSchemeMode = computeColorSchemeMode(this.token?.colorScheme);
    const data = {
      theme: this.token?.theme ?? null,
      colorScheme: this.token?.colorScheme ?? null,
      colorSchemeMode: colorSchemeMode,
    };
    this.emitter.emit('change', {
      data,
    });
  }
}

export { ThemeScope, ThemeName, SeedToken, AliasToken };
