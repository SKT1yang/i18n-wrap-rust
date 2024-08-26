import { http } from '@guolisec/request';

type tree = {
  assetNum: number;
  children?: tree[];
  id: string;
  ipLimit: null;
  label: string;
  level: number;
  name: string;
  parentId: string;
  remarks: string;
}[];
async function assetGroupTree() {
  return http.get<tree>({
    url: '/api/asset/assetGroupTree',
  });
}

type Mytype = {
  name?: string;
  assetIp?: string;
  trademarkCode: number;
  signP: 'null';
  assetModuleFlag: Boolean;
  page: number;
  size: number;
  sort?: string;
  register: number;
  assetSeriesCodes: number;
};

type BackType = {
  content: Device[];
  totalElements: number;
};

interface Device {
  id: number;
  name: string;
  assetIp: string;
  assetMac: string;
  runStatus: number;
  createTime: string;
  sn: string;
  assetGroupId: number;
  assetTypeName: string;
  softwareVersion: string;
  assetGroup: AssetGroup;
  resourceDTO: ResourceDTO;
  statusType: number;
  assetSeriesName: string;
  deviceInfo: DeviceInfo;
  mntStatus: null;
  offlineStamp: number;
}

interface AssetGroup {
  id: number;
  label: string;
  parentId: number;
  ipLimit: null;
  remarks: null;
  level: null;
  assetList: null;
}

interface DeviceInfo {
  sn: string;
  offlineTime: string;
}

interface ResourceDTO {
  usagePage: null[];
  resourceRate: ResourceRate;
}

interface ResourceRate {
  id: null;
  cpuRate: null;
  ramRate: null;
  romRate: null;
  status: null;
  sn: null;
  assetSeriesName: null;
}

async function queryAsset(params: Mytype) {
  return http.get<BackType>({
    url: '/api/resourceRate/queryAsset',
    params,
  });
}

/**
 * @description: 设备升级
 */
async function uploadDeployApi(params, data) {
  return http.post<BackType>({
    url: '/api/deploy/uploadDeploy',
    responseType: 'blob',
    params,
    data: data,
    headers: {
      'Content-type': 'multipart/form-data;charset=UTF-8',
      // @ts-ignore
      ignoreCancelToken: true,
    },
    timeout: 30 * 60 * 1000,
  });
}

/**
 * @description: 获取主机分组信息
 */
const getHpsGroupApi = (obj?) => {
  return http.get({ url: '/api/hps/query/get/hpsGroup', params: obj });
};

/**
 * @description: 删除主机分组
 */
const deleteHpsGroupApi = (str) => {
  return http.delete({ url: `${'/api/hps/query/delete/hpsGroup'}?ids=${str}` });
};

/**
 * @description: 删除Hps注册表
 */
const deleteHpsRegisterApi = (params) => {
  return http.delete({
    url: '/api/hps/query/delete/hpsRegister',
    params,
    timeout: 20000,
  });
};

/**
 * @description: 获取Hps注册表
 */
const getHpsRegisterApi = (obj?) => {
  return http.get({ url: '/api/hps/query/get/hpsRegister', params: obj });
};

/**
 * @description: 显示文件白名单扫描文件插入进度
 */
const getScheduleStatusApi = (params) => {
  return http.get({ url: '/api/hps/show/fileScanStatus', params });
};

/**
 * @description: 根据clientID删除主机卫士
 */
const deleteClientIDApi = (data) => {
  return http.delete({ url: '/api/hostGuardServer/delete/clientID', data });
};

/**
 * @description: 新增/修改主机分组
 */
const addHpsGroupApi = (obj) => {
  return http.post({ url: '/api/hps/query/add/hpsGroup', data: obj });
};

/**
 * @description: 获取未分组的Hps注册表
 */
const getNoGroupHpsRegisterApi = (obj?) => {
  return http.get({
    url: '/api/hps/query/get/noGroupHpsRegister',
    params: obj,
  });
};

/**
 * @description: 获取主机存活状态
 */
const getHpsAliveStatusApi = (params) => {
  return http.get({ url: '/api/hps/query/get/hpsIsAlive', params });
};

/**
 * @description: 平台批量下发白名单扫描(根据组ID传参)
 */
const sendFileWhiteScanByGroupApi = (obj?) => {
  return http.post({ url: '/api/hps/send/fileWhiteScan/byGroup', data: obj });
};

/**
 * @description: 平台批量终止白名单扫描(根据组ID传参)
 */
const stopFileWhiteScanByGroupApi = (params) => {
  return http.get({ url: '/api/hps/stop/fileWhiteScan/byGroup', params });
};

