/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-22 15:58:40
 * @path: \emitter\src\index.ts
 */
import { type Good, type Data, type UnionData } from "@guolisec/schedule";
import { mitt, type Emitter } from "./mittSync";
import { mittAsync, type AsyncMitter } from "./mittAsync";

export {
    type Emitter,
    type AsyncMitter,
    type Good,
    type Data, 
    type UnionData,
    mitt,
    mittAsync
}
