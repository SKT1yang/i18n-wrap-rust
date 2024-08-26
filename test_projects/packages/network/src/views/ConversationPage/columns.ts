import { formatToDate } from "@guolisec/utils";
import type { TableColumnsType } from "ant-design-vue";

const basicColumns: TableColumnsType = [
  {
    title: '设备名称',
    dataIndex: 'assetName',
    align: 'center',
  },
  {
    title: '源资产',
    dataIndex: 'srcIp',
    align: 'center',
    customRender: ({ text }) => {
      return text ? text : '-';
    },
  },
  {
    title: '源资产MAC',
    dataIndex: 'srcMac',
    align: 'center',
    customRender: ({ text }) => {
      return text ? text : '-';
    },
  },
  {
    title: '源端口',
    dataIndex: 'srcPort',
    align: 'center',
  },
  {
    title: '目的资产',
    dataIndex: 'dstIp',
    align: 'center',
    customRender: ({ text }) => {
      return text ? text : '-';
    },
  },
  {
    title: '目的资产MAC',
    dataIndex: 'dstMac',
    align: 'center',
    customRender: ({ text }) => {
      return text ? text : '-';
    },
  },
  {
    title: '目的端口',
    dataIndex: 'dstPort',
    align: 'center',
  },
  {
    title: '应用层协议',
    dataIndex: 'applayerProtocolName',
    align: 'center',
    customRender: ({ text }) => {
      return text ? text : '-';
    },
  },
  {
    title: '传输层协议',
    dataIndex: 'translayerProtocolName',
    align: 'center',
    customRender: ({ text }) => {
      return text ? text : '-';
    },
  },
  {
    title: '上行',
    dataIndex: 'up',
    align: 'center',
    children: [
      {
        title: '包数(个)',
        dataIndex: 'upPktNum',
        align: 'center',
      },
      {
        title: '字节数(Byte)',
        dataIndex: 'upTraffic',
        align: 'center',
      },
    ],
  },
  {
    title: '下行',
    dataIndex: 'up',
    align: 'center',
    children: [
      {
        title: '包数(个)',
        dataIndex: 'downPktNum',
        align: 'center',
      },
      {
        title: '字节数(Byte)',
        dataIndex: 'downTraffic',
        align: 'center',
      },
    ],
  },
  {
    title: '接口',
    dataIndex: 'networkInterface',
    align: 'center',
  },
  {
    title: '开始时间',
    dataIndex: '@timestamp',
    defaultSortOrder: 'descend',
    align: 'center',
    customRender: ({ text }) => {
      return formatToDate(text, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '会话状态',
    dataIndex: 'status',
    align: 'center',
    customRender: ({ text }) => {
      if (text === 0) {
        return '已新建';
      } else if (text === 1) {
        return '已连接';
      } else if (text === 2) {
        return '已断开';
      } else if (text === 4) {
        return '已超时';
      }
    },
  },
  {
    title: '信任状态',
    dataIndex: 'status',
    align: 'center',
    customRender: ({ text }) => {
      if (text === true) {
        return '信任';
      } else {
        return '不信任';
      }
    },
  },
  {
    title: '功能码',
    dataIndex: 'operation',
    align: 'center'
  },
]
export {
  basicColumns
}