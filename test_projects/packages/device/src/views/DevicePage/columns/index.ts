import { TableColumnsType } from "ant-design-vue"
import { formatToDate } from '@guolisec/utils';

const columns: TableColumnsType = [
  {
    title: '设备名称',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: 'IP 地址',
    dataIndex: 'assetIp',
    sorter: true,
    customRender({ record }) {
      return record?.assetIp ?? '-';
    },
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    sorter: true,
    width: 180,
    customRender({ record }) {
      return record?.assetTypeName ?? '-';
    },
  },
  {
    title: '软件版本',
    dataIndex: 'softwareVersion',
    width: 260,
    ellipsis: true,
    sorter: true,
    customRender({ record }) {
      return record?.softwareVersion ?? '-';
    },
  },
  {
    title: '运行状态',
    sorter: true,
    dataIndex: 'runStatus',
  },
  {
    title: '升级状态',
    dataIndex: 'mntStatus',
    customRender({ text }) {
      let status = '未升级';
      if (text === 0) {
        status = '失败';
      } else if (text === 1) {
        status = '成功';
      } else if (text === 3) {
        status = '超时';
      } else if (text === 2) {
        status = '升级中';
      } else if (text === 4) {
        status = '等待升级';
      }
      return status;
    },
  },
  {
    title: 'CPU 使用率'
  },
  {
    title: '内存使用率'
  },
  {
    title: '磁盘使用率'
  },
  {
    title: '资产组',
    dataIndex: 'assetGroup',
    sorter: true,
    customRender({ record }) {
      return record?.assetGroup?.label ?? '-';
    },
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    defaultSortOrder: 'descend',
    align: 'center',
    sorter: true,
    width: 200,
    customRender: ({ text }) => {
      return formatToDate(text, 'YYYY-MM-DD HH:mm:ss');
    },
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
  columns
}