/*
 * @name: Do not edit
 * @description: Do not edit
 */
import type { GenerateFeature } from '@guolisec/types';
import { provideContext, injectContext } from '@guolisec/utils';

/********************** 开关功能特性上下文 **********************/

type Feature = GenerateFeature<
  [
    'asset-field', // 资产域
    'safe-field', // 资产安全域
    'event', // 资产事件
    'relation', // 资产关系
    'session::flow', // 资产流量
    'vul', // 资产漏洞
    'asset::info::extra-props', // 额外字段
    'scan', // 资产扫描
    'scan::update-configuration', // 资产扫描-更新基线
    'scan::debug-scan', // 资产扫描-调试模式扫描
    'visualize::plc', // PLC可视化
    'visualize::plc::modify', // PLC可视化-修改模块
    'visualize::switch', // 交换机可视化
    'event::configuration-change' // 组态变更事件
  ]
>;

type Features = Feature[];

interface PageAssetDetailContext {
  // 需页面隐藏的特性
  hiddenFeatures?: Features;
  // 需完全关闭的特性
  closeFeatures?: Features;
}

function provideAssetDetailContext(context: Partial<PageAssetDetailContext>) {
  return provideContext(
    'asset-detail::AssetDetail',
    context || {
      hiddenFeatures: [],
      closeFeatures: [],
    }
  );
}

function injectAssetDetailContext(): Partial<PageAssetDetailContext> {
  return injectContext('asset-detail::AssetDetail', {
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
  const context = injectAssetDetailContext();
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

/********************** 导出 **********************/

export {
  type PageAssetDetailContext,
  type Features,
  provideAssetDetailContext,
  injectAssetDetailContext,
  isShowByFeature,
};
