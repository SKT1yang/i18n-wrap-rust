import type { TableColumnsType } from "ant-design-vue"


const emptyPlace = ({ text }) => {
  return text ? text : '-'
}

// 资产状态表格列
export const columns: TableColumnsType = [
  {
    title: '资产组',
    dataIndex: 'assetGroup',
    customRender({ record }) {
      return record?.assetGroup?.label ?? '-';
    },
    align: "center"
  },
  {
    title: '资产品牌',
    dataIndex: 'trademarkName',
    align: "center",
    customRender: emptyPlace
  },
  {
    title: '资产名称',
    dataIndex: 'name',
    align: "center"
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    align: "center"
  },
  {
    title: '运行状态',
    dataIndex: 'runStatus',
    customRender: ({ text }) => {
      const arr = ['离线', '在线', '闲置'];
      return arr[text];
    },
    align: "center"
  },
  { title: "操作", key: "4", dataIndex: "operation", width: "150px", align: "center" }
];
