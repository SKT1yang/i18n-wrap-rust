/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-04-12 13:20:22
 * @path: \glsec\apps\rsmp\src\domain\system\model\api\upgrade.ts
 */

/* 类型文件 */
import { KnowledgeContent } from "../types/knowledge";
/* 第三方模块 */
import { http } from "@guolisec/request";
/* 本地共享模块 */
/* 业务模块 */

/**
 * 升级记录
 * @returns
 */
export async function getUpgradeRecord(params: {
  page: number;
  size: number;
  sort: string;
}) {
  return await http.get({
    url: "/api/systemManager/getUpgradeRecord",
    params,
  });
}

/**
 * 查询系统升级详情
 * @returns
 */
export async function upgradeDetail() {
  return await http.get({
    url: "/api/systemManager/upgradeDetail",
  });
}

/**
 * 知识库查询
 * @returns
 */
export async function knowledgeBase(): Promise<KnowledgeContent> {
  return await http.get<KnowledgeContent>({
    url: "/api/knowledgeBase",
  });
}

/**
 * 查询知识库部署日志
 * @returns
 */
export async function knowledgeUpgradeRecord(params: {
  size: number;
  page: number;
  type: string;
  sn: string;
}): Promise<KnowledgeContent> {
  return await http.get<KnowledgeContent>({
    url: "/api/deploy/knowledgeUpgradeRecord",
    params,
  });
}
