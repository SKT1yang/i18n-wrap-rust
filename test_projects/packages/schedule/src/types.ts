/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-12 11:54:41
 * @path: \schedule\src\types.ts
 */
/**
 * 发布者消息
 * @description 逻辑池单元
 */
type Good = {
  topic: string; // 消息名
  count: number;
  status: GoodStatus;
} & UserGood;

interface UserGood {
  data?: any; // 发布者预置数据
  handler?: (notify?: Notify) => any; // 发布者预置逻辑函数
  once?: boolean; //是否是一次性消息
  executeGuard?: (data?: any) => boolean;
}

/**
 * 发布者消息
 * @description 逻辑触发参数
 */
interface Notify {
  topic: string; // 消息名
  data?: any;
  params?: any[];
  handler?: (params?: any) => any;
  executeGuard?: (data?: any) => boolean;
  executeGuardPolicy?: "subscriber" | "union"; // 默认 subscriber
}

interface UnionData<T> {
  directData: T;
  hanlderData: T;
}

type Data<T> = T | UnionData<T>;

/**
 * 消息状态
 */
enum GoodStatus {
  pedding,
  running,
}

interface Config {
  delayTrigger: boolean;
  console: boolean;
}

export {
  type Good,
  type Notify,
  GoodStatus,
  type UserGood,
  type Data,
  type UnionData,
  type Config,
};
