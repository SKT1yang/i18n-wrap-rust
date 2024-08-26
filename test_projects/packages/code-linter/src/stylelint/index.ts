import type { Config } from 'stylelint'

function stylelint() {
  const config: Config = {
    extends: ['stylelint-config-standard', 'stylelint-config-property-sort-order-smacss'],
    plugins: ['stylelint-order'],
    // customSyntax: 'postcss-html',
    overrides: [
      {
        files: ['**/*.(css|html|vue)'],
        customSyntax: 'postcss-html'
      }
    ],
    rules: {
      'string-quotes': 'double',
      'declaration-block-no-duplicate-properties': true
    },
    ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts']
  }
  return config
}

const defaultConfig = stylelint()

export { defaultConfig as default, stylelint }

