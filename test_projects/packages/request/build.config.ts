/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-16 22:29:16
 * @path: \request\build.config.ts
 */
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  clean: true,
  entries: ["src/index"],
  declaration: true,
  externals: ["@guolisec/types"],
  rollup: {
    emitCJS: true,
  },
});
