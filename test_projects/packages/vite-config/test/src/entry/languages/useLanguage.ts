/*
 * @name: 国际化hook
 * @description: Do not edit
 */
import { computed, ref } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import enGB from 'ant-design-vue/es/locale/en_GB';
import { i18nScope, t as scopedTtranslate } from '.';

const DEFAULT_LANGUAGE = 'zh';
const language = ref(i18nScope.global.activeLanguage || DEFAULT_LANGUAGE);
changeDocumentElementLang(language.value);

i18nScope.on('change', (newLanguage = DEFAULT_LANGUAGE) => {
  changeDocumentElementLang(newLanguage);
  language.value = newLanguage;
});

async function handleSwitchTranlate() {
  const current = language.value === 'zh' ? 'en' : 'zh';
  await i18nScope.change(current);
}

function changeDocumentElementLang(lang: string) {
  document.documentElement.lang = lang;
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

function t(message: string, ...args: any[]) {
  language.value;
  return scopedTtranslate(message, ...args);
}

export { language, locale, handleSwitchTranlate, t };
