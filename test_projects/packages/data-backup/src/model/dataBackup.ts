/*
 * @name: api接口
 * @description: 数据备份
 */

/* 类型文件 */
import type { DataListResult } from '@guolisec/types'
import type { QueryDataBackup, DataBackup } from '../types/dataBackup'
/* 第三方模块 */
import { http } from '@guolisec/request'
/* 本地共享模块 */

/* 业务模块 */

/**
 * 获取生成数据包数据
 * @param data 查询条件
 * @returns
 */
async function getOutputRecord(params: QueryDataBackup) {
  return http.get<DataListResult<DataBackup>>({
    url: '/api/fileRecord/outputRecord',
    params
  })
}

export { getOutputRecord }
