/* 第三方模块 */
import { http } from '@guolisec/request';

/**
 * @description: 日志查询
 */
function getSystemLogsApi(params) {
  return http.get({ url: `/api/logs`, params });
}

/**
 * @description: 错误日志
 */
function getSystemLogsErrorApi(params) {
  return http.get({ url: `/api/logs/error`, params });
}

export { getSystemLogsApi, getSystemLogsErrorApi };
