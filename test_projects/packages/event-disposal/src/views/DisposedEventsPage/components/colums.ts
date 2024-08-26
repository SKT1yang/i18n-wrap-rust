import { TableColumnsType } from 'ant-design-vue'

export const columns: TableColumnsType = [
  { title: '序号', dataIndex: 'index', align: 'center', width: '4%' },
  {
    title: '时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    align: 'center',
    width: '12%'
  },
  { title: '事件名称', dataIndex: 'eventName', align: 'center', width: '8%' },
  { title: '威胁等级', dataIndex: 'eventLevel', align: 'center', width: '8%' },
  { title: '事件详情', dataIndex: 'naturalLanguageDescription', align: 'center', width: '20%' },
  { title: '事件源', dataIndex: 'srcAssetName', align: 'center', width: '8%' },
  { title: '事件目的', dataIndex: 'dstIp', width: '8%', align: 'center' },
  { title: '日志源', dataIndex: 'logSourceName', align: 'center', width: '10%' },
  { title: '处置人', dataIndex: 'treatBy', align: 'center', width: '10%' },
  {
    title: '处置信息',
    dataIndex: 'treatDescription',
    ellipsis: true,
    align: 'center',
    width: '10%'
  }
]
