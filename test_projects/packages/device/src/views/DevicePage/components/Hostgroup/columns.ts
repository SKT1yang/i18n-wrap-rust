import { ColumnsType } from "ant-design-vue/es/table";
function emptyRender(val) {
  return !val ? '-' : val;
}

const hostColumns: ColumnsType = [
  {
    title: '设备名称',
    dataIndex: 'hostName',
    sorter: true,
  },
  {
    title: 'IP 地址',
    sorter: true,
    dataIndex: 'ip',
    customRender(opt) {
      return emptyRender(opt.record['ip']);
    },
  },
  {
    title: '注册时间',
    sorter: true,
    dataIndex: 'createTime'
  },
  {
    title: '版本',
    dataIndex: ['environmentVO', 'version']
  },
  {
    title: '模式',
    dataIndex: 'deviceMode',
    width: 150,
  },
  {
    title: '在线状态',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: 'CPU 使用率',
  },
  {
    title: '内存使用率',
  },
  {
    title: '磁盘使用率',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
    width: 200,
    fixed: 'right'
  },
];

export {
  hostColumns
}