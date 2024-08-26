/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-24 08:26:36
 * @path: \routerable\build.config.ts
 */
/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-12 13:11:24
 * @path: \emitter\build.config.ts
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
