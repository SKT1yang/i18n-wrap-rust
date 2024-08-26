/*
 * @name: Do not edit
 * @description: Do not edit
 */

import { TableColumnsType } from 'ant-design-vue'
import { formatToDateTime } from '@guolisec/utils'

export const columns: TableColumnsType = [
  { title: '序号', dataIndex: 'index', width: '5%', align: 'center' },
  {
    title: '时间',
    dataIndex: 'time',
    sorter: true,
    defaultSortOrder: 'descend',
    width: '10%',
    align: 'center'
  },
  { title: '事件名称', dataIndex: 'eventName', width: '10%', align: 'center' },
  { title: '威胁等级', dataIndex: 'threatLeval', width: '8%', align: 'center' },
  { title: '事件详情', dataIndex: 'eventDetail', width: '20%', align: 'center' },
  {
    title: '事件源',
    dataIndex: 'eventSource',
    width: '8%',
    align: 'center',
    customRender: ({ text }) => {
      if (text === '0.0.0.0') {
        return '-'
      } else {
        return text
      }
    }
  },
  {
    title: '事件目的',
    dataIndex: 'eventTarget',
    width: '8%',
    align: 'center',
    customRender: ({ text }) => {
      if (text === '0.0.0.0') {
        return '-'
      } else {
        return text
      }
    }
  },
  { title: '日志源', dataIndex: 'logSource', width: '8%', align: 'center' },
  { title: '操作', dataIndex: 'oparetion', width: '18%', align: 'center' }
]

export const mergeColumns: TableColumnsType = [
  { title: '序号', dataIndex: 'index', width: '5%', align: 'center' },
  {
    title: '时间',
    dataIndex: 'time',
    sorter: true,
    width: '10%',
    align: 'center',
    customRender(opt) {
      return formatToDateTime(opt.record.time)
    }
  },
  { title: '源名称', dataIndex: 'srouceName', width: '10%', align: 'center' },
  { title: '目的名称', dataIndex: 'targetName', width: '8%', align: 'center' },
  { title: '事件名称', dataIndex: 'eventName', width: '10%', align: 'center' },
  { title: '事件类型', dataIndex: 'eventType', width: '18%', align: 'center' },
  { title: '资产名称', dataIndex: 'assetsName', width: '8%', align: 'center' },
  { title: '应用层协议', dataIndex: 'agreement', width: '8%', align: 'center' },
  { title: '威胁级别', dataIndex: 'threatLeval', width: '18%', align: 'center' }
]