/**
 * @description: 显示文件白名单扫描状态(根据组ID传参)
 */
const showFileScanStatusByGroupApi = (params) => {
  return http.get({ url: '/api/hps/show/fileScanStatus/byGroup', params });
};

/**
 * @description: 获取分组中1.4的主机存活状态
 */
const getHpsIsAliveByGroupApi = (params) => {
  return http.get({ url: '/api/hps/query/get/hpsIsAliveByGroup', params });
};

/**
 * @description: 显示文件白名单扫描进度(根据组ID传参)
 */
const showScheduleByGroupApi = (params) => {
  return http.get({ url: '/api/hps/show/schedule/byGroup', params });
};

function downloadByData(
  data: BlobPart,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' });

  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);
}

/**
 * @description: 导出白名单
 */
const exportHpsFileWhiteApi = (obj?) => {
  return http.post({
    url: '/api/hps/query/export/hpsFileWhite',
    data: obj,
    responseType: 'blob',
  });
};

/**
 * @description: 导入白名单
 */
function importFileWhiteApi(obj?, params?) {
  return http.post({
    url: '/api/hps/query/import/fileWhite',
    data: obj,
    params: params,
  });
}

/**
 * @description: 获取更新包名称
 */
const getUpgradePackageNameApi = (obj?) => {
  return http.get({
    url: '/api/hps/query/get/upgradePackageName',
    params: obj,
  });
};

/**
 * @description: 下发更新信息-mqtt
 */
const postDeliverUpgradePackageApi = (obj) => {
  return http.post({ url: '/api/hps/query/deliverUpgradePackage', data: obj });
};

/**
 * @description: 上传升级文件
 */
const uploadUpgradeFileApi = (obj) => {
  // return defHttp.post({ url: Api.UploadUpgradeFileApi, data: obj });
  return http.uploadMultipartFile({
    url: '/api/hps/query/upload',
    timeout: 60 * 60 * 1000,
    data: obj,
  });
};

/**
 * @description: 获取客户端更新状态
 */
const getHpsUpdateStatusApi = (obj?) => {
  return http.get({ url: '/api/hps/query/get/hpsUpdateStatus', params: obj });
};

/**
 * @description: 获取更新文件记录
 */
const getUploadFileApi = (params?) => {
  return http.get({ url: '/api/hostGuardServer/get/uploadFile', params });
};

/**
 * @description: 查询所有允许升级的客户端升级状态
 */
const getHitClientApi = (params?) => {
  return http.get({ url: '/api/hostGuardServer/get/hitClient', params });
};

/**
 * @description: 下发更新包
 */
const distributeUploadFileApi = (data) => {
  return http.post({ url: '/api/hostGuardServer/distribute/uploadFile', data });
};

/**
 * @description: 查询设备的升级状态
 */
const getUpdateStatusApi = (params?) => {
  return http.get({
    url: '/api/hostGuardServer/get/client/updateStatus',
    params,
  });
};

/**
 * @description: 查询更新成功或者失败的历史记录
 */
const getUploadHistoryApi = (params?) => {
  return http.get({ url: '/api/hostGuardServer/get/uploadHistory', params });
};

/**
 * @description: 主机卫士更新包上传部署
 */
const uploadHostGuardServerApi = (data) => {
  return http.uploadMultipartFile({
    url: '/api/hostGuardServer/upload',
    timeout: 60 * 60 * 1000,
    data,
  });
};
export {
  assetGroupTree,
  queryAsset,
  uploadDeployApi,
  getHpsGroupApi,
  deleteHpsGroupApi,
  deleteHpsRegisterApi,
  getHpsRegisterApi,
  getScheduleStatusApi,
  deleteClientIDApi,
  addHpsGroupApi,
  getNoGroupHpsRegisterApi,
  getHpsAliveStatusApi,
  sendFileWhiteScanByGroupApi,
  stopFileWhiteScanByGroupApi,
  showFileScanStatusByGroupApi,
  getHpsIsAliveByGroupApi,
  showScheduleByGroupApi,
  downloadByData,
  exportHpsFileWhiteApi,
  importFileWhiteApi,
  getUpgradePackageNameApi,
  postDeliverUpgradePackageApi,
  uploadUpgradeFileApi,
  getHpsUpdateStatusApi,
  getUploadFileApi,
  getHitClientApi,
  distributeUploadFileApi,
  getUpdateStatusApi,
  getUploadHistoryApi,
  uploadHostGuardServerApi,
};
