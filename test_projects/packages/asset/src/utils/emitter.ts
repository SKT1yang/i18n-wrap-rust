/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \feature-vue\platform\front\asset\src\utils\emitter.ts
 */
import { useEmitter } from "@guolisec/utils";

const EMITTER_TOPICS = {
  refreshGroupTree: "asset::list::refresh::group-tree",
};

const EMITTER_SELECT_GROUP_TREE = {
  refreshGroupTree: "asset::list::refresh::select-group-tree",
};

const emitter = useEmitter();

export { emitter, EMITTER_TOPICS, EMITTER_SELECT_GROUP_TREE };
