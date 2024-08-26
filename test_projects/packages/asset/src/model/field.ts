/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \asset\src\model\field.ts
 */
import { http } from '@guolisec/request';

/**
 * 获取资产域列表
 * @param params
 */
function getAssetFieldListApi(params) {
  return http.get({ url: `/api/assetField/assetFieldList`, params });
}

type FieldType = {
  page: number;
  size: number;
  name?: string;
};

export type FieldBackType = {
  id: string;
  name: string;
  sn: null;
  assetList: Asset[];
  assetSnVOList: null;
  createTime: null;
  updateTime: null;
};

export interface Asset {
  id: number;
  name: string;
  assetIp: string;
  assetMac: string;
  trademarkName: string;
  trademarkCode: number;
  assetTypeCode: number;
  assetTypeName: string;
  assetSeriesCode: number;
  assetSeriesName: string;
  type: number;
  flag: number;
  fieldId: string;
  assetGroupId: number;
  assetLocation: string;
  runStatus: number;
  sn: null;
  register: number | null;
  networkId: number;
  safeFieldId: null | string;
  uid: string;
  pid: null;
  productionDate: null | string;
  os: string;
  security: string;
  trust: null;
  importance: number;
  scan: null;
  newFlag: null;
  sourceSn: null;
  sourceSeries: null;
  createTime: string;
  updateTime: string;
  hardwareModel: null;
  statusType: null;
  malfunction: number;
}

async function assetFieldListAPI(params: FieldType) {
  return http.get<FieldBackType[]>({
    url: '/api/assetField/assetFieldList',
    params,
  });
}

type FieldType2 = {
  pointSnList: [];
  sn?: '123456';
  name: string;
  id?: string;
  updateTime?: string;
};

async function saveAPI(data: FieldType2) {
  return http.post({
    url: '/api/assetField/save',
    data,
  });
}
async function deleteAPI(params) {
  return http.delete({
    url: '/api/assetField',
    params,
  });
}
type fieldType3 = {
  fieldId: string;
  page: number;
  size: number;
};

export interface FieldBackType2 {
  content: Content[];
  pageable: Pageable;
  totalElements: number;
  last: boolean;
  totalPages: number;
  first: boolean;
  sort: Sort;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}

export interface Content {
  id: number;
  sn: string;
  assetName: string;
  interfaceName: null;
  fieldId: string;
  assetField: AssetField;
}

export interface AssetField {
  id: string;
  name: string;
  sn: string;
  createType: null;
  createTime: null;
  updateTime: string;
}

export interface Pageable {
  sort: Sort;
  pageSize: number;
  pageNumber: number;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

async function pointFieldRelationListPageAPI(params: fieldType3) {
  return http.get<FieldBackType2>({
    url: '/api/pointFieldRelation/pointFieldRelationListPage',
    params,
  });
}
async function deleteAllAPI(params: { ids: number }) {
  return http.delete({
    url: '/api/pointFieldRelation/deleteAll',
    params,
  });
}

export type FieldBackType3 = {
  id: number;
  name: string;
  assetIp: string;
  assetMac: string;
  trademarkName: string;
  trademarkCode: number;
  assetTypeCode: number;
  assetTypeName: string;
  assetSeriesCode: number;
  assetSeriesName: string;
  type: number;
  flag: number;
  fieldId: null;
  assetField: null;
  assetGroupId: number;
  assetGroup: AssetGroup;
  assetLocation: null;
  runStatus: number;
  sn: string;
  register: number;
  networkId: number;
  safeFieldId: null;
  safeField: null;
  uid: string;
  pid: null;
  productionDate: null;
  os: null;
  security: null;
  trust: null;
  importance: number;
  scan: null;
  newFlag: null;
  sourceSn: string;
  sourceSeries: string;
  createTime: string;
  updateTime: string;
  hardwareModel: string;
  mntStatus: null;
  idsRuleMntStatus: null;
  port: null;
  softwareVersion: string;
  sshPort: null;
  sshUsername: null;
  statusType: null;
  malfunction: null;
  deviceInfo: DeviceInfo;
  assetSeriesNameLong: null;
  deviceIp: null;
  deviceMac: null;
  deviceModel: null;
  networkAssetList: null;
  mergeFlag: null;
  cpuRate: null;
  memoryRate: null;
  memRate: null;
  availableSshPwd: boolean;
}[];

export interface AssetGroup {
  id: number;
  label: string;
  parentId: number;
  ipLimit: null;
  remarks: null;
  level: number;
  assetList: null;
}

export interface DeviceInfo {
  sn: string;
  offlineTime: string;
  offlineStamp: number;
}

async function getPointAPI() {
  return http.get<FieldBackType3>({
    url: '/api/pointFieldRelation/getPoint',
  });
}

async function createPointFieldRelationListAPI(
  data: { sn: string; fieldId: string }[]
) {
  return http.post({
    url: '/api/pointFieldRelation/createPointFieldRelationList',
    data,
  });
}

type fieldType4 = {
  fieldIdNull: 'null';
  assetGroupId?: number;
  page: number;
  size: number;
  assetFieldId: string;
  name: string;
  errorLogLeftLike: any;
  assetIp: string;
};

async function getCanChooseAssetByFieldIdAPI(params: fieldType4) {
  return http.get({
    url: '/api/asset/getCanChooseAssetByFieldId',
    params,
    timeout: 5 * 60 * 1000,
  });
}

async function updateAssetColumnBatchAPI(data: any[]) {
  return http.post({
    url: '/api/asset/updateAssetColumnBatch',
    data,
  });
}
type fieldType5 = {
  fieldId: string;
  name: string;
  assetIp: string;
};

async function allAPI(params: fieldType5) {
  return http.get({
    url: '/api/asset/all',
    params,
  });
}

export {
  assetFieldListAPI,
  saveAPI,
  deleteAPI,
  pointFieldRelationListPageAPI,
  deleteAllAPI,
  getPointAPI,
  createPointFieldRelationListAPI,
  getCanChooseAssetByFieldIdAPI,
  updateAssetColumnBatchAPI,
  allAPI,
};

export { getAssetFieldListApi };
