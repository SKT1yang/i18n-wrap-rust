/*
 * @name: 开关特性和功能的上下文
 * @description: 默认全开，有选择的关闭特性和功能，和docs的
 */

import type { GenerateFeature } from '@guolisec/types'
import { provideContext, injectContext } from '@guolisec/utils'

type Feature = GenerateFeature<['feature::function']>

type Features = Feature[]

interface FeatureContext {
  // 需页面隐藏的特性
  hiddenFeatures?: Features
}

function provideFeatureContext(context: Partial<FeatureContext>) {
  return provideContext(
    'package::component',
    context || {
      hiddenFeatures: []
    }
  )
}

function injectFeatureContext(): Partial<FeatureContext> {
  return injectContext('package::component', {
    hiddenFeatures: []
  })
}

/**
 * 判断当前特性是否显示
 * @description 必须在顶层setup调用
 * @param feature 当前特性
 * @returns true: 显示； false:隐藏；
 */
function isShowByFeature(feature: Feature) {
  // 获取用户注入的配置
  const context = injectFeatureContext()
  // 获取用户希望隐藏的特性
  const hiddenFeatures = context?.hiddenFeatures ?? []
  // 未配置，默认显示
  if (hiddenFeatures.length === 0) return true
  return hiddenFeatures?.some((item) => {
    // 是否完全相等
    const isSame = item === feature
    // 是否为上级功能点
    const isSuper =
      feature.indexOf(item) === 0 && feature.slice(item.length, feature.length).startsWith('::')
    return isSame || isSuper
  })
}

export {
  type FeatureContext,
  type Features,
  provideFeatureContext,
  injectFeatureContext,
  isShowByFeature
}
