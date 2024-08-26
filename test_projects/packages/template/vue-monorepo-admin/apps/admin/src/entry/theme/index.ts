/*
 * @name: 主题中心
 * @description: 默认全局主题，涉及局部主题按需求修改此文件
 */

import { ref } from 'vue'
import { ThemeCenter, ThemeScope, setupTheme } from '@guolisec/theme'
import { isInIframe, queryParse } from '@guolisec/utils'

/**
 * 主题初始化注入
 */
const themeScope = new ThemeScope({
  seed: {
    colorScheme: getInitColorScheme('light')
  }
})

const themeCenter = new ThemeCenter({
  scopes: [themeScope],
  persist: false
})

// 全局明暗
const currentColorScheme = ref(themeCenter.getColorSchemeMode())

themeScope.on('change', ({ colorSchemeMode }) => {
  currentColorScheme.value = colorSchemeMode
})

// ! 初始化全局路由实例
setupTheme(themeCenter)

/**
 * 初始明暗
 * @param defaultColorScheme 默认明暗
 */
function getInitColorScheme(defaultColorScheme: 'dark' | 'light') {
  const colorScheme = queryParse(location.search.substring(1)).colorScheme as 'dark' | 'light'
  return isInIframe() && ['dark', 'light'].includes(colorScheme) ? colorScheme : defaultColorScheme
}

/**
 * 切换明暗
 */
function switchColorScheme() {
  changeColorScheme(currentColorScheme.value === 'dark' ? 'light' : 'dark')
}

/**
 * 修改明暗
 * @param colorScheme 明暗配置： "dark" | "light"
 */
function changeColorScheme(colorScheme: 'dark' | 'light') {
  // 明暗不变，不处理
  if (themeScope.token?.colorScheme === colorScheme) {
    return
  }
  themeCenter.change(themeScope.token?.theme || 'default', {
    colorScheme
  })
}

export { currentColorScheme, switchColorScheme }
