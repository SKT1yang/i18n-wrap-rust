/*
 * @name: 控制特性上下文
 * @description: 依赖注入
 */
import type { GenerateFeature } from '@guolisec/types';
import { provideContext, injectContext } from '@guolisec/utils';

type Feature = GenerateFeature<
  [
    'asset::create',
    'asset::merge',
    'asset::run-status',
    'asset::importance',
    'asset::group',
    'asset::layer',
    'asset::port',
    'asset::pro-search',
    'asset-field',
    'asset::export',
    'asset::import::merge-import',
    'asset::export::download-template',
    'asset::modify::batch',
    'safe-field',
    'asset::extra-fields',
    'asset-scan::update-baseline',
    'asset-scan::check-asset-scan-task',
    'cascade::sync::manage',
    'cascade::sync::device',
    'cascade::client-name',
    'an-gang'
  ]
>;

type Features = Feature[];

interface PageAssetListContext {
  // 需页面隐藏的特性
  hiddenFeatures?: Features;
  // 需完全关闭的特性
  closeFeatures?: Features;
}

function provideAssetListContext(context: Partial<PageAssetListContext>) {
  return provideContext(
    'asset::list',
    context || {
      hiddenFeatures: [],
      closeFeatures: [],
    }
  );
}

function injectAssetListContext(): Partial<PageAssetListContext> {
  return injectContext('asset::list', {
    hiddenFeatures: [],
    closeFeatures: [],
  });
}

/**
 * 根据当前特性是否在需要隐藏的特性列表里，判断是否应该显示
 * @description 必须在顶层setup调用
 * @param feature 当前特性
 * @param hiddenFeatures 如果是provide组件内，需要主动提供hiddenFeatures列表
 * @returns
 */
function isShowByFeature(feature: Feature, hiddenFeatures?: Features) {
  const context = injectAssetListContext();
  const features = hiddenFeatures || (context?.hiddenFeatures ?? []);
  return !features.some((item) => {
    // 判断是否存在完全相等
    const isSame = item === feature;
    // 配置的隐藏项是当前特性的上级功能点
    const isSuper =
      feature.indexOf(item) === 0 &&
      feature.slice(item.length, feature.length).startsWith('::');

    return isSame || isSuper;
  });
}

export {
  provideAssetListContext,
  injectAssetListContext,
  isShowByFeature,
  type Feature,
  type Features,
  type PageAssetListContext,
};
