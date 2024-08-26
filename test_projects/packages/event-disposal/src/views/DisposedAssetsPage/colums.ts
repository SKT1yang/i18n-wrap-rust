import { TableColumnType } from 'ant-design-vue'

export const columns: TableColumnType[] = [
  { title: '序号', dataIndex: 'indexShow', width: '3%', align: 'center' },
  { title: '资产名称', dataIndex: 'name', sorter: true, width: '10%', align: 'center' },
  { title: 'IP地址', dataIndex: 'assetIp', sorter: true, width: '10%', align: 'center' },
  { title: 'MAC 地址', dataIndex: 'assetMac', sorter: true, width: '8%', align: 'center' },
  { title: '资产类型', dataIndex: 'assetTypeName', sorter: true, width: '8%', align: 'center' },
  { title: '资产系列', dataIndex: 'assetSeriesName', sorter: true, width: '8%', align: 'center' },
  { title: '资产域', dataIndex: 'assetField', sorter: true, width: '8%', align: 'center' },
  { title: '资产组', dataIndex: 'label', sorter: true, width: '8%', align: 'center' },
  { title: '在线状态', dataIndex: 'runStatus', sorter: true, width: '8%', align: 'center' },
  { title: '操作', dataIndex: 'oparetion', width: '10%', align: 'center' }
]
