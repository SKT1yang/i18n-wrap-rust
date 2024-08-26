/*
 * @name: 获取聚合后的系统id
 * @description: Do not edit
 * @date: 2023-03-16 13:45:16
 * @path: \permission\src\controller\useSystem\useSystemId.ts
 */

import { ref } from "vue";
import { useSystemContext } from "./useSystemContext";
import { usePermissionStoreWithOut } from "../../model/store";
import { useRoute } from "vue-router";

export function useSystemId(props?: { systemId: number }) {
  const values = useSystemContext();
  const route = useRoute();
  return ref(
    props?.systemId ||
      values?.value?.id ||
      Number(route?.query?.systemId) ||
      usePermissionStoreWithOut()?.getSystemInfo?.id
  );
}
