import { t } from "..\\..\\..\\languages\\index";
import { getSearchAggTermApi } from "../../../model/event";
import { useEventTypeOpts } from "../../../views/audit/hooks/useEventTypeOpts";
import dayjs from "dayjs/esm/index";
import type { TableColumnsType } from "ant-design-vue";
const { getEventTypeRef } = useEventTypeOpts();
export const columns: TableColumnsType = [{
	title: t("事件名称"),
	dataIndex: "eventName",
	align: "center",
	customRender: ({ text }) => {
		return text ? text : "-";
	}
}, {
	title: t("事件类型"),
	dataIndex: "eventType",
	align: "center",
	customRender: ({ text }) => {
		return text ? text : "-";
	}
}, {
	title: t("事件级别"),
	dataIndex: "eventLevel",
	customRender: ({ text }) => {
		const arr = [t("高风险"), t("中风险"), t("低风险"), t("信息")];
		return arr[text - 1];
	},
	align: "center"
}, {
	title: t("源名称"),
	dataIndex: "srcName",
	customRender: ({ text }) => {
		return text ? text : "-";
	},
	align: "center"
}, {
	title: t("目的名称"),
	dataIndex: "dstName",
	customRender: ({ text }) => {
		return text ? text : "-";
	},
	align: "center"
}, {
	title: t("协议"),
	dataIndex: "appProtocol",
	customRender: ({ record }) => {
		if (record.applayerProtocolId === 0 || record.applayerProtocolId === 168) {
			return record.translayerProtocol ?? "-";
		} else {
			return record.appProtocol ?? "-";
		}
	},
	align: "center"
}, {
	title: t("时间"),
	dataIndex: "@timestamp",
	align: "center"
}, {
	title: t("操作"),
	dataIndex: "operation",
	align: "center"
},];
export const searchFormSchema = [{
	label: t("时间"),
	field: "createTime",
	component: "RangePicker",
	colProps: { span: 8 },
	componentProps: {
		showTime: {
			format: "HH:mm",
			defaultValue: [dayjs("00:00:00", "HH:mm:ss"), dayjs("23:59:59", "HH:mm:ss"),]
		},
		format: "YYYY-MM-DD HH:mm"
	}
}, {
	label: t("事件类型"),
	field: "eventType",
	component: "Cascader",
	colProps: { span: 8 },
	componentProps: {
		options: getEventTypeRef,
		placeholder: t("请选择事件类型"),
		fieldNames: {
			label: "name",
			value: "id",
			children: "eventTypes"
		},
		expandTrigger: "hover",
		changeOnSelect: true,
		allowClear: false
	}
}, {
	label: t("日志源类型"),
	field: "logSourceType",
	component: "ApiSelect",
	colProps: { span: 8 },
	componentProps: {
		placeholder: t("请选择日志源类型"),
		api: getSearchAggTermApi,
		resultField: "logSourceType",
		labelField: "key",
		valueField: "key"
	}
}, {
	label: t("事件级别"),
	field: "eventLevel",
	component: "Select",
	colProps: { span: 8 },
	componentProps: {
		placeholder: t("请选择事件级别"),
		options: [{
			label: t("高风险"),
			value: 1,
			key: 1
		}, {
			label: t("中风险"),
			value: 2,
			key: 2
		}, {
			label: t("低风险"),
			value: 3,
			key: 3
		}, {
			label: t("信息"),
			value: 4,
			key: 4
		},]
	}
},];
export const eventOptions = [{
	label: t("高风险"),
	value: 1,
	key: 1
}, {
	label: t("中风险"),
	value: 2,
	key: 2
}, {
	label: t("低风险"),
	value: 3,
	key: 3
}, {
	label: t("信息"),
	value: 4,
	key: 4
},];
