import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  entries: ['src/index', 'src/stylelint/default'],
  declaration: true,
  rollup: {
    emitCJS: true
  }
})
