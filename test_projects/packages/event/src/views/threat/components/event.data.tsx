import EventAlarmTag from "./EventAlarmTag.vue";
import { formatToDateTime } from "@guolisec/utils";
import type { TableColumnsType } from "ant-design-vue";

export const columns: TableColumnsType = [
  {
    title: "序号",
    dataIndex: "showIndex",
    align: "center",
  },
  {
    title: "时间",
    dataIndex: "createTime",
    defaultSortOrder: "descend",
    customRender(opt) {
      return formatToDateTime(opt.record.createTime);
    },
    align: "center",
  },
  {
    title: "日志源类型",
    dataIndex: "logSourceTypeName",
    align: "center",
  },
  {
    title: "日志源",
    dataIndex: "logSourceName",
    align: "center",
  },
  {
    title: "攻击源",
    dataIndex: "srcIp",
    align: "center",
  },
  {
    title: "事件名称",
    dataIndex: "eventName",
    align: "center",
  },
  {
    title: "威胁等级",
    dataIndex: "score",
    customRender(opt) {
      return <EventAlarmTag score={opt.record.score} />;
    },
    align: "center",
  },
  {
    title: "攻击详情",
    dataIndex: "naturalLanguageDescription",
    align: "center",
  },
  {
    title: "发生次数",
    dataIndex: "count",
    sorter: true,
    align: "center",
  },
];
