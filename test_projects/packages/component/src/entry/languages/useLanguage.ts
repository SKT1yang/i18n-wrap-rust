/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \vue-monorepo-admin\apps\admin\src\entry\languages\useLanguage.ts
 */
import { computed, ref } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enGB from 'ant-design-vue/es/locale/en_GB'
import { i18nScope } from './'

function useLanguage() {
  const DEFAULT_LANGUAGE = 'zh'
  const language = ref(localStorage.getItem('language') || DEFAULT_LANGUAGE)

  i18nScope.on('change', (newLanguage = DEFAULT_LANGUAGE) => {
    language.value = newLanguage
  })

  async function handleSwitchTranlate() {
    const current = language.value === 'zh' ? 'en' : 'zh'
    await i18nScope.change(current)
  }

  const locale = computed(() => {
    switch (language.value) {
      case 'zh':
        return zhCN
      case 'en':
        return enGB
      default:
        return zhCN
    }
  })

  return {
    language,
    locale,
    handleSwitchTranlate,
  }
}

export { useLanguage }

