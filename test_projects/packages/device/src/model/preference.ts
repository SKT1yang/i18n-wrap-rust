import { http } from "@guolisec/request";

/**
 * @description: 查询清除日志设置
 */
const getEsCleanApi = () => {
  return http.get({ url: '/api/es/clean' });
};
/**
 * @description: 设置资源阈值
 */
const saveResourceRateApi = (data) => {
  return http.post({ url: '/api/resourceRate/save', data });
};

export {
  getEsCleanApi,
  saveResourceRateApi
}