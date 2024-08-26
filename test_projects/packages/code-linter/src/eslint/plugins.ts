/* eslint-disable import/first */
// @ts-nocheck

export type InteropDefault<T> = T extends { default: infer U } ? U : T

/* #__NO_SIDE_EFFECTS__ */
function interopDefault<T>(m: T): InteropDefault<T> {
  return (m as any).default || m
}

import * as _pluginAntfu from 'eslint-plugin-antfu'
export const pluginAntfu: typeof import('eslint-plugin-antfu').default =
  interopDefault(_pluginAntfu)

import tseslint from 'typescript-eslint'
export { tseslint }

import * as _pluginVue from 'eslint-plugin-vue'
export const pluginVue: any = interopDefault(_pluginVue)

import * as _pluginUnusedImports from 'eslint-plugin-unused-imports'
export const pluginUnusedImports: any = interopDefault(_pluginUnusedImports)

export * as parserVue from 'vue-eslint-parser'

