import { hasVue } from './env'
import { ignores, javascript, typescript, vue, glsec } from './configs'
import type { Linter } from 'eslint'

/** Ignore common files and include javascript support */
const presetJavaScript = [...ignores(), ...javascript()]
/** Includes `presetJavaScript` and typescript support */
const presetBasic = [...presetJavaScript, ...typescript]
/**
 * Includes
 * - `presetBasic` (JS+TS) support
 * - `presetLangsExtensions` (markdown, yaml, jsonc) support
 * - Vue support
 * - UnoCSS support (`uno.config.ts` is required)
 * - Prettier support
 */
const presetAll = [...presetBasic, ...vue]

/**
 *
 * @param config
 * @param features
 * @returns
 */
function eslint(
  config: Linter.FlatConfig | Linter.FlatConfig[] = [],
  {
    vue: enableVue = hasVue,
    glsec: enableGlsec = true
  }: Partial<{
    /** Vue support. Auto-enable. */
    vue: boolean
    glsec: boolean
  }> = {}
): Linter.FlatConfig[] {
  const configs = [...presetBasic]
  if (enableVue) {
    configs.push(...vue)
  }
  if (enableGlsec) {
    configs.push(...glsec())
  }
  if (Object.keys(config).length > 0) {
    configs.push(...(Array.isArray(config) ? config : [config]))
  }

  return configs
}

export { eslint, presetBasic as basic, presetAll as all }

