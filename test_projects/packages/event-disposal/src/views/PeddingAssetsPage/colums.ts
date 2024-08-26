import { TableColumnType } from 'ant-design-vue'

const columns: TableColumnType[] = [
  { title: '序号', dataIndex: 'showIndex', width: '3%', align: 'center' },
  { title: '资产名称', dataIndex: 'name', width: '10%', sorter: true, align: 'center' },
  { title: 'IP地址', dataIndex: 'assetIp', width: '10%', sorter: true, align: 'center' },
  { title: 'MAC 地址', dataIndex: 'assetMac', width: '8%', sorter: true, align: 'center' },
  { title: '资产类型', dataIndex: 'assetTypeName', width: '8%', sorter: true, align: 'center' },
  { title: '资产系列', dataIndex: 'assetSeriesName', width: '8%', sorter: true, align: 'center' },
  { title: '资产域', dataIndex: 'assetField', width: '8%', sorter: true, align: 'center' },
  { title: '资产组', dataIndex: 'assetGroup', width: '8%', sorter: true, align: 'center' },
  { title: '在线状态', dataIndex: 'runStatus', width: '8%', sorter: true, align: 'center' },
  { title: '操作', dataIndex: 'oparetion', width: '10%', align: 'center' }
]

export { columns }
