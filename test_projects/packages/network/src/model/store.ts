/*
 * @Name: Do not edit
 * @Description: Do not edit
 * @Author: ygd
 * @Date: 2022-03-02 08:47:59
 * @LastEditTime: 2023-06-05 17:13:04
 * @LastEditors: Please set LastEditors
 */
import { useStore } from "@guolisec/storable";
import { defineStore } from "pinia";

interface PermissionState {
  token: string;
}

export const usePermissionStore = defineStore({
  id: "permission-store",
  state: (): PermissionState => ({
    token: "",
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
  },
});

// Need to be used outside the setup
export function usePermissionStoreWithOut() {
  const store = useStore();
  return usePermissionStore(store);
}
