/*
 * @name: 用户管理
 * @description: Do not edit
 */

/* 类型文件 */
/* 第三方模块 */
import { ref } from 'vue';
import { message } from '@guolisec/toast';
/* 共享模块 */

/* 业务模块 */

export function useUser() {
  const dataList = ref([]);
  message.warning('我是消息！');
  return {
    dataList,
  };
}
