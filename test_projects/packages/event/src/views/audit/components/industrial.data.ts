import { getSearchAggTermApi } from "../../../model/event";
import { useEventTypeOpts } from "../../../views/audit/hooks/useEventTypeOpts";
import dayjs from "dayjs/esm/index";
import type { TableColumnsType } from "ant-design-vue";

const { getEventTypeRef } = useEventTypeOpts();

// 事件表格列
export const columns: TableColumnsType = [
  {
    title: "事件名称",
    dataIndex: "eventName",
    align: "center",
    customRender: ({ text }) => {
      return text ? text : "-";
    },
  },
  {
    title: "事件类型",
    dataIndex: "eventType",
    align: "center",
    customRender: ({ text }) => {
      return text ? text : "-";
    },
  },
  {
    title: "事件级别",
    dataIndex: "eventLevel",
    customRender: ({ text }) => {
      const arr = ["高风险", "中风险", "低风险", "信息"];
      return arr[text - 1];
    },
    align: "center",
  },
  {
    title: "源名称",
    dataIndex: "srcName",
    customRender: ({ text }) => {
      return text ? text : "-";
    },
    align: "center",
  },
  {
    title: "目的名称",
    dataIndex: "dstName",
    customRender: ({ text }) => {
      return text ? text : "-";
    },
    align: "center",
  },
  {
    title: "协议",
    dataIndex: "appProtocol",
    customRender: ({ record }) => {
      if (
        record.applayerProtocolId === 0 ||
        record.applayerProtocolId === 168
      ) {
        return record.translayerProtocol ?? "-";
      } else {
        return record.appProtocol ?? "-";
      }
    },
    align: "center",
  },
  {
    title: "时间",
    dataIndex: "@timestamp",
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
  },
];

// 事件表格查询区表单
export const searchFormSchema = [
  {
    label: "时间",
    field: "createTime",
    component: "RangePicker",
    colProps: {
      span: 8,
    },
    componentProps: {
      showTime: {
        format: "HH:mm",
        defaultValue: [
          dayjs("00:00:00", "HH:mm:ss"),
          dayjs("23:59:59", "HH:mm:ss"),
        ],
      },
      format: "YYYY-MM-DD HH:mm",
    },
  },
  {
    label: "事件类型",
    field: "eventType",

    component: "Cascader",
    colProps: {
      span: 8,
    },
    componentProps: {
      options: getEventTypeRef,
      placeholder: "请选择事件类型",
      fieldNames: {
        label: "name",
        value: "id",
        children: "eventTypes",
      },
      expandTrigger: "hover",
      changeOnSelect: true,
      allowClear: false,
    },
  },
  {
    label: "日志源类型",
    field: "logSourceType",
    component: "ApiSelect",
    colProps: { span: 8 },
    componentProps: {
      placeholder: "请选择日志源类型",
      api: getSearchAggTermApi,
      resultField: "logSourceType",
      labelField: "key",
      valueField: "key",
    },
  },
  {
    label: "事件级别",
    field: "eventLevel",
    component: "Select",
    colProps: {
      span: 8,
    },
    componentProps: {
      placeholder: "请选择事件级别",
      options: [
        {
          label: "高风险",
          value: 1,
          key: 1,
        },
        {
          label: "中风险",
          value: 2,
          key: 2,
        },
        {
          label: "低风险",
          value: 3,
          key: 3,
        },
        {
          label: "信息",
          value: 4,
          key: 4,
        },
      ],
    },
  },
];

export const eventOptions = [
  {
    label: "高风险",
    value: 1,
    key: 1,
  },
  {
    label: "中风险",
    value: 2,
    key: 2,
  },
  {
    label: "低风险",
    value: 3,
    key: 3,
  },
  {
    label: "信息",
    value: 4,
    key: 4,
  },
];
