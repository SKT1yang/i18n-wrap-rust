import { t } from "../languages/index";
import EventAlarmTag from "../views/threat/components/EventAlarmTag.vue";
enum EventColorEnum {
	DANGER = "#ff3e32",
	WARNING = "#ff9432",
	LOW = "#ffcd32",
	INFO = "#1890ff",
	SUCCESS = "#32ff90",
}
enum EventLabelEnum {
	DANGER = t("高风险"),
	WARNING = t("中风险"),
	LOW = t("低风险"),
	INFO = t("信息"),
	SUCCESS = t("无风险"),
}
type OptionType = "score" | "level";
export function getOptions(type: OptionType) {
	return [{
		key: 0,
		label: EventLabelEnum.DANGER,
		value: type === "score" ? 10 : 1,
		color: EventColorEnum.DANGER
	}, {
		key: 1,
		label: EventLabelEnum.WARNING,
		value: type === "score" ? 5 : 2,
		color: EventColorEnum.WARNING
	}, {
		key: 2,
		label: EventLabelEnum.LOW,
		value: type === "score" ? 2 : 3,
		color: EventColorEnum.LOW
	}, {
		key: 3,
		label: EventLabelEnum.INFO,
		value: type === "score" ? 0 : 4,
		color: EventColorEnum.INFO
	},];
}
export function getOptionItem(num: number, type: OptionType) {
	const targetItem = getOptions(type).find((item) => {
		return item.value === num;
	});
	return targetItem;
}
