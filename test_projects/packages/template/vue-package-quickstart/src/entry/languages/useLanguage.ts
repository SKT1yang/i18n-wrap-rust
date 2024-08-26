/*
 * @name: 国际化hook
 * @description: Do not edit
 */
import { ref, unref } from 'vue'
import { i18nScope, t as scopedTtranslate } from './'

const DEFAULT_LANGUAGE = 'zh'
const language = ref(i18nScope.global.activeLanguage || DEFAULT_LANGUAGE)

i18nScope.on('change', (newLanguage = DEFAULT_LANGUAGE) => {
  language.value = newLanguage
})

function t(message: string, ...args: any[]) {
  language.value
  return scopedTtranslate(unref(message), ...args)
}

export { t }
