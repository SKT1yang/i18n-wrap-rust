/*
 * @name: Do not edit
 * @description: Do not edit
 * @date: 2023-05-16 11:06:20
 * @path: \utils\src\date.ts
 */
import type { ConfigType } from 'dayjs';
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

function formatToDateTime(date: ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

function formatToDate(date: ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

function transferWeekValueToText(week: number) {
  switch (week) {
    case 0:
      return '日';
    case 1:
      return '一';
    case 2:
      return '二';
    case 3:
      return '三';
    case 4:
      return '四';
    case 5:
      return '五';
    case 6:
      return '六';
  }
}

function formatToCurrentToday(
  skip = false,
  format = DATE_TIME_FORMAT
): string[] {
  if (skip) {
    return [dayjs().startOf('D').format(), dayjs().format()];
  } else {
    return [dayjs().startOf('D').format(format), dayjs().format(format)];
  }
}

function transferWeekTextToValue(week: string) {
  if(['日', '周日', '星期天', '星期日'].includes(week)) {
    return 0
  }
  if(['一', '周一', '星期一'].includes(week)) {
    return 1
  }
  if(['二', '周二', '星期二'].includes(week)) {
    return 2
  }
  if(['三', '周三', '星期三'].includes(week)) {
    return 3
  }
  if(['四', '周四', '星期四'].includes(week)) {
    return 4
  }
  if(['五', '周五', '星期五'].includes(week)) {
    return 5
  }
  if(['六', '周六', '星期六'].includes(week)) {
    return 6
  }
}

export { formatToDateTime, formatToDate, transferWeekValueToText, transferWeekTextToValue, formatToCurrentToday, DATE_TIME_FORMAT, DATE_FORMAT };
