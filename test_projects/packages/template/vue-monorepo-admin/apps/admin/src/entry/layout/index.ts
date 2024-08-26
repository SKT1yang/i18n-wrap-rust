/*
 * @name: 布局集
 * @description: 系统能力，需要对外（插件、组件）暴露
 */

import type { Component } from 'vue'

function getLayoutMap() {
  const LayoutMap = new Map<string, Component>()
  return LayoutMap
}

export { getLayoutMap }
