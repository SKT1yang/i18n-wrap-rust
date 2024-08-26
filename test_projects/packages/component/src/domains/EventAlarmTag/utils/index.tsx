type OptionType = 'score' | 'level';

enum EventColorEnum {
  DANGER = '#ff3e32',
  WARNING = '#ff9432',
  LOW = '#ffcd32',
  INFO = '#1890ff',
  SUCCESS = '#32ff90',
}

enum EventLabelEnum {
  DANGER = '高风险',
  WARNING = '中风险',
  LOW = '低风险',
  INFO = '信息',
  SUCCESS = '无风险',
}

/**
 * 获取告警级别下拉选项
 * @param type 告警类型
 * @returns
 */
function getOptions(type: OptionType) {
  return [
    {
      key: 0,
      label: EventLabelEnum.DANGER,
      value: type === 'score' ? 10 : 1,
      color: EventColorEnum.DANGER,
    },
    {
      key: 1,
      label: EventLabelEnum.WARNING,
      value: type === 'score' ? 5 : 2,
      color: EventColorEnum.WARNING,
    },
    {
      key: 2,
      label: EventLabelEnum.LOW,
      value: type === 'score' ? 2 : 3,
      color: EventColorEnum.LOW,
    },
    {
      key: 3,
      label: EventLabelEnum.INFO,
      value: type === 'score' ? 0 : 4,
      color: EventColorEnum.INFO,
    },
  ];
}

/**
 * 获取告警项
 * @param num 分数值
 * @param type 告警类型
 * @returns 分数对应选项
 */
function getOptionItem(num: number, type: OptionType) {
  const targetItem = getOptions(type).find((item) => {
    return item.value === num;
  });
  return targetItem;
}

export {
  getOptions,
  getOptionItem
}