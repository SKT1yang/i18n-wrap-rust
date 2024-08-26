/*
 * @name: 主题中心
 * @description: 默认全局主题，涉及局部主题按需求修改此文件
 */

import { ref } from 'vue'
import { ThemeCenter, ThemeScope, setupTheme, useTheme, type ThemeName } from '@guolisec/theme'
import { isInIframe, queryParse } from '@guolisec/utils'

/**
 * 主题初始化注入
 */
function inject() {
  const scope = new ThemeScope({
    seed: {
      colorScheme: getInitColorScheme('light')
    }
  })

  const themeCenter = new ThemeCenter({
    scopes: [scope],
    persist: false
  })

  // ! 初始化全局路由实例
  setupTheme(themeCenter)

  return scope
}

const themeScope = inject()

/**
 * 获取初始明暗配置
 * @param defaultColorScheme
 */
function getInitColorScheme(defaultColorScheme: 'dark' | 'light') {
  const colorScheme = queryParse(location.search.substring(1)).colorScheme as
    | 'dark'
    | 'light'
    | undefined
  return isInIframe() && colorScheme && ['dark', 'light'].includes(colorScheme)
    ? colorScheme
    : defaultColorScheme
}

/**
 * 修改主题
 * @param theme 主题名
 */
function changeTheme(theme: ThemeName) {
  const themeCenter = useTheme()
  themeCenter.change(theme || 'default')
}

/**
 * 获取全局主题明暗
 */
function getCurrentColorScheme() {
  const themeCenter = useTheme()
  const currentColorScheme = ref(themeCenter.getColorSchemeMode())
  themeScope.on('change', ({ colorSchemeMode }) => {
    currentColorScheme.value = colorSchemeMode
  })
  return currentColorScheme
}

/**
 * 修改全局主题明暗
 * @param colorScheme 明暗配置： "dark" | "light"
 */
function changeColorScheme(colorScheme: 'dark' | 'light') {
  const themeCenter = useTheme()
  themeCenter.change(themeScope.token?.theme || 'default', {
    colorScheme: colorScheme
  })
}

/**
 * 切换全局主题明暗
 */
function switchColorScheme() {
  const currentColorScheme = getCurrentColorScheme()
  const colorScheme: 'dark' | 'light' = currentColorScheme.value === 'dark' ? 'light' : 'dark'
  changeColorScheme(colorScheme)
}

export { themeScope, getCurrentColorScheme, changeTheme, changeColorScheme, switchColorScheme }
