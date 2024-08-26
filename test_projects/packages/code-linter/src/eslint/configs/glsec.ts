import type { Linter } from 'eslint'

export function glsec(): Linter.Config[] {
  return [
    {
      name: 'glsec',
      languageOptions: {
        globals: {
          defineOptions: 'readonly',
          VoerkaI18n: 'readonly',
          t: 'writable',
          OEM_SETTINGS: 'writable',
          __APP_GLOBAL_ROUTER_INSTANCE__: 'writable',
          __APP_GLOBAL_SCHEDULER_INSTANCE__: 'writable',
          __APP_GLOBAL_STORE_INSTANCE__: 'writable',
          __APP_GLOBAL_THEME_CENTER__: 'writable'
        }
      }
    }
  ]
}

