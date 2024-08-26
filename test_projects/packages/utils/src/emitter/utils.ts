/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-09 18:55:28
 * @path: \emitter\src\utils.ts
 */
import { type Data, type UnionData } from "@guolisec/schedule";

function isUnitData<T>(data: Data<T>): data is UnionData<T> {
  return data && typeof data === "object" && "directData" in data;
}

export { isUnitData };
