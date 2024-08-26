import { tsImport } from 'tsx/esm/api'
/** @type {typeof import('./src/index.ts')} */
const { stylelint } = await tsImport('./src/index.ts', import.meta.url)

export default stylelint()
