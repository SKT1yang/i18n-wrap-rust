/*
 * @name: 用户管理
 * @description: Do not edit
 * @date: 2023-02-16 17:54:01
 * @path: \vue-package-quickstart\src\controller\useUser.ts
 */
/* 类型文件 */
import type { FormInstance } from "ant-design-vue";
/* 第三方模块 */
import { ref } from "vue";
import { http } from "@guolisec/request";
import { message } from "@guolisec/toast";
/* 共享模块 */

/* 业务模块 */

export function useUser() {
  const dataList = ref([]);
  message.warning("我是消息！");
  return {
    dataList,
  };
}
