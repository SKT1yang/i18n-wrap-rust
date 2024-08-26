/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-16 14:20:22
 */
import { provideContext, injectContext } from '@guolisec/utils';

type Feature =
  | 'asset-field'
  | 'asset-safe-field';

type Features = Feature[];

interface PageAssetStatusContext {
  // 需页面隐藏的特性
  hiddenFeatures?: Features;
  // 需完全关闭的特性
  closeFeatures?: Features;
}

function provideAssetStatusContext(context: Partial<PageAssetStatusContext>) {
  return provideContext(
    'asset::status',
    context || {
      hiddenFeatures: [],
      closeFeatures: [],
    }
  );
}

function injectAssetStatusContext(): Partial<PageAssetStatusContext> {
  return injectContext('asset::status', {
    hiddenFeatures: [],
    closeFeatures: [],
  });
}

/**
 * 根据当前特性是否在需要隐藏的特性列表里，判断是否应该显示
 * @description 必须在顶层setup调用
 * @param feature 当前特性
 * @returns
 */
function isShowByFeature(currentFeature: Feature) {
  const context = injectAssetStatusContext();
  return !context.hiddenFeatures?.includes(currentFeature);
}

export {
  provideAssetStatusContext,
  injectAssetStatusContext,
  isShowByFeature,
  type Feature,
  type Features,
  type PageAssetStatusContext,
};
