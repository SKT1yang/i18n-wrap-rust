/*
 * @Name: 待确认资产/已忽略资产页面 配置数据
 * @Description: Do not edit
 */
import type { TableColumnsType } from "ant-design-vue";
import { Tag } from "ant-design-vue";
/**
 * 待确认资产/已忽略资产-table
 */
export const columns: TableColumnsType = [
  {
    title: "资产名称",
    dataIndex: "name",
    sorter: true,
    align: "center",
    customRender({ record }) {
      return record?.name ?? "-";
    },
  },
  {
    title: "IP 地址",
    dataIndex: "assetIp",
    sorter: true,
    align: "center",
    customRender({ record }) {
      return record?.assetIp ?? "-";
    },
  },
  {
    title: "MAC 地址",
    dataIndex: "assetMac",
    align: "center",
    width: 160,
    sorter: true,
    customRender({ record }) {
      return record?.assetMac ?? "-";
    },
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    align: "center",
    sorter: true,
  },
  {
    title: "资产系列",
    dataIndex: "assetSeriesCode",
    align: "center",
    sorter: true,
    customRender({ record }) {
      return (
        <div title={record?.assetSeriesNameLong}>
          {record?.assetSeriesNameLong ?? "-"}
        </div>
      );
    },
  },
  {
    title: "品牌",
    dataIndex: "trademarkName",
    align: "center",
    customRender({ record }) {
      return record?.trademarkName ?? "-";
    },
  },
  {
    title: "运行状态",
    sorter: true,
    dataIndex: "runStatus",
    align: "center",
    customRender({ record }) {
      const runstatusSet = ["离线", "在线", "闲置"];
      const colorSet = ["red", "green", "orange"];
      return (
        <Tag color={colorSet[record.runStatus]}>
          {runstatusSet[record.runStatus]}
          {record.runStatus}
        </Tag>
      );
    },
  },
  { title: "操作", dataIndex: "operation", width: "250px", align: "center" },
];
