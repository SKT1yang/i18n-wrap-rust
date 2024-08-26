// @ts-check
import { tsImport } from 'tsx/esm/api'
/** @type {typeof import('./src/index.ts')} */
const { eslint } = await tsImport('./src/index.ts', import.meta.url)

export default eslint([], { vue: true })
