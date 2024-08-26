/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-12 13:11:24
 * @path: \configable\build.config.ts
 */
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  clean: true,
  entries: ["src/index"],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
});
