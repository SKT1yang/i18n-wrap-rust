/*
 * @name: 国际化hook
 * @description: Do not edit
 */
import { ref, unref, computed } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import enGB from 'ant-design-vue/es/locale/en_GB';
import { i18nScope, t as scopedTtranslate } from './';

const defaultLanguage = i18nScope.defaultLanguage;
const language = ref(i18nScope.global.activeLanguage || defaultLanguage);

// 切换语言核心
i18nScope.on('change', (newLanguage = defaultLanguage) => {
  language.value = newLanguage;
});

function t(message: string, ...args: any[]) {
  language.value;
  return scopedTtranslate(unref(message), ...args);
}

async function handleSwitchTranlate() {
  const current = language.value === 'zh' ? 'en' : 'zh';
  await i18nScope.change(current);
}

const locale = computed(() => {
  switch (language.value) {
    case 'zh':
      return zhCN;
    case 'en':
      return enGB;
    default:
      return zhCN;
  }
});

export { t, language, locale, handleSwitchTranlate };
