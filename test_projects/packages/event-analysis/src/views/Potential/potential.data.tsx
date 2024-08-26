/*
 * @name: Do not edit
 * @description: Do not edit
 * @path: \event-analysis\src\views\Potential\potential.data.tsx
 */
import { formatToDateTime } from "../../utils/dateUtil";
import EventAlarmTag from "../components/EventAlarmTag.vue";
import type { TableColumnsType } from "ant-design-vue";

export const columns: TableColumnsType = [
  {
    title: "序号",
    dataIndex: "indexShow",
    align: "center",
    width: 70,
  },
  {
    title: "开始时间",
    dataIndex: "startDate",
    customRender: ({ record }) => {
      return formatToDateTime(record.startDate);
    },
    align: "center",
    width: 200,
  },
  {
    title: "结束时间",
    dataIndex: "endDate",
    defaultSortOrder: "descend",
    customRender: ({ record }) => {
      return formatToDateTime(record.endDate);
    },
    align: "center",
    width: 200,
  },
  {
    title: "发生次数",
    dataIndex: "count",
    customRender: ({ record }) => {
      return record.count + "次";
    },
    align: "center",
    width: 200,
  },
  {
    title: "事件名称",
    dataIndex: "name",
    align: "center",
    width: 200,
    customRender({ text }) {
      return text ? text : "-";
    },
  },
  {
    title: "事件类型",
    dataIndex: "eventTypeName",
    align: "center",
    width: 200,
    customRender({ text }) {
      return text ? text : "-";
    },
  },
  {
    title: "威胁级别",
    dataIndex: "eventTypeName",
    customRender(opt) {
      return <EventAlarmTag score={opt.record.score} />;
    },
    align: "center",
    width: 200,
  },
  {
    title: "事件特征",
    dataIndex: "characteristics",
    align: "center",
    width: 200,
    customRender({ text }) {
      return text ? text : "-";
    },
  },
  {
    title: "阈值",
    dataIndex: "threshold",
    customRender({ record }) {
      return unitValue(record.unit) + record.threshold + "次";
    },
    align: "center",
    width: 200,
  },
];

const unitValue = (unit) => {
  return ["累计", "每分钟", "每小时", "每天"][unit];
};
