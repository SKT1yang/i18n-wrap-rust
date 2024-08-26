/*
 * @Name: 注入系统id依赖
 * @Description: Do not edit
 * @Author: ygd
 * @Date: 2022-11-03 16:18:28
 * @LastEditTime: 2023-06-16 15:02:27
 * @LastEditors: Please set LastEditors
 */
import { provideContext, injectContext } from "@guolisec/utils";
import type { InjectionKey, Ref } from "vue";

type SystemInfoContextProps = Ref<{
  id: number;
  sysName?: string;
  description?: string;
  clientId: number | string;
  active?: boolean;
  homePageUrl?: string;
  model?: string;
}>;

const key: InjectionKey<SystemInfoContextProps> = Symbol();

export function createSystemContext(context: SystemInfoContextProps) {
  return provideContext<SystemInfoContextProps>(key, context);
}

export function useSystemContext() {
  return injectContext<SystemInfoContextProps>(key);
}
