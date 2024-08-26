/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-16 22:29:16
 * @path: \utils\build.config.ts
 */
import { defineBuildConfig } from 'unbuild';
export default defineBuildConfig({
  clean: true,
  entries: ['src/index', 'src/browser', 'src/echarts/echarts'],
  declaration: true,
  externals: ['@guolisec/types'],
  rollup: {
    emitCJS: true,
    output: {
      externalImportAssertions: false,
    },
  },
});
