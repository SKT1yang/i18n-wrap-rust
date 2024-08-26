import type { Linter } from 'eslint'
import { GLOB_EXCLUDE } from '../globs'

export function ignores(): Linter.Config[] {
  return [
    {
      name: 'ignore',
      ignores: GLOB_EXCLUDE
    }
  ]
}

