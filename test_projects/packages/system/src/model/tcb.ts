/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-06-27 16:19:52
 * @path: \system\src\model\tcb.ts
 */
import { http } from "@guolisec/request";
/**
 * @description: 获取IP访问规则
 */
function getIpRuleApi() {
  return http.get({ url: `/api/system/iptables/getIpRule` });
}

/**
 * @description: iptables获取使能状态
 */
function getEnableOrNotApi() {
  return http.get({ url: `/api/system/iptables/getEnableOrNot` });
}
/**
 * @description: iptables使能开启
 */

function enableIptablesApi() {
  return http.get({ url: `/api/system/iptables/enableIptables` });
}

/**
 * @description: iptables使能关闭
 */
function disableIptablesApi() {
  return http.get({ url: `/api/system/iptables/disableIptables` });
}

/**
 * @description: 删除指定网口ip限制规则
 */
function deleteIpRuleApi(params) {
  return http.get({ url: `/api/system/iptables/deleteIpRule`, params });
}

/**
 * @description: 追加指定网口ip访问规则
 */
function addIpRuleApi(params) {
  return http.get({ url: `/api/system/iptables/addIpRule`, params });
}

/**
 * @description: 追加指定网口Mac访问规则
 */
function addMacApi(params) {
  return http.get({ url: `/api/system/iptables/addMac`, params });
}

/**
 * @description: 全局初始化（删除）所有可信主机设置(规则)
 */
function clearAllRuleApi() {
  return http.get({ url: `/api/system/iptables/clearAllRule` });
}

/**
 * @description: 查询当前ssh开关状态
 */
function getSSHApi() {
  return http.get({ url: `/api/ssh` });
}
/**
 * @description: 切换ssh开关
 */
function updateSSHApi(data, params) {
  return http.put({ url: `/api/ssh`, data, params });
}

/**
 * @description: 获取mac列表
 */
function getMacListApi() {
  return http.get({ url: `/api/system/iptables/getMacList` });
}

/**
 * @description: 获取mac规则使能与否，true为使能，false为使能关闭
 */
function getMacEnableStatusApi() {
  return http.get({ url: `/api/system/iptables/getMacEnableStatus` });
}

/**
 * @description: mac规则使能，true为使能，false为使能关闭
 */
function enableMacRuleApi(params) {
  return http.get({ url: `/api/system/iptables/getMacEnableStatus`, params });
}

/**
 * @description: 删除mac规则
 */
function deleteMacApi(params) {
  return http.delete({ url: `/api/system/iptables/deleteMac`, params });
}

/**
 * @description: 追加指定网口的端口禁止规则
 */
function ethPortAddApi(params) {
  return http.get({ url: `/api/system/iptables/ethPortAdd`, params });
}

/**
 * @description: 删除指定网口的端口禁止规则
 */
function ethPortDeleteApi(params) {
  return http.get({ url: `/api/system/iptables/ethPortDelete`, params });
}

/**
 * @description: 获取指定网口的端口禁止规则
 */
function ethPortRuleGetApi() {
  return http.get({ url: `/api/system/iptables/ethPortRuleGet` });
}

export {
  getIpRuleApi,
  getEnableOrNotApi,
  deleteIpRuleApi,
  addIpRuleApi,
  addMacApi,
  enableIptablesApi,
  disableIptablesApi,
  clearAllRuleApi,
  getSSHApi,
  updateSSHApi,
  getMacListApi,
  getMacEnableStatusApi,
  enableMacRuleApi,
  deleteMacApi,
  ethPortAddApi,
  ethPortDeleteApi,
  ethPortRuleGetApi,
};
