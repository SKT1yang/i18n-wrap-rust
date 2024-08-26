import { GLOB_JSX, GLOB_TSX } from '../globs'
import type { Linter } from 'eslint'

export function jsx(): Linter.Config[] {
  return [
    {
      name: 'jsx',
      files: [GLOB_JSX, GLOB_TSX],
      languageOptions: {
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          }
        }
      }
    }
  ]
}

