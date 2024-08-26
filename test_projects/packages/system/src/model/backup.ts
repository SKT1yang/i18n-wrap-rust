/*
 * @name: 数据备份接口
 * @description: Do not edit
 * @date: 2023-06-26 14:20:26
 * @path: \system\src\model\backup.ts
 */
import { http } from '@guolisec/request';

/**
 * @description: 查询分表数据快照记录
 */
function getSnapshotApi(params) {
  return http.get({ url: `/api/snapshots`, params });
}

/**
 * @description: 创建数据快照
 */
function createSnapshotApi() {
  return http.post({ url: `/api/snapshots` });
}

/**
 * @description: 数据快照恢复数据
 */
function restoreSnapshotApi(str: string) {
  return http.post({ url: `/api/snapshots/${str}/restore` });
}

/**
 * @description: 删除数据快照
 */
function deleteSnapshotApi(str: string) {
  return http.delete({ url: `/api/snapshots/${str}` });
}

/**
 * @description: 查询数据备份
 */
function getBackupRecordApi(params) {
  return http.get({ url: `/api/fileRecord/outputRecord`, params });
}

/**
 * @description: 删除备份文件
 */
function deleteBackupRecordFileApi(data) {
  return http.post({ url: `/api/fileRecord/deleteRecord`, data });
}

/**
 * @description: 生成数据备份
 */
function createBackupRecordApi(params) {
  return http.get({ url: `/api/snapshots/output`, params });
}

/**
 * @description: 下载备份文件
 */
function downloadBackupFileApi(params) {
  return http.get({
    url: `/api/fileRecord/download`,
    responseType: 'blob',
    headers: { 'Content-Type': 'application/json; application/octet-stream' },
    params,
    timeout: 60 * 1000,
  });
}

/**
 * @description: 导入备份文件
 */
function importBackupFileApi(data) {
  return http.uploadMultipartFile({
    url: `/api/snapshots/inputIndex`,
    data,
    timeout: 10 * 60 * 1000,
  });
}

/**
 * @description: 获取ftp参数
 */
function getFtpSettingListApi() {
  return http.get({ url: `/api/ftp/getFtpSettingList` });
}

/**
 * @description: 设置ftp参数
 */
function setFtpApi(data) {
  return http.post({ url: `/api/ftp/setFtp`, data });
}

export {
  getSnapshotApi,
  createSnapshotApi,
  restoreSnapshotApi,
  deleteSnapshotApi,
  getBackupRecordApi,
  deleteBackupRecordFileApi,
  downloadBackupFileApi,
  importBackupFileApi,
  createBackupRecordApi,
  getFtpSettingListApi,
  setFtpApi,
};
