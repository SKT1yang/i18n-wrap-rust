/*
 * @name: 接口
 * @description: 知识库升级
 * @date: 2023-09-19 14:31:07
 * @path: \knowledge-upgrade\\model\upgrade.ts
 */

/* 类型文件 */
import type { DataListResult } from "@guolisec/types";
import type {
  KnowledgeBase,
  KnowledgeRecord,
  KnowledgeType,
} from "../types/upgrade";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */

/* 业务模块 */

/**
 * 知识库查询
 */
async function getKnowledgeBase() {
  return http.get<DataListResult<KnowledgeBase>>({
    url: "/api/knowledgeBase",
  });
}

/**
 * 查询知识库部署日志
 */
async function getKnowledgeUpgradeRecord(params: {
  page: number;
  size: number;
  sort: string;
  type: KnowledgeType;
  sn: string;
}) {
  return http.get<DataListResult<KnowledgeRecord>>({
    url: "/api/deploy/knowledgeUpgradeRecord",
    params,
  });
}

/**
 * 知识库上传,只保留最后一版本知识库
 */
function importKnowledgeBaseApi(data) {
  return http.uploadMultipartFile({
    url: `/api/knowledgeBase`,
    data,
    timeout: 5 * 60 * 1000,
  });
}

/**
 * 知识库上传,只保留最后一版本知识库
 */
function importKnowledgeBaseNoLicenseApi(data) {
  return http.uploadMultipartFile({
    url: `/api/knowledgeBase/noLicense`,
    data,
    timeout: 5 * 60 * 1000,
  });
}

export {
  getKnowledgeBase,
  getKnowledgeUpgradeRecord,
  importKnowledgeBaseApi,
  importKnowledgeBaseNoLicenseApi,
};
