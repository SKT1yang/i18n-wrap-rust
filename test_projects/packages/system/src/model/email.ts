/*
 * @name: 邮件告警
 * @description: Do not edit
 * @path: \system\src\model\email.ts
 */

/* 类型文件 */

/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * @description: 查询邮件设置
 */
function getEmailAlarmInfoApi() {
  return http.get({ url: `/api/mails` });
}

/**
 * @description: 修改邮件设置
 */
function modifyEmailAlarmInfoApi(data) {
  return http.put({ url: `/api/mails/${data.id}`, data });
}

export { getEmailAlarmInfoApi, modifyEmailAlarmInfoApi };
