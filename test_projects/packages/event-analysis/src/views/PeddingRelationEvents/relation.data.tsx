import { formatToDateTime, formatToDate } from "../../utils/dateUtil";
import type { IEventRecord, DescItem } from "../../types/peddingRelationEvents";
import EventAlarmTag from "../../views/components/EventAlarmTag.vue";
import type { TableColumnsType } from "ant-design-vue";
/**
 * 未处置事件table
 */
export const columns: TableColumnsType = [
  {
    title: "序号",
    dataIndex: "indexShow",
    align: "center",
    width: 100,
  },
  {
    title: "时间",
    dataIndex: "@timestamp",
    align: "center",
    sorter: true,
    defaultSortOrder: "descend",
    customRender: ({ text }) => {
      return formatToDate(text, "YYYY-MM-DD HH:mm:ss");
    },
    width: 300,
  },
  {
    title: "事件名称",
    dataIndex: "eventName",
    align: "center",
    customRender: ({ text }) => {
      return text ? text : "-";
    },
    width: 300,
  },
  {
    title: "事件内容",
    align: "center",
    customRender: ({ record }) => {
      const composeDetailA = JSON.parse(record.composeDetailA);
      const composeDetailB = JSON.parse(record.composeDetailB);
      return `${composeDetailA.eventName} - ${composeDetailB.eventName}`;
    },
    width: 300,
  },
  // {
  //   title: '事件类型',
  //   dataIndex: 'eventType',
  //   align: 'center',
  //   width: 300,
  // },
  {
    title: "事件级别",
    dataIndex: "eventLevel",
    align: "center",
    customRender(opt) {
      return <EventAlarmTag level={opt.record.eventLevel} />;
    },
    width: 300,
  },
  {
    title: "事件源",
    dataIndex: "srcName",
    align: "center",
    customRender: ({ record }) => {
      const ip = record.srcIp;
      if (ip === null || ip === "" || ip === "0.0.0.0" || ip === undefined) {
        return "-";
      } else {
        return record.srcName ? record.srcName : record.srcIp;
      }
    },
    width: 300,
  },
  {
    title: "事件目的",
    dataIndex: "dstName",
    align: "center",
    customRender: ({ record }) => {
      const ip = record.dstIp;
      if (ip === null || ip === "" || ip === "0.0.0.0" || ip === undefined) {
        return "-";
      } else {
        return record.dstName ? record.dstName : record.dstIp;
      }
    },
    width: 300,
  },
  {
    title: "协议",
    dataIndex: "appProtocol",
    align: "center",
    customRender: ({ record }) => {
      if (
        record.applayerProtocolId === 0 ||
        record.applayerProtocolId === 168
      ) {
        return record.translayerProtocol;
      } else {
        return record.appProtocol;
      }
    },
    width: 300,
  },
  {
    title: "日志数据源",
    dataIndex: "logSourceName",
    align: "center",
    width: 300,
  },
];

/**
 * 事件合并table
 */
export const eventMergecolumns: TableColumnsType = [
  {
    title: "时间",
    dataIndex: "@timestamp",
    customRender(opt) {
      return formatToDateTime(opt.record["@timestamp"]);
    },
  },
  {
    title: "源名称",
    dataIndex: "srcName",
    customRender({ record }) {
      return record?.srcName ?? "-";
    },
  },
  {
    title: "目的名称",
    dataIndex: "dstName",
    customRender({ record }) {
      return record?.dstName ?? "-";
    },
  },
  {
    title: "事件名称",
    dataIndex: "eventName",
  },
  {
    title: "事件类型",
    dataIndex: "eventType",
  },
  {
    title: "资产名称",
    dataIndex: "deviceName",
  },
  {
    title: "协议",
    dataIndex: "appProtocol",
    customRender: ({ record }) => {
      if (
        record.applayerProtocolId === 0 ||
        record.applayerProtocolId === 168
      ) {
        return record.translayerProtocol;
      } else {
        return record.appProtocol;
      }
    },
  },
  {
    title: "威胁级别",
    dataIndex: "score",
    customRender(opt) {
      return <EventAlarmTag score={opt.record.score} />;
    },
  },
];

/**
 * 事件详情描述
 */
export function getEventDescSchema(data: IEventRecord): DescItem[] {
  const list: DescItem[] = [];
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      list.push({
        field: key,
        label: key,
      });
    }
  }
  return list;
}

/**
 * 事件详情描述
 */
export function getTime(time) {
  if (time) {
    return {
      start: formatToDateTime(time[0], "YYYY-MM-DD HH:mm:ss"),
      end: formatToDateTime(time[1], "YYYY-MM-DD HH:mm:ss"),
    };
  } else {
    return {
      start: "",
      end: "",
    };
  }
}
