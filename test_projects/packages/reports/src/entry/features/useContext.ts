/*
 * @name: Do not edit
 * @description: Do not edit
 */
import { provideContext, injectContext } from '@guolisec/utils';

/********************** 开关功能特性上下文 **********************/

type Feature =
  | 'day-report' // 日报
  | 'month-report' // 月报
  | 'year-report'; // 年报

type Features = Feature[];

interface PageReportContext {
  // 需页面隐藏的特性
  hiddenFeatures?: Features;
  // 需完全关闭的特性
  closeFeatures?: Features;
}

function provideReportContext(context: Partial<PageReportContext>) {
  return provideContext(
    'report::ReportList',
    context || {
      hiddenFeatures: [],
      closeFeatures: [],
    }
  );
}

function injectReportContext(): Partial<PageReportContext> {
  return injectContext('report::ReportList', {
    hiddenFeatures: [],
    closeFeatures: [],
  });
}

function hiddenFeatures(feature: Feature) {
  const context = injectReportContext();
  return !context.hiddenFeatures?.includes(feature);
}

/********************** 导出 **********************/

export {
  type PageReportContext,
  type Features,
  provideReportContext,
  injectReportContext,
  hiddenFeatures,
};
