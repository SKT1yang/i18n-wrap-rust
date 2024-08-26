/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-02-16 15:13:01
 * @path: \vue-package-quickstart\lib\service\user.ts
 */
/* 类型文件 */
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

export async function modifyMaxFailedNum(data: { num: number }) {
  return http.post<string>({
    url: "/api/user/modifyMaxFailedNum",
    data,
  });
}
