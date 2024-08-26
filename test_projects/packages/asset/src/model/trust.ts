/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \asset-new\src\model\AssetsTrust.ts
 */
import { http } from '@guolisec/request';

async function getAssetOsListAPI() {
  return http.get<any[]>({
    url: '/api/asset/showAssetType',
  });
}
type AssetType = {
  page: number;
  size: number;
  name?: string;
  assetIp?: string;
  assetTypeCodes?: number;
  runStatus?: number;
  ignoreStatus: number;
  treat: boolean;
  sort?: string;
};

export interface TrustAssetBack {
  content: any[];
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

async function trustingAssetPageAPI(params: AssetType) {
  return http.get<TrustAssetBack>({
    url: '/api/trustingAsset/trustingAssetPage',
    params,
  });
}
async function trustAssetAPI(data: any[]) {
  return http.post<null>({
    url: '/api/trustingAsset/trustAsset',
    data,
  });
}
async function saveAPI(data: any[]) {
  return http.post<null>({
    url: '/api/trustingAsset/save',
    data,
  });
}

export { getAssetOsListAPI, trustingAssetPageAPI, trustAssetAPI, saveAPI };
