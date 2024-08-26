/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-24 08:26:36
 * @path: \routerable\build.config.ts
 */
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  clean: true,
  entries: ["src/index"],
  declaration: true,
  externals: ['@vue/reactivity'],
  rollup: {
    emitCJS: true,
  },
});
