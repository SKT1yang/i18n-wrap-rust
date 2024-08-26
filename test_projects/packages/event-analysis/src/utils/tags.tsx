import EventAlarmTag from "../views/components/EventAlarmTag.vue";

enum EventColorEnum {
  DANGER = "#ff3e32",
  WARNING = "#ff9432",
  LOW = "#ffcd32",
  INFO = "#1890ff",
  SUCCESS = "#32ff90",
}

enum EventLabelEnum {
  DANGER = "高风险",
  WARNING = "中风险",
  LOW = "低风险",
  INFO = "信息",
  SUCCESS = "无风险",
}

type OptionType = "score" | "level";

/**
 * 获取告警级别下拉选项
 * @param type 告警类型
 * @returns
 */
export function getOptions(type: OptionType) {
  return [
    {
      key: 0,
      label: EventLabelEnum.DANGER,
      value: type === "score" ? 10 : 1,
      color: EventColorEnum.DANGER,
    },
    {
      key: 1,
      label: EventLabelEnum.WARNING,
      value: type === "score" ? 5 : 2,
      color: EventColorEnum.WARNING,
    },
    {
      key: 2,
      label: EventLabelEnum.LOW,
      value: type === "score" ? 2 : 3,
      color: EventColorEnum.LOW,
    },
    {
      key: 3,
      label: EventLabelEnum.INFO,
      value: type === "score" ? 0 : 4,
      color: EventColorEnum.INFO,
    },
  ];
}

/**
 * 告警标签渲染函数
 * @param num 分数值
 * @param type 告警类型
 * @returns tag组件
 */
export function renderTag(num: number, type: OptionType) {
  if (type === "level") {
    return <EventAlarmTag level={num as any} />;
  } else {
    return <EventAlarmTag score={num as any} />;
  }
}

/**
 * 获取告警项
 * @param num 分数值
 * @param type 告警类型
 * @returns 分数对应选项
 */
export function getOptionItem(num: number, type: OptionType) {
  const targetItem = getOptions(type).find((item) => {
    return item.value === num;
  });
  return targetItem;
}
