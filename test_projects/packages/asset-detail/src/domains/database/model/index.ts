import { http } from "@guolisec/request";
import type {
  DatabaseInfo,
  LinkDatabaseInfo,
  SlowDatabaseInfo,
  DatabaseBasicInfo,
} from "../types";
import type { DataListResult } from "@guolisec/types";
/**
 * 获取数据库表信息
 */
function getAssetDbInfo(params: {
  deviceIp: string;
  deviceMac: string;
  page: number;
  size: number;
  sort: string;
  tableSpaceTypes?: string[];
}) {
  return http.get<DataListResult<DatabaseInfo>>({
    url: `/api/assetDetail/getAssetDbInfo`,
    params,
  });
}

/**
 * 获取数据库表信息聚合查询条件
 */
function getAssetDbAggregation(params: {
  deviceIp: string;
  deviceMac: string;
}) {
  return http.get<{
    tableSpaceType: string[];
  }>({
    url: `/api/assetDetail/getAssetDbAggregation`,
    params,
  });
}

/**
 * 获取数据库连接信息
 */
function getAssetDbLinkInfo(params: {
  deviceIp: string;
  deviceMac: string;
  page: number;
  size: number;
  sort: string;
  programs?: string[];
  statuses?: string[];
  users?: string[];
}) {
  return http.get<DataListResult<LinkDatabaseInfo>>({
    url: `/api/assetDetail/getAssetDbLinkInfo`,
    params,
  });
}

/**
 * 获取数据库连接信息聚合查询条件
 */
function getAssetDbLinkAggregation(params: {
  deviceIp: string;
  deviceMac: string;
}) {
  return http.get<{
    status: string[];
    user: string[];
    program: string[];
  }>({
    url: `/api/assetDetail/getAssetDbLinkAggregation`,
    params,
  });
}

/**
 * 获取数据库慢SQL信息
 */
function getAssetDbSlowInfo(params: {
  deviceIp: string;
  deviceMac: string;
  page: number;
  size: number;
  sort: string;
}) {
  return http.get<DataListResult<SlowDatabaseInfo>>({
    url: `/api/assetDetail/getAssetDbSlowInfo`,
    params,
  });
}

/**
 * 获取已安装的探针列表，获取数据库基本信息
 */
async function getInstallList(params: { ip: string; mac: string }) {
  return await http.get<DataListResult<{ dbInfo: DatabaseBasicInfo }>>({
    url: "/api/probe/getInstallList",
    params,
  });
}

export {
  getAssetDbInfo,
  getAssetDbAggregation,
  getAssetDbLinkInfo,
  getAssetDbLinkAggregation,
  getAssetDbSlowInfo,
  getInstallList,
}